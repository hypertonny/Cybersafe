import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.models.schemas import (
    InputProcessorOutput, ThreatCategory, EvidenceItem, RiskLevel
)
from app.engines.risk_engine import RiskEngine

def test_risk_scoring_high_verdict():
    input_data = InputProcessorOutput(
        normalized_text="Immediate action required",
        extracted_urls=["http://paypa1-alert.xyz"],
        low_confidence=False
    )
    risk = RiskEngine.evaluate(
        input_data=input_data,
        rules_score=0.90,
        matched_signals=["urgent_language", "brand_spoofing"],
        rules_evidence=[EvidenceItem(reason="Urgent language detected", source="rules_engine")],
        rules_category=ThreatCategory.PHISHING,
        ml_result={"probability": 0.85, "suggested_category": ThreatCategory.PHISHING},
        ml_evidence=EvidenceItem(reason="High ML risk score", source="ml_model"),
        failed_checks_ratio=0.75,
        checks_evidence=[EvidenceItem(reason="New domain", source="security_checks")]
    )
    assert risk.risk_level == RiskLevel.HIGH
    assert risk.risk_score >= 0.75
    assert risk.confidence >= 0.80
    assert risk.category == ThreatCategory.PHISHING

def test_risk_scoring_ambiguity_fail_safe():
    input_data = InputProcessorOutput(
        normalized_text="Borderline score test",
        extracted_urls=[],
        low_confidence=False
    )
    # Total score around 0.73 (within 0.03 margin of 0.75 threshold)
    risk = RiskEngine.evaluate(
        input_data=input_data,
        rules_score=0.73,
        matched_signals=["shortened_url"],
        rules_evidence=[EvidenceItem(reason="Shortened URL", source="rules_engine")],
        rules_category=ThreatCategory.MALICIOUS_URL,
        ml_result={"probability": 0.73, "suggested_category": ThreatCategory.MALICIOUS_URL},
        ml_evidence=EvidenceItem(reason="Moderate ML risk", source="ml_model"),
        failed_checks_ratio=0.73,
        checks_evidence=[]
    )
    # Must be promoted to HIGH due to fail-safe toward caution
    assert risk.risk_level == RiskLevel.HIGH
    assert any("fail-safe" in e.reason.lower() for e in risk.evidence_collection)

def test_risk_scoring_low_verdict():
    input_data = InputProcessorOutput(
        normalized_text="Benign message",
        extracted_urls=[],
        low_confidence=False
    )
    risk = RiskEngine.evaluate(
        input_data=input_data,
        rules_score=0.0,
        matched_signals=[],
        rules_evidence=[],
        rules_category=ThreatCategory.PHISHING,
        ml_result={"probability": 0.10, "suggested_category": ThreatCategory.PHISHING},
        ml_evidence=EvidenceItem(reason="Low ML risk", source="ml_model"),
        failed_checks_ratio=0.0,
        checks_evidence=[]
    )
    assert risk.risk_level == RiskLevel.LOW
    assert risk.risk_score < 0.40
