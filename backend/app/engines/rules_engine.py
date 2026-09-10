import re
from typing import List, Tuple
from app.models.schemas import InputProcessorOutput, EvidenceItem, ThreatCategory

# Rule definitions: (Pattern, Signal Name, Severity Weight, Description, Category)
SIGNATURE_RULES = [
    (
        re.compile(r"(?i)\b(immediate(ly)?\s+action|within\s+(?:24|48)\s*hours?|account\s+(?:suspended|locked|terminated|blocked|disabled)|act\s+now|urgent(?:ly)?)\b"),
        "urgent_language",
        0.30,
        "Contains urgent or coercive language demanding immediate action under penalty.",
        ThreatCategory.PHISHING
    ),
    (
        re.compile(r"(?i)\b(enter\s+your\s+password|verify\s+(?:your\s+)?(?:otp|pin|credentials)|social\s+security\s+number|credit\s+card\s+details|billing\s+information)\b"),
        "credential_solicitation",
        0.35,
        "Explicitly requests sensitive credentials, passwords, or one-time passcodes (OTP).",
        ThreatCategory.PHISHING
    ),
    (
        re.compile(r"(?i)\b(paypa1|micros0ft|g00gle|netflx|amaz0n|app1e|chase-security|wellsfarg0)\b"),
        "brand_spoofing",
        0.40,
        "Displays homoglyph or lookalike brand impersonation (typosquatting).",
        ThreatCategory.PHISHING
    ),
    (
        re.compile(r"(?i)\b(?:https?://)?(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|ow\.ly|cutt\.ly)/[a-zA-Z0-9_-]+"),
        "shortened_url",
        0.25,
        "Uses an obfuscated/shortened URL concealing the ultimate destination domain.",
        ThreatCategory.MALICIOUS_URL
    ),
    (
        re.compile(r"(?i)\.(exe|bat|cmd|vbs|ps1|scr|jar|pif|hta|apk)\b"),
        "executable_extension",
        0.50,
        "References or delivers dangerous executable or script file extensions.",
        ThreatCategory.MALWARE
    ),
    (
        re.compile(r"(?i)\b(wire\s+transfer|gift\s+cards?|western\s+union|crypto\s+transfer|send\s+money|i\s+lost\s+my\s+phone)\b"),
        "financial_solicitation",
        0.35,
        "Demands untraceable monetary payments, gift cards, or wire transfers.",
        ThreatCategory.SOCIAL_ENGINEERING
    ),
    (
        re.compile(r"(?i)\b(password\s+123|admin123|change\s+password|mfa\s+bypass|session\s+token)\b"),
        "account_credential_risk",
        0.30,
        "Detects exposed authentication secrets or weak default credential references.",
        ThreatCategory.ACCOUNT_SECURITY
    ),
    (
        re.compile(r"(?i)(\b(select\s+\*\s+from|union\s+select|<script>|javascript:|alert\()|--|1=1)"),
        "web_injection_payload",
        0.45,
        "Contains web injection payloads (SQLi or Cross-Site Scripting XSS patterns).",
        ThreatCategory.WEB_SECURITY
    )
]

class RulesEngine:
    """
    Stage 2A: Deterministic Rules Engine
    Scans normalized text and metadata using regex signatures and heuristic rules.
    """

    @classmethod
    async def evaluate(cls, input_data: InputProcessorOutput) -> Tuple[float, List[str], List[EvidenceItem], ThreatCategory]:
        text_to_scan = input_data.normalized_text
        for u in input_data.extracted_urls:
            text_to_scan += f" {u}"
        if input_data.filename:
            text_to_scan += f" {input_data.filename}"

        matched_signals: List[str] = []
        evidence_items: List[EvidenceItem] = []
        total_weight = 0.0
        primary_category = ThreatCategory.PHISHING

        highest_cat_weight = 0.0

        for pattern, signal_name, weight, description, category in SIGNATURE_RULES:
            if pattern.search(text_to_scan):
                matched_signals.append(signal_name)
                evidence_items.append(EvidenceItem(reason=description, source="rules_engine"))
                total_weight += weight
                if weight > highest_cat_weight:
                    highest_cat_weight = weight
                    primary_category = category

        # Sender domain mismatch heuristic
        if input_data.sender_info and input_data.sender_info.email_or_domain:
            sender = input_data.sender_info.email_or_domain.lower()
            if any(brand in text_to_scan.lower() for brand in ["paypal", "apple", "microsoft", "google"]):
                if not any(valid in sender for valid in ["paypal.com", "apple.com", "microsoft.com", "google.com"]):
                    matched_signals.append("sender_mismatch")
                    evidence_items.append(EvidenceItem(
                        reason=f"Sender domain '{sender}' does not match the claimed corporate brand.",
                        source="rules_engine"
                    ))
                    total_weight += 0.35

        # Normalize score to [0.0, 1.0]
        rules_score = min(1.0, total_weight)
        return rules_score, matched_signals, evidence_items, primary_category
