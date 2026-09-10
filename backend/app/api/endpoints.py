from fastapi import APIRouter, HTTPException, status
from app.models.schemas import (
    AnalysisRequest, AnalysisResponse, UserPreferences,
    ThreatCategoriesResponse, ThreatCategoryItem
)
from app.services.orchestrator import PipelineOrchestrator

router = APIRouter()

SUPPORTED_THREAT_CATEGORIES = [
    ThreatCategoryItem(
        id="phishing",
        name="Phishing",
        description="Deceptive emails, SMS, or direct messages aiming to steal credentials or sensitive information."
    ),
    ThreatCategoryItem(
        id="malware",
        name="Malware",
        description="Malicious attachments, scripts, or executables designed to compromise devices or encrypt files."
    ),
    ThreatCategoryItem(
        id="malicious_url",
        name="Malicious URLs",
        description="Fraudulent websites, lookalike domains, or redirects leading to malicious payloads."
    ),
    ThreatCategoryItem(
        id="social_engineering",
        name="Social Engineering",
        description="Psychological manipulation, impersonation scams, urgent extortion, and fraudulent requests."
    ),
    ThreatCategoryItem(
        id="account_security",
        name="Account Security",
        description="Compromised passwords, weak authentication mechanisms, and MFA bypass attempts."
    ),
    ThreatCategoryItem(
        id="device_security",
        name="Device Security",
        description="Operating system misconfigurations, fake antivirus warnings, and rogue configuration profiles."
    ),
    ThreatCategoryItem(
        id="network_threat",
        name="Network Threats",
        description="Man-in-the-middle attacks, rogue Wi-Fi access points, and open port scanning vulnerabilities."
    ),
    ThreatCategoryItem(
        id="web_security",
        name="Web Security",
        description="SQL injection (SQLi), Cross-Site Scripting (XSS), and broken SSL/TLS cryptographic configurations."
    )
]

@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_content(request: AnalysisRequest):
    """
    Submits digital content (screenshot, text, url, file) and user preferences
    to the 5-stage CyberSafe analysis pipeline.
    """
    try:
        response = await PipelineOrchestrator.analyze(request)
        return response
    except ValueError as e:
        if "SSRF" in str(e):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Pipeline error: {str(e)}")

@router.get("/analyze/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str):
    """
    Retrieves a previously generated analysis result by UUID.
    """
    result = PipelineOrchestrator.get_analysis_by_id(analysis_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis '{analysis_id}' was not found or has expired."
        )
    return result

@router.post("/preferences", response_model=UserPreferences)
async def save_preferences(preferences: UserPreferences):
    """
    Saves or updates the default user preferences (persona, technical depth, focus areas).
    """
    return PipelineOrchestrator.save_preferences(preferences)

@router.get("/preferences", response_model=UserPreferences)
async def get_preferences():
    """
    Retrieves current user preferences.
    """
    return PipelineOrchestrator.get_preferences()

@router.get("/threat-categories", response_model=ThreatCategoriesResponse)
async def get_threat_categories():
    """
    Returns the fixed list of 8 supported threat categories.
    """
    return ThreatCategoriesResponse(categories=SUPPORTED_THREAT_CATEGORIES)

@router.get("/health")
async def health_check():
    """
    Liveness and health check endpoint for monitoring and container orchestration.
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "engines": {
            "rules_engine": "online",
            "ml_model": "online",
            "security_checks": "online",
            "llm_explanation": "online"
        }
    }
