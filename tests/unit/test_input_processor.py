import pytest
import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.models.schemas import InputType
from app.engines.input_processor import InputProcessor

def test_text_parser_extraction():
    text = (
        "From: PayPal Security <service@paypa1-alert.xyz>\n"
        "Urgent: Your account is suspended. Click http://paypa1-alert.xyz/restore to verify credentials.\n"
        "Call us at 1-800-555-0199."
    )
    result = asyncio.run(InputProcessor.process(InputType.TEXT, text))
    assert len(result.extracted_urls) == 1
    assert "paypa1-alert.xyz/restore" in result.extracted_urls[0]
    assert result.sender_info is not None
    assert "paypa1-alert.xyz" in (result.sender_info.email_or_domain or "")
    assert "[REDACTED_PHONE]" in result.normalized_text

def test_url_parser():
    url = "https://example.com/login?param=1"
    result = asyncio.run(InputProcessor.process(InputType.URL, url))
    assert len(result.extracted_urls) == 1
    assert result.ssl_info is not None
    assert result.ssl_info.valid is True
    assert result.domain_age_days is not None

def test_file_parser_pdf():
    raw_pdf = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"
    result = asyncio.run(InputProcessor.process(InputType.FILE, raw_pdf.decode("latin1")))
    assert result.file_type == "application/pdf"
    assert result.file_sha256 is not None
    assert len(result.file_sha256) == 64

def test_screenshot_blurry_detection():
    short_payload = "data:image/png;base64,YWJj"
    result = asyncio.run(InputProcessor.process(InputType.SCREENSHOT, short_payload))
    assert result.low_confidence is True
