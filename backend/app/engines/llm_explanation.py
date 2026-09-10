from typing import List, Tuple
from app.models.schemas import (
    RiskAssessment, UserPreferences, ExplanationTiers, RiskLevel, ThreatCategory
)

class LLMExplanationLayer:
    """
    Stage 4: LLM Explanation Layer
    Translates structured RiskAssessment and evidence collection into 
    three customized tiers: Simple, Detailed, and Technical.
    Grounded strictly in verified evidence; never alters risk score.
    """

    @classmethod
    async def generate_explanations(
        cls,
        risk_assessment: RiskAssessment,
        preferences: UserPreferences
    ) -> Tuple[ExplanationTiers, List[str], str]:
        
        # Build strictly grounded explanations across all 3 tiers
        simple_exp = cls._generate_simple_explanation(risk_assessment)
        detailed_exp = cls._generate_detailed_explanation(risk_assessment)
        technical_exp = cls._generate_technical_explanation(risk_assessment)

        why_suspicious = cls._generate_why_suspicious(risk_assessment)
        what_could_happen = cls._generate_what_could_happen(risk_assessment)

        tiers = ExplanationTiers(
            simple=simple_exp,
            detailed=detailed_exp,
            technical=technical_exp
        )

        return tiers, why_suspicious, what_could_happen

    @classmethod
    def _generate_simple_explanation(cls, risk: RiskAssessment) -> str:
        if risk.risk_level == RiskLevel.HIGH:
            if risk.category == ThreatCategory.PHISHING or risk.category == ThreatCategory.SOCIAL_ENGINEERING:
                return (
                    "This message is probably a scam. The sender is trying to make you click a link and "
                    "give away your personal information like your password or OTP."
                )
            elif risk.category == ThreatCategory.MALWARE:
                return (
                    "This file or link appears to contain dangerous software. Opening it could let attackers "
                    "take control of your computer or lock your files."
                )
            elif risk.category == ThreatCategory.MALICIOUS_URL:
                return (
                    "This website address looks fake or unsafe. It was likely created recently to copy "
                    "a legitimate company and steal your login information."
                )
            else:
                return (
                    "This digital content shows strong warning signs of a cyber threat. Interacting with it "
                    "could put your accounts and privacy in danger."
                )
        elif risk.risk_level == RiskLevel.MEDIUM:
            return (
                "This content has suspicious elements that require caution. Some parts look legitimate, "
                "but unusual requests or links mean you should double-check before proceeding."
            )
        else:
            return (
                "This message appears safe. We did not find common scam phrases, deceptive links, or malicious files. "
                "Still, always remain cautious online."
            )

    @classmethod
    def _generate_detailed_explanation(cls, risk: RiskAssessment) -> str:
        reasons = [e.reason for e in risk.evidence_collection if "Risk score" not in e.reason]
        reasons_summary = "; ".join(reasons[:3]) if reasons else "No anomalous indicators observed"

        if risk.risk_level == RiskLevel.HIGH:
            return (
                f"Our security engines identified critical threats categorized under {risk.category.value.replace('_', ' ').title()} "
                f"with {int(risk.confidence * 100)}% confidence. Key concerns include: {reasons_summary}. "
                "Attackers commonly use these techniques to bypass standard vigilance and solicit credentials or execute unauthorized payloads."
            )
        elif risk.risk_level == RiskLevel.MEDIUM:
            return (
                f"Analysis detected moderate threat indicators ({risk.category.value.replace('_', ' ').title()}). "
                f"Signals observed: {reasons_summary}. While not definitively hostile, this matches patterns commonly used in targeted scams."
            )
        else:
            return (
                "No critical security indicators were triggered during deterministic heuristic matching, machine learning classification, "
                "or domain reputation checks. The content conforms to normal benign communication standards."
            )

    @classmethod
    def _generate_technical_explanation(cls, risk: RiskAssessment) -> str:
        signals_str = ", ".join(risk.signals) if risk.signals else "none_matched"
        evidence_lines = " | ".join([f"[{e.source}] {e.reason}" for e in risk.evidence_collection])

        return (
            f"Verdict: {risk.risk_level.value.upper()} (score: {risk.risk_score:.3f}, confidence: {risk.confidence:.2f}). "
            f"Classification: {risk.category.value}. Triggered Signals: [{signals_str}]. "
            f"Forensic Evidence: {evidence_lines}. "
            f"Telemetry: URL={risk.extracted_url or 'N/A'}, Degraded={risk.is_degraded}, Partial={risk.partial_analysis}."
        )

    @classmethod
    def _generate_why_suspicious(cls, risk: RiskAssessment) -> List[str]:
        bullets: List[str] = []
        for e in risk.evidence_collection:
            if "Risk score" not in e.reason and "standard benign" not in e.reason:
                bullets.append(e.reason)

        if not bullets:
            if risk.risk_level == RiskLevel.LOW:
                bullets.append("No active indicators of compromise or deceptive links detected.")
            else:
                bullets.append("Multiple behavioral indicators match known deceptive patterns.")

        return bullets[:5]

    @classmethod
    def _generate_what_could_happen(cls, risk: RiskAssessment) -> str:
        if risk.risk_level == RiskLevel.HIGH:
            if risk.category == ThreatCategory.PHISHING or risk.category == ThreatCategory.ACCOUNT_SECURITY:
                return "Your personal information or account credentials could be stolen, leading to account compromise or financial loss."
            elif risk.category == ThreatCategory.MALWARE:
                return "Malware could execute in the background, exfiltrating personal documents, installing keyloggers, or deploying ransomware."
            else:
                return "Unauthorized access could be granted to your personal accounts, leading to identity theft or financial loss."
        elif risk.risk_level == RiskLevel.MEDIUM:
            return "Interacting with this content could expose your email or device to aggressive spam campaigns, data harvesting, or follow-up attacks."
        else:
            return "No immediate harm anticipated. Normal digital hygiene applies."
