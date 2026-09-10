import ipaddress
import re
import socket
from urllib.parse import urlparse
from typing import Tuple, List

# Banned private, loopback, and link-local IP networks (SSRF defense)
BANNED_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("100.64.0.0/10"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),   # Cloud metadata (AWS/GCP/Azure)
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("198.18.0.0/15"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def is_safe_url(target_url: str) -> Tuple[bool, str]:
    """
    Validates a URL against SSRF attacks by resolving its hostname
    and checking resolved IP addresses against private / loopback ranges.
    """
    try:
        parsed = urlparse(target_url)
        if parsed.scheme not in ("http", "https"):
            return False, f"Unsupported scheme '{parsed.scheme}'. Only http and https are allowed."
        
        hostname = parsed.hostname
        if not hostname:
            return False, "Missing hostname in URL."
        
        # Check if hostname directly matches localhost or common internal names
        if hostname.lower() in ("localhost", "127.0.0.1", "0.0.0.0", "metadata.google.internal"):
            return False, "Access to internal / localhost domains is prohibited (SSRF prevention)."

        # Resolve DNS
        try:
            addr_info = socket.getaddrinfo(hostname, None)
        except socket.gaierror:
            # Domain cannot be resolved - partial analysis allowed, not SSRF
            return True, "Domain could not be resolved (unreachable)."

        for entry in addr_info:
            ip_str = entry[4][0]
            ip_obj = ipaddress.ip_address(ip_str)
            for banned in BANNED_NETWORKS:
                if ip_obj in banned:
                    return False, f"Target IP {ip_str} falls within forbidden network {banned} (SSRF blocked)."

        return True, "Safe"
    except Exception as e:
        return False, f"URL validation failed: {str(e)}"

# PII Redaction Patterns
PII_PATTERNS = [
    # Credit Card numbers (13-19 digits, with optional hyphens/spaces)
    (re.compile(r"\b(?:\d[ -]*?){13,19}\b"), "[REDACTED_CREDIT_CARD]"),
    # US SSN (XXX-XX-XXXX)
    (re.compile(r"\b\d{3}-\d{2}-\d{4}\b"), "[REDACTED_SSN]"),
    # Phone numbers (common international formats)
    (re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"), "[REDACTED_PHONE]"),
    # High-entropy API keys / Tokens (Bearer or secret token patterns)
    (re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"]?([A-Za-z0-9_\-\.]{16,})['\"]?"), r"\1: [REDACTED_SECRET]"),
]

def redact_pii(text: str) -> str:
    """
    Scrubs sensitive personal information (credit cards, SSNs, phone numbers, auth secrets)
    from text before forwarding to external models or logs.
    """
    if not text:
        return ""
    redacted = text
    for pattern, replacement in PII_PATTERNS:
        redacted = pattern.sub(replacement, redacted)
    return redacted
