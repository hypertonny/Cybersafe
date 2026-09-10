# CyberSafe — Development & Setup Guide

**Target Audience:** Software Engineers, Security Researchers, Contributors  
**Prerequisites:** Python 3.10+, Node.js 18+, Docker & Docker Compose (optional)

---

## 1. Project Directory Structure

```text
cybersafe/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── api/              # REST routes & endpoints
│   │   ├── core/             # Configuration, security utils (SSRF, PII)
│   │   ├── engines/          # 5 Pipeline modules (Input, Rules, ML, Risk, LLM, Action)
│   │   ├── models/           # Pydantic schemas & data contracts
│   │   ├── services/         # Pipeline Orchestrator & caching
│   │   └── main.py           # Application entry point
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Container image for API backend
├── frontend/                 # React / Vite modern web client
│   ├── src/
│   │   ├── components/       # Input module, preferences, risk banner, tabs, action plan
│   │   ├── App.jsx           # Master UI container & state orchestration
│   │   ├── main.jsx          # React DOM root
│   │   └── index.css         # Modern, high-aesthetic Vanilla CSS design system
│   ├── package.json          # Node dependencies & build scripts
│   ├── vite.config.js        # Vite bundler configuration
│   └── Dockerfile            # Production Nginx frontend container
├── docs/                     # Architectural, PRD, TRD, security & API documentation
│   ├── adr/                  # Architectural Decision Records
│   ├── PRD_ANALYSIS_AND_ENHANCEMENTS.md
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   ├── SECURITY_THREAT_MODEL.md
│   ├── TESTING_STRATEGY.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── REQUIREMENTS_TRACEABILITY.md
├── tests/                    # Comprehensive automated test suites
│   ├── unit/                 # Unit tests for all parsers and engines
│   └── integration/          # End-to-end API and edge-case integration tests
├── docker-compose.yml        # Multi-container orchestration
└── README.md                 # Primary project overview
```

---

## 2. Local Backend Setup (FastAPI)

### 2.1 Virtual Environment Setup
```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2.2 Environment Configuration
Create a `.env` file in `backend/` (or set environment variables):
```env
# Application Settings
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Pipeline Scoring Weights (Sum to 1.0)
WEIGHT_RULES=0.35
WEIGHT_ML=0.35
WEIGHT_CHECKS=0.30

# High / Medium Severity Thresholds
THRESHOLD_HIGH=0.75
THRESHOLD_MEDIUM=0.40

# LLM Providers (Optional - system uses built-in resilient fallback if empty)
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

### 2.3 Running the Development Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API documentation is immediately available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 3. Local Frontend Setup (React + Vite)

### 3.1 Install & Start
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The web application will launch at `http://localhost:5173` with instant Hot Module Replacement (HMR).

---

## 4. Running the Test Suite

```bash
# Run all unit and integration tests with coverage
pytest tests/ -v --cov=backend/app --cov-report=term-missing
```

---

## 5. Code Quality & Formatting Guidelines

- **Python:**
  - Follow PEP 8 standards.
  - Type annotations are required on all engine methods and Pydantic models.
  - Run linting: `flake8 backend/app tests/`
- **Frontend:**
  - Modern, responsive styling with clean semantic tags.
  - Zero unhandled console warnings.
  - Accessible keyboard navigation and ARIA attributes for screen readers.
