import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend")))

from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["engines"]["rules_engine"] == "online"

def test_threat_categories_endpoint():
    response = client.get("/api/v1/threat-categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data["categories"]) == 8
    category_ids = [c["id"] for c in data["categories"]]
    assert "phishing" in category_ids
    assert "malware" in category_ids
    assert "web_security" in category_ids

def test_analyze_text_phishing():
    payload = {
        "input_type": "text",
        "payload": "URGENT: Your account has been suspended! Enter password at http://paypa1-alert.xyz to unlock.",
        "user_preferences": {
            "who_are_you": "personal_user",
            "technical_level": "simple",
            "focus_area": ["emails_messages"]
        }
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert data["risk_assessment"]["risk_level"] == "high"
    assert "phishing" in data["risk_assessment"]["category"]
    assert data["explanation"]["simple"] != ""
    assert data["explanation"]["detailed"] != ""
    assert data["explanation"]["technical"] != ""
    assert len(data["why_suspicious"]) > 0
    assert data["action_plan"]["what_happened"] != ""
    assert len(data["action_plan"]["what_to_do"]) > 0

    # Test retrieval by ID
    analysis_id = data["analysis_id"]
    get_res = client.get(f"/api/v1/analyze/{analysis_id}")
    assert get_res.status_code == 200
    assert get_res.json()["analysis_id"] == analysis_id

def test_analyze_benign_text():
    payload = {
        "input_type": "text",
        "payload": "Hi Alice, please review the minutes from our meeting yesterday.",
        "user_preferences": {
            "who_are_you": "student",
            "technical_level": "detailed",
            "focus_area": ["everything"]
        }
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_assessment"]["risk_level"] == "low"

def test_preferences_save_and_get():
    prefs = {
        "who_are_you": "professional",
        "technical_level": "technical",
        "focus_area": ["account_security", "device_security"]
    }
    post_res = client.post("/api/v1/preferences", json=prefs)
    assert post_res.status_code == 200
    assert post_res.json()["technical_level"] == "technical"

    get_res = client.get("/api/v1/preferences")
    assert get_res.status_code == 200
    assert get_res.json()["who_are_you"] == "professional"
