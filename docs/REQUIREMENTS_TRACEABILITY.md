# CyberSafe — Requirements Traceability Matrix (RTM)

**Document Version:** 1.0  
**Coverage Scope:** PRD v1.0 ↔ TRD v1.0 ↔ Implementation ↔ Verification  

---

## 1. Traceability Matrix

| Req ID | PRD Ref | TRD Ref | Component / Module | API Endpoint / UI Element | Verification Test Case | Status |
|---|---|---|---|---|---|---|
| **REQ-01** | Sec 2 | Sec 4.1 | Text Parser (`input_processor.py`) | `POST /api/v1/analyze` (`input_type: text`) / Text Tab | `tests/unit/test_input_processor.py::test_text_parser` | Implemented & Verified |
| **REQ-02** | Sec 2 | Sec 4.1 | URL Parser (`input_processor.py`) | `POST /api/v1/analyze` (`input_type: url`) / URL Tab | `tests/unit/test_input_processor.py::test_url_parser` | Implemented & Verified |
| **REQ-03** | Sec 2 | Sec 4.1 | Screenshot / OCR (`input_processor.py`) | `POST /api/v1/analyze` (`input_type: screenshot`) / Screenshot Tab | `tests/unit/test_input_processor.py::test_ocr_parser` | Implemented & Verified |
| **REQ-04** | Sec 2 | Sec 4.1 | File Parser (`input_processor.py`) | `POST /api/v1/analyze` (`input_type: file`) / File Tab | `tests/unit/test_input_processor.py::test_file_parser` | Implemented & Verified |
| **REQ-05** | Sec 3 | Sec 5.1 | User Preferences Model (`schemas.py`) | `POST /api/v1/preferences` / Persona Dropdown | `tests/integration/test_api_endpoints.py::test_preferences` | Implemented & Verified |
| **REQ-06** | Sec 3 | Sec 4.4 | 3 Technical Levels (`llm_explanation.py`) | `explanation: {simple, detailed, technical}` / UI Tabs | `tests/unit/test_risk_engine.py::test_explanation_tiers` | Implemented & Verified |
| **REQ-07** | Sec 4.2 | Sec 4.2 | Rules Engine (`rules_engine.py`) | Parallel Execution in Orchestrator | `tests/unit/test_rules_engine.py` | Implemented & Verified |
| **REQ-08** | Sec 4.2 | Sec 4.2 | ML Classifier (`ml_model.py`) | Parallel Execution in Orchestrator | `tests/unit/test_ml_model.py` | Implemented & Verified |
| **REQ-09** | Sec 4.2 | Sec 4.2 | Security Checks (`security_checks.py`) | Parallel Execution in Orchestrator | `tests/unit/test_security_checks.py` | Implemented & Verified |
| **REQ-10** | Sec 4.3 | Sec 7 | Risk Engine Scorer (`risk_engine.py`) | Weighted Formula `(w1*rules + w2*ml + w3*checks)` | `tests/unit/test_risk_engine.py::test_scoring_formula` | Implemented & Verified |
| **REQ-11** | Sec 4.3 | Sec 7 | Severity Thresholds (`risk_engine.py`) | High (≥0.75), Medium (0.40–0.75), Low (<0.40) | `tests/unit/test_risk_engine.py::test_thresholds` | Implemented & Verified |
| **REQ-12** | Sec 4.3 | Sec 7 | Agreement Factor (`risk_engine.py`) | Calibrated Confidence Calculation | `tests/unit/test_risk_engine.py::test_confidence_agreement` | Implemented & Verified |
| **REQ-13** | Sec 4.4 | Sec 4.4 | LLM Grounding (`llm_explanation.py`) | Strict evidence grounding, zero hallucination | `tests/unit/test_risk_engine.py::test_evidence_grounding` | Implemented & Verified |
| **REQ-14** | Sec 4.5 | Sec 4.5 | Action Plan Generator (`action_plan.py`) | `what_happened`, `why_risky`, `what_to_do` | `tests/unit/test_risk_engine.py::test_action_plan` | Implemented & Verified |
| **REQ-15** | Sec 5 | Sec 5.4 | Analysis Output UI Schema | Full JSON contract & UI Risk Card | `tests/integration/test_api_endpoints.py::test_analyze_schema` | Implemented & Verified |
| **REQ-16** | Sec 6 | Sec 6 | 8 Threat Categories (`threat_categories.py`) | `GET /api/v1/threat-categories` / Category Badges | `tests/integration/test_api_endpoints.py::test_threat_categories` | Implemented & Verified |
| **REQ-17** | Sec 8 | Sec 8 | Latency & Performance SLA | Asynchronous pipeline execution (< 8.0s) | `tests/integration/test_api_endpoints.py::test_performance_sla` | Implemented & Verified |
| **REQ-18** | Sec 9 | Sec 9 | PII & SSRF Security (`security.py`) | RFC 1918 blocking + PII scrubbing | `tests/unit/test_ssrf_protection.py` | Implemented & Verified |
| **REQ-19** | Sec 10 | Sec 10 | Resilient Degradation & Fail-safe | Blurry image flag, URL partial flag, LLM fallback | `tests/integration/test_error_handling.py` | Implemented & Verified |
