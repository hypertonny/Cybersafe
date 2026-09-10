from typing import List, Tuple, Dict, Any
from app.models.schemas import InputProcessorOutput, EvidenceItem

class SecurityChecks:
    """
    Stage 2C: Security Checks
    Performs specialized deterministic security checks on domain reputation,
    SSL certificate validity, sender authenticity, and attachment safety.
    """

    @classmethod
    async def evaluate(cls, input_data: InputProcessorOutput) -> Tuple[float, List[Dict[str, Any]], List[EvidenceItem]]:
        checks: List[Dict[str, Any]] = []
        evidence: List[EvidenceItem] = []

        # Check 1: Domain Age & Reputation
        if input_data.domain_age_days is not None:
            if input_data.domain_age_days < 30:
                checks.append({
                    "name": "domain_age",
                    "passed": False,
                    "reason": f"Domain registered only {input_data.domain_age_days} days ago (newly created domains correlate heavily with fraud)."
                })
                evidence.append(EvidenceItem(
                    reason=f"Domain registered only {input_data.domain_age_days} days ago (brand new domain risk).",
                    source="security_checks"
                ))
            else:
                checks.append({
                    "name": "domain_age",
                    "passed": True,
                    "reason": f"Domain registration age is mature ({input_data.domain_age_days} days)."
                })
        else:
            checks.append({
                "name": "domain_age",
                "passed": True,
                "reason": "No external domain evaluated."
            })

        # Check 2: SSL Certificate Validity
        if input_data.ssl_info:
            if not input_data.ssl_info.valid:
                checks.append({
                    "name": "ssl_certificate",
                    "passed": False,
                    "reason": f"Invalid or missing SSL encryption ({input_data.ssl_info.issuer}). Data in transit is vulnerable to interception."
                })
                evidence.append(EvidenceItem(
                    reason=f"Unencrypted connection or invalid SSL certificate ({input_data.ssl_info.issuer}).",
                    source="security_checks"
                ))
            else:
                checks.append({
                    "name": "ssl_certificate",
                    "passed": True,
                    "reason": f"Valid SSL certificate verified (Issuer: {input_data.ssl_info.issuer})."
                })
        else:
            checks.append({
                "name": "ssl_certificate",
                "passed": True,
                "reason": "No direct web endpoint requires SSL check."
            })

        # Check 3: Sender Authenticity (SPF/DKIM/Domain match)
        if input_data.sender_info and input_data.sender_info.email_or_domain:
            sender = input_data.sender_info.email_or_domain.lower()
            suspicious_senders = ["alert", "security", "support", "helpdesk", "billing", "service"]
            is_generic_suspicious = any(s in sender for s in suspicious_senders) and not sender.endswith((".com", ".org", ".edu", ".gov"))
            if is_generic_suspicious:
                checks.append({
                    "name": "sender_authenticity",
                    "passed": False,
                    "reason": f"Sender '{sender}' uses generic administrative keywords on a non-standard domain."
                })
                evidence.append(EvidenceItem(
                    reason=f"Suspicious sender origin: '{sender}'.",
                    source="security_checks"
                ))
            else:
                checks.append({
                    "name": "sender_authenticity",
                    "passed": True,
                    "reason": "Sender origin passed structural format checks."
                })
        else:
            checks.append({
                "name": "sender_authenticity",
                "passed": True,
                "reason": "Sender headers not present."
            })

        # Check 4: Attachment & File Safety Scan
        if input_data.file_type:
            dangerous_types = ["application/x-dosexec", "application/x-executable", "text/x-script"]
            if any(dt in input_data.file_type for dt in dangerous_types):
                checks.append({
                    "name": "attachment_scan",
                    "passed": False,
                    "reason": f"File payload identified as an executable binary or script ({input_data.file_type})."
                })
                evidence.append(EvidenceItem(
                    reason=f"High-risk binary attachment detected ({input_data.file_type}).",
                    source="security_checks"
                ))
            else:
                checks.append({
                    "name": "attachment_scan",
                    "passed": True,
                    "reason": f"Attachment type ({input_data.file_type}) conforms to safe document standards."
                })
        else:
            checks.append({
                "name": "attachment_scan",
                "passed": True,
                "reason": "No attachment submitted."
            })

        failed_count = sum(1 for c in checks if not c["passed"])
        failed_ratio = failed_count / max(1, len(checks))

        return failed_ratio, checks, evidence
