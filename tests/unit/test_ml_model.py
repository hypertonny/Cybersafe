import pytest
import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.models.schemas import InputProcessorOutput, SSLInfo
from app.engines.ml_model import MLClassifier

def test_ml_model_high_risk_features():
    input_data = InputProcessorOutput(
        normalized_text="Urgent verify bank password account suspended now",
        extracted_urls=["http://fake-banking-verification-center-update-auth.xyz/login?session=abc12345&key=xyz"],
        ssl_info=SSLInfo(valid=False, issuer="Self-Signed"),
        domain_age_days=3,
        low_confidence=False
    )
    result, evidence = asyncio.run(MLClassifier.predict(input_data))
    assert result["probability"] >= 0.70
    assert "phishing" in result["label"]
    assert "ml_model" in evidence.source

def test_ml_model_benign_features():
    input_data = InputProcessorOutput(
        normalized_text="Welcome to our annual general meeting agenda notes.",
        extracted_urls=["https://github.com/hypertonny/Cybersafe"],
        ssl_info=SSLInfo(valid=True, issuer="DigiCert"),
        domain_age_days=2500,
        low_confidence=False
    )
    result, evidence = asyncio.run(MLClassifier.predict(input_data))
    assert result["probability"] < 0.40
    assert result["label"] == "benign"
