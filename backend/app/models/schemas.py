from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class InputType(str, Enum):
    SCREENSHOT = "screenshot"
    TEXT = "text"
    URL = "url"
    FILE = "file"

class WhoAreYou(str, Enum):
    STUDENT = "student"
    PROFESSIONAL = "professional"
    PERSONAL_USER = "personal_user"

class TechnicalLevel(str, Enum):
    SIMPLE = "simple"
    DETAILED = "detailed"
    TECHNICAL = "technical"

class FocusArea(str, Enum):
    EMAILS_MESSAGES = "emails_messages"
    WEBSITES_LINKS = "websites_links"
    ACCOUNT_SECURITY = "account_security"
    DEVICE_SECURITY = "device_security"
    NETWORK_SECURITY = "network_security"
    EVERYTHING = "everything"

class ThreatCategory(str, Enum):
    PHISHING = "phishing"
    MALWARE = "malware"
    MALICIOUS_URL = "malicious_url"
    SOCIAL_ENGINEERING = "social_engineering"
    ACCOUNT_SECURITY = "account_security"
    DEVICE_SECURITY = "device_security"
    NETWORK_THREAT = "network_threat"
    WEB_SECURITY = "web_security"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class UserPreferences(BaseModel):
    who_are_you: WhoAreYou = WhoAreYou.PERSONAL_USER
    technical_level: TechnicalLevel = TechnicalLevel.SIMPLE
    focus_area: List[str] = Field(default_factory=lambda: ["everything"])

class AnalysisRequest(BaseModel):
    input_type: InputType
    payload: str
    user_preferences: Optional[UserPreferences] = Field(default_factory=UserPreferences)

class SenderInfo(BaseModel):
    name: Optional[str] = None
    email_or_domain: Optional[str] = None

class SSLInfo(BaseModel):
    valid: bool = False
    issuer: Optional[str] = None

class InputProcessorOutput(BaseModel):
    normalized_text: str
    extracted_urls: List[str] = Field(default_factory=list)
    sender_info: Optional[SenderInfo] = None
    ssl_info: Optional[SSLInfo] = None
    domain_age_days: Optional[int] = None
    low_confidence: bool = False
    filename: Optional[str] = None
    file_sha256: Optional[str] = None
    file_type: Optional[str] = None
    partial_analysis: bool = False

class EvidenceItem(BaseModel):
    reason: str
    source: str  # "rules_engine" | "ml_model" | "security_checks"

class RiskAssessment(BaseModel):
    risk_level: RiskLevel
    risk_score: float
    confidence: float
    category: ThreatCategory
    signals: List[str] = Field(default_factory=list)
    evidence_collection: List[EvidenceItem] = Field(default_factory=list)
    extracted_url: Optional[str] = None
    is_degraded: bool = False
    partial_analysis: bool = False
    low_confidence: bool = False

class ExplanationTiers(BaseModel):
    simple: str
    detailed: str
    technical: str

class ActionPlan(BaseModel):
    what_happened: str
    why_risky: str
    what_to_do: List[str]

class AnalysisResponse(BaseModel):
    analysis_id: str
    created_at: str
    input_type: InputType
    status: str = "completed"
    risk_assessment: RiskAssessment
    explanation: ExplanationTiers
    why_suspicious: List[str]
    what_could_happen: str
    action_plan: ActionPlan

class ThreatCategoryItem(BaseModel):
    id: str
    name: str
    description: str

class ThreatCategoriesResponse(BaseModel):
    categories: List[ThreatCategoryItem]
