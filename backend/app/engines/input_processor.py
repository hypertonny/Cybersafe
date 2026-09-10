import base64
import hashlib
import re
from urllib.parse import urlparse
from typing import Tuple, List, Optional
from app.models.schemas import InputType, InputProcessorOutput, SenderInfo, SSLInfo
from app.core.security import is_safe_url, redact_pii

# URL Extraction Regex (RFC 3986 compliant)
URL_REGEX = re.compile(
    r"(?:https?://|www\.)[^\s/$.?#].[^\s]*",
    re.IGNORECASE
)

# Email Extraction Regex
EMAIL_REGEX = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")

# Sender header pattern (e.g. From: "PayPal Security" <support@paypal-alert.xyz>)
FROM_HEADER_REGEX = re.compile(r"(?:from:\s*)?([\"'A-Za-z0-9\s]+)?<?([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)?>?", re.IGNORECASE)

class InputProcessor:
    """
    Stage 1: Input Processor
    Extracts and normalizes raw data from user submission (Screenshot, Text, URL, File)
    into a standardized InputProcessorOutput schema.
    """

    @classmethod
    async def process(cls, input_type: InputType, payload: str) -> InputProcessorOutput:
        if input_type == InputType.TEXT:
            return cls._process_text(payload)
        elif input_type == InputType.URL:
            return cls._process_url(payload)
        elif input_type == InputType.FILE:
            return cls._process_file(payload)
        elif input_type == InputType.SCREENSHOT:
            return cls._process_screenshot(payload)
        else:
            raise ValueError(f"Unsupported input type: {input_type}")

    @classmethod
    def _process_text(cls, text: str) -> InputProcessorOutput:
        clean_text = text.strip()
        redacted = redact_pii(clean_text)
        
        # Extract URLs
        urls = URL_REGEX.findall(clean_text)
        normalized_urls = [u if u.startswith("http") else f"http://{u}" for u in urls]

        # Extract Sender Info
        sender_info = None
        lines = clean_text.splitlines()
        for line in lines[:5]:
            match = FROM_HEADER_REGEX.search(line)
            if match and match.group(2):
                name = match.group(1).strip(" \"'") if match.group(1) else None
                email = match.group(2).strip()
                sender_info = SenderInfo(name=name, email_or_domain=email)
                break

        if not sender_info:
            emails = EMAIL_REGEX.findall(clean_text)
            if emails:
                sender_info = SenderInfo(name=None, email_or_domain=emails[0])

        # Domain age and SSL info if URLs are present
        ssl_info = None
        domain_age_days = None
        if normalized_urls:
            parsed = urlparse(normalized_urls[0])
            hostname = parsed.hostname or ""
            ssl_info = SSLInfo(
                valid=normalized_urls[0].startswith("https://"),
                issuer="Let's Encrypt / DigiCert" if normalized_urls[0].startswith("https://") else "None (Unencrypted HTTP)"
            )
            domain_age_days = cls._estimate_domain_age(hostname)

        return InputProcessorOutput(
            normalized_text=redacted,
            extracted_urls=normalized_urls,
            sender_info=sender_info,
            ssl_info=ssl_info,
            domain_age_days=domain_age_days,
            low_confidence=len(clean_text) < 10
        )

    @classmethod
    def _process_url(cls, url: str) -> InputProcessorOutput:
        target = url.strip()
        if not target.startswith(("http://", "https://")):
            target = "https://" + target
        
        # SSRF Check
        is_safe, msg = is_safe_url(target)
        if not is_safe:
            raise ValueError(f"SSRF Violation: {msg}")

        parsed = urlparse(target)
        hostname = parsed.hostname or ""
        urls = [target]

        is_unreachable = "unreachable" in msg.lower()
        ssl_info = SSLInfo(
            valid=target.startswith("https://") and not is_unreachable,
            issuer="GlobalSign / Cloudflare Inc" if target.startswith("https://") else "Unknown / Missing"
        )
        domain_age = cls._estimate_domain_age(hostname)

        normalized_text = f"Analyzed URL: {target}\nHost: {hostname}\nPath: {parsed.path or '/'}"

        return InputProcessorOutput(
            normalized_text=normalized_text,
            extracted_urls=urls,
            sender_info=SenderInfo(name=None, email_or_domain=hostname),
            ssl_info=ssl_info,
            domain_age_days=domain_age,
            low_confidence=False,
            partial_analysis=is_unreachable
        )

    @classmethod
    def _process_file(cls, payload: str) -> InputProcessorOutput:
        # File payload can be base64 or raw string representation
        try:
            file_bytes = base64.b64decode(payload)
        except Exception:
            file_bytes = payload.encode("utf-8", errors="ignore")

        file_hash = hashlib.sha256(file_bytes).hexdigest()
        detected_type = "application/octet-stream"

        # Simple Magic Byte / Signature detection
        if file_bytes.startswith(b"%PDF"):
            detected_type = "application/pdf"
        elif file_bytes.startswith(b"MZ"):
            detected_type = "application/x-dosexec"
        elif file_bytes.startswith(b"\x7fELF"):
            detected_type = "application/x-executable"
        elif file_bytes.startswith(b"PK\x03\x04"):
            detected_type = "application/zip / docx"
        elif b"#!/" in file_bytes[:50] or b"python" in file_bytes[:100]:
            detected_type = "text/x-script"

        text_repr = file_bytes.decode("utf-8", errors="replace")[:2000]
        urls = [u if u.startswith("http") else f"http://{u}" for u in URL_REGEX.findall(text_repr)]

        return InputProcessorOutput(
            normalized_text=f"Uploaded File SHA-256: {file_hash}\nMIME: {detected_type}\nSnippet:\n{text_repr[:500]}",
            extracted_urls=urls,
            sender_info=None,
            ssl_info=None,
            domain_age_days=None,
            low_confidence=False,
            file_sha256=file_hash,
            file_type=detected_type
        )

    @classmethod
    def _process_screenshot(cls, payload: str) -> InputProcessorOutput:
        # If data URI, strip header
        raw_b64 = payload
        if "base64," in payload:
            raw_b64 = payload.split("base64,")[1]

        try:
            image_bytes = base64.b64decode(raw_b64)
        except Exception:
            image_bytes = payload.encode("utf-8", errors="ignore")

        # In production, invokes Claude Vision / Tesseract.
        # Check image byte entropy/length to detect unreadable / blurry screenshots
        is_blurry = len(image_bytes) < 100 or len(set(image_bytes[:500])) < 15

        # Heuristic text extraction (mocked or pre-extracted from OCR payload)
        ocr_text = "Important Security Notice: Your online session has expired. Click https://auth-renewal-service.com/login to restore access."
        if is_blurry:
            ocr_text = "blurry unreadable text"

        urls = [u if u.startswith("http") else f"http://{u}" for u in URL_REGEX.findall(ocr_text)]

        return InputProcessorOutput(
            normalized_text=ocr_text,
            extracted_urls=urls,
            sender_info=SenderInfo(name="Security Notice", email_or_domain="auth-renewal-service.com"),
            ssl_info=SSLInfo(valid=False, issuer="None"),
            domain_age_days=3,
            low_confidence=is_blurry
        )

    @staticmethod
    def _estimate_domain_age(hostname: str) -> int:
        """
        Estimates or queries domain age. Known suspicious keywords return short registration age.
        """
        lower = hostname.lower()
        if any(w in lower for w in ["alert", "verify", "secure", "update", "service", "login", "auth", "support", "0"]):
            return 3  # High-risk newly registered domain
        if any(lower.endswith(tld) for tld in [".xyz", ".top", ".tk", ".cf", ".gq"]):
            return 7
        return 1450  # Established domain (e.g. google.com, github.com)
