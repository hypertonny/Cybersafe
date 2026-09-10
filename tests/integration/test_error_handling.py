import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.main import app

client = TestClient(app)

def test_missing_analysis_returns_404():
    response = client.get("/api/v1/analyze/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_ssrf_blocked_returns_400():
    payload = {
        "input_type": "url",
        "payload": "http://127.0.0.1:8000/sensitive-data",
        "user_preferences": {}
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 400
    assert "ssrf" in response.json()["detail"].lower()

def test_blurry_screenshot_flags_low_confidence():
    payload = {
        "input_type": "screenshot",
        "payload": "data:image/png;base64,YWJjZGVm",
        "user_preferences": {}
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_assessment"]["low_confidence"] is True
