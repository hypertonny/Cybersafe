from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CyberSafe"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"]

    # Pipeline Weights (TRD Sec 7: w1 + w2 + w3 = 1.0)
    WEIGHT_RULES: float = 0.35
    WEIGHT_ML: float = 0.35
    WEIGHT_CHECKS: float = 0.30

    # Risk Severity Thresholds (TRD Sec 7)
    THRESHOLD_HIGH: float = 0.75
    THRESHOLD_MEDIUM: float = 0.40
    AMBIGUITY_MARGIN: float = 0.03  # Fail-safe margin

    # Non-functional SLA (TRD Sec 8)
    MAX_ANALYSIS_TIMEOUT_SECONDS: float = 8.0
    MAX_UPLOAD_SIZE_BYTES: int = 15 * 1024 * 1024  # 15MB

    # External LLM Keys (Optional)
    ANTHROPIC_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

settings = Settings()
