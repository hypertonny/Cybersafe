import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.core.security import is_safe_url, redact_pii

def test_ssrf_blocks_localhost():
    safe, msg = is_safe_url("http://localhost:8000/admin")
    assert safe is False
    assert "SSRF" in msg or "prohibited" in msg

def test_ssrf_blocks_loopback_ip():
    safe, msg = is_safe_url("http://127.0.0.1/etc/passwd")
    assert safe is False

def test_ssrf_blocks_metadata_ip():
    safe, msg = is_safe_url("http://169.254.169.254/latest/meta-data")
    assert safe is False

def test_pii_redaction():
    text = "My phone is 212-555-0199 and my card is 4111 2222 3333 4444 and my SSN is 000-12-3456."
    redacted = redact_pii(text)
    assert "4111" not in redacted
    assert "[REDACTED_CREDENTIAL]" in redacted or "[REDACTED_CREDIT_CARD]" in redacted
    assert "000-12-3456" not in redacted
    assert "[REDACTED_SSN]" in redacted
