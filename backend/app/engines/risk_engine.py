from typing import List, Dict, Any
from app.models.schemas import (
    RiskAssessment, RiskLevel, ThreatCategory, EvidenceItem, InputProcessorOutput
)
from app.core.config import settings

class RiskEngine:
    """
    Stage 3: Risk Engine
    Combines outputs of Rules Engine, ML Model, and Security Checks into
    a single mathematically grounded RiskAssessment verdict.
    """

    @classmethod
    def evaluate(
        cls,
        input_data: InputProcessorOutput,
        rules_score: float,
        matched_signals: List[str],
        rules_evidence: List[EvidenceItem],
        rules_category: ThreatCategory,
        ml_result: Dict[str, Any],
        ml_evidence: EvidenceItem,
        failed_checks_ratio: float,
        checks_evidence: List[EvidenceItem]
    ) -> RiskAssessment:
        
        ml_prob = ml_result["probability"]
        ml_category = ml_result["suggested_category"]

        # 1. Calculate Weighted Risk Score (TRD Sec 7)
        w1 = settings.WEIGHT_RULES
        w2 = settings.WEIGHT_ML
        w3 = settings.WEIGHT_CHECKS

        raw_score = (w1 * rules_score) + (w2 * ml_prob) + (w3 * failed_checks_ratio)
        risk_score = round(min(1.0, max(0.0, raw_score)), 3)

        # 2. Determine Severity Level with Ambiguity Fail-Safe
        margin = settings.AMBIGUITY_MARGIN
        is_ambiguous = False

        if risk_score >= settings.THRESHOLD_HIGH:
            risk_level = RiskLevel.HIGH
        elif risk_score >= (settings.THRESHOLD_HIGH - margin):
            # Fail-safe promotion: borderline score promoted to High
            risk_level = RiskLevel.HIGH
            is_ambiguous = True
        elif risk_score >= settings.THRESHOLD_MEDIUM:
            risk_level = RiskLevel.MEDIUM
        elif risk_score >= (settings.THRESHOLD_MEDIUM - margin):
            # Fail-safe promotion: borderline score promoted to Medium
            risk_level = RiskLevel.MEDIUM
            is_ambiguous = True
        else:
            risk_level = RiskLevel.LOW

        # 3. Calculate Calibrated Confidence Score (Agreement Factor)
        # Higher when Rules Engine and ML Model agree
        agreement = 1.0 - abs(rules_score - ml_prob)
        is_category_match = (rules_category == ml_category)

        if is_category_match and (rules_score >= 0.5) == (ml_prob >= 0.5):
            confidence = min(0.98, 0.72 + (0.24 * agreement))
        else:
            confidence = max(0.55, 0.70 - (0.15 * abs(rules_score - ml_prob)))

        confidence = round(confidence, 2)

        # 4. Resolve Primary Threat Category
        if rules_score > 0.35:
            final_category = rules_category
        elif ml_prob > 0.40:
            final_category = ml_category
        else:
            final_category = ThreatCategory.PHISHING

        # 5. Aggregate Evidence Collection
        all_evidence: List[EvidenceItem] = []
        all_evidence.extend(rules_evidence)
        all_evidence.append(ml_evidence)
        all_evidence.extend(checks_evidence)

        if is_ambiguous:
            all_evidence.append(EvidenceItem(
                reason="Risk score fell near decision threshold; applied fail-safe policy defaulting toward caution.",
                source="risk_engine"
            ))

        extracted_url = input_data.extracted_urls[0] if input_data.extracted_urls else None

        return RiskAssessment(
            risk_level=risk_level,
            risk_score=risk_score,
            confidence=confidence,
            category=final_category,
            signals=list(set(matched_signals)),
            evidence_collection=all_evidence,
            extracted_url=extracted_url,
            is_degraded=False,
            partial_analysis=input_data.partial_analysis,
            low_confidence=input_data.low_confidence
        )
