from typing import List
from app.models.schemas import RiskAssessment, ActionPlan, RiskLevel, ThreatCategory

class ActionPlanGenerator:
    """
    Stage 5: Action Plan Generator
    Produces clear, structured next steps answering:
    - What happened?
    - Why is it risky?
    - What should you do? (concrete ordered list)
    """

    @classmethod
    def generate(cls, risk: RiskAssessment) -> ActionPlan:
        # 1. What happened?
        what_happened = cls._determine_what_happened(risk)

        # 2. Why is it risky?
        why_risky = cls._determine_why_risky(risk)

        # 3. What should you do?
        what_to_do = cls._determine_what_to_do(risk)

        return ActionPlan(
            what_happened=what_happened,
            why_risky=why_risky,
            what_to_do=what_to_do
        )

    @classmethod
    def _determine_what_happened(cls, risk: RiskAssessment) -> str:
        if risk.risk_level == RiskLevel.HIGH:
            if risk.category == ThreatCategory.PHISHING:
                return "You received a deceptive phishing communication attempting to harvest credentials."
            elif risk.category == ThreatCategory.MALWARE:
                return "A high-risk file or script payload was submitted that exhibits malicious characteristics."
            elif risk.category == ThreatCategory.MALICIOUS_URL:
                return "A suspicious web link was submitted that routes to an untrusted or newly registered domain."
            else:
                return f"A high-risk cybersecurity threat ({risk.category.value}) was detected in the submitted content."
        elif risk.risk_level == RiskLevel.MEDIUM:
            return "Suspicious digital content was analyzed that contains ambiguous or potentially unsafe indicators."
        else:
            return "The submitted digital content was scanned and verified to be within safe, normal parameters."

    @classmethod
    def _determine_why_risky(cls, risk: RiskAssessment) -> str:
        if risk.risk_level == RiskLevel.HIGH:
            if risk.category == ThreatCategory.PHISHING or risk.category == ThreatCategory.SOCIAL_ENGINEERING:
                return "Attackers can intercept your credentials, take over your online accounts, or steal financial funds."
            elif risk.category == ThreatCategory.MALWARE:
                return "Executing this file may install harmful malware or ransomware, encrypting your data or compromising your device."
            else:
                return "Engaging with this resource may lead to unauthorized data disclosure and identity compromise."
        elif risk.risk_level == RiskLevel.MEDIUM:
            return "Interacting with unverified senders or newly created domains carries risk of targeted phishing."
        else:
            return "No critical dangers detected, but maintaining standard caution is always recommended."

    @classmethod
    def _determine_what_to_do(cls, risk: RiskAssessment) -> List[str]:
        if risk.risk_level == RiskLevel.HIGH:
            if risk.category == ThreatCategory.PHISHING or risk.category == ThreatCategory.SOCIAL_ENGINEERING:
                return [
                    "Do not click the link.",
                    "Do not share your password, OTP or personal details.",
                    "Verify through the official website or contact the organization directly.",
                    "If you already entered your details, change your password immediately."
                ]
            elif risk.category == ThreatCategory.MALWARE:
                return [
                    "Do not open, run, or extract the uploaded file.",
                    "Delete the file immediately from your downloads and empty the trash.",
                    "Run a full system anti-virus scan on your computer.",
                    "If opened, disconnect your computer from the network and consult IT support."
                ]
            else:
                return [
                    "Do not proceed to the target link or submit information.",
                    "Block the sender or blacklist the domain in your security settings.",
                    "Report this event to your organization's security team or email provider."
                ]
        elif risk.risk_level == RiskLevel.MEDIUM:
            return [
                "Verify the sender's identity through an independent, trusted channel (e.g. phone call).",
                "Do not enter passwords or financial information on the linked page.",
                "Hover over any links to verify the true destination URL matches official company domains."
            ]
        else:
            return [
                "You can safely proceed with normal vigilance.",
                "Always verify HTTPS encryption before submitting sensitive data on websites.",
                "Keep your browser and operating system up to date."
            ]
