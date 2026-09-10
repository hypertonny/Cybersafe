import pytest
import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.models.schemas import InputProcessorOutput, ThreatCategory
from app.engines.rules_engine import RulesEngine

def test_urgency_and_credential_detection():
    input_data = InputProcessorOutput(
        normalized_text="Immediate action required! Your account is suspended. Enter your password now.",
        extracted_urls=[],
        low_confidence=False
    )
    score, signals, evidence, category = asyncio.run(RulesEngine.evaluate(input_data))
    assert "urgent_language" in signals
    assert "credential_solicitation" in signals
    assert score >= 0.50
    assert category == ThreatCategory.PHISHING

def test_brand_spoofing_and_shortener():
    input_data = InputProcessorOutput(
        normalized_text="Click bit.ly/secure-paypa1 to restore your account.",
        extracted_urls=["http://bit.ly/secure-paypa1"],
        low_confidence=False
    )
    score, signals, evidence, category = asyncio.run(RulesEngine.evaluate(input_data))
    assert "brand_spoofing" in signals
    assert "shortened_url" in signals
    assert score >= 0.50

def test_executable_file_detection():
    input_data = InputProcessorOutput(
        normalized_text="Please review the attached invoice.pdf.exe",
        extracted_urls=[],
        filename="invoice.pdf.exe",
        low_confidence=False
    )
    score, signals, evidence, category = asyncio.run(RulesEngine.evaluate(input_data))
    assert "executable_extension" in signals
    assert category == ThreatCategory.MALWARE
    assert score >= 0.50

def test_benign_content():
    input_data = InputProcessorOutput(
        normalized_text="Hello, thank you for attending today's team sync. Minutes will be posted shortly.",
        extracted_urls=[],
        low_confidence=False
    )
    score, signals, evidence, category = asyncio.run(RulesEngine.evaluate(input_data))
    assert len(signals) == 0
    assert score == 0.0
