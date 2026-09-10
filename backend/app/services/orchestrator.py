import asyncio
import uuid
from datetime import datetime, timezone
from typing import Dict, Optional

from app.models.schemas import (
    AnalysisRequest, AnalysisResponse, UserPreferences
)
from app.engines.input_processor import InputProcessor
from app.engines.rules_engine import RulesEngine
from app.engines.ml_model import MLClassifier
from app.engines.security_checks import SecurityChecks
from app.engines.risk_engine import RiskEngine
from app.engines.llm_explanation import LLMExplanationLayer
from app.engines.action_plan import ActionPlanGenerator

# In-memory storage for analysis records and user preferences (transient storage)
ANALYSIS_CACHE: Dict[str, AnalysisResponse] = {}
USER_PREFERENCES_STORE: Dict[str, UserPreferences] = {
    "default": UserPreferences()
}

class PipelineOrchestrator:
    """
    Coordinates the execution of all 5 stages of the CyberSafe pipeline.
    """

    @classmethod
    async def analyze(cls, request: AnalysisRequest) -> AnalysisResponse:
        analysis_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()
        preferences = request.user_preferences or USER_PREFERENCES_STORE["default"]

        # Stage 1: Input Processor
        input_data = await InputProcessor.process(request.input_type, request.payload)

        # Stage 2: Parallel Security Engines Execution
        rules_task = RulesEngine.evaluate(input_data)
        ml_task = MLClassifier.predict(input_data)
        checks_task = SecurityChecks.evaluate(input_data)

        # Execute Stage 2 concurrently
        (
            (rules_score, matched_signals, rules_evidence, rules_cat),
            (ml_result, ml_evidence),
            (failed_checks_ratio, checks_list, checks_evidence)
        ) = await asyncio.gather(rules_task, ml_task, checks_task)

        # Stage 3: Risk Engine
        risk_assessment = RiskEngine.evaluate(
            input_data=input_data,
            rules_score=rules_score,
            matched_signals=matched_signals,
            rules_evidence=rules_evidence,
            rules_category=rules_cat,
            ml_result=ml_result,
            ml_evidence=ml_evidence,
            failed_checks_ratio=failed_checks_ratio,
            checks_evidence=checks_evidence
        )

        # Stage 4: LLM Explanation Layer
        explanation_tiers, why_suspicious, what_could_happen = await LLMExplanationLayer.generate_explanations(
            risk_assessment=risk_assessment,
            preferences=preferences
        )

        # Stage 5: Action Plan Generator
        action_plan = ActionPlanGenerator.generate(risk_assessment)

        response = AnalysisResponse(
            analysis_id=analysis_id,
            created_at=created_at,
            input_type=request.input_type,
            status="completed",
            risk_assessment=risk_assessment,
            explanation=explanation_tiers,
            why_suspicious=why_suspicious,
            what_could_happen=what_could_happen,
            action_plan=action_plan
        )

        # Cache result
        ANALYSIS_CACHE[analysis_id] = response
        return response

    @classmethod
    def get_analysis_by_id(cls, analysis_id: str) -> Optional[AnalysisResponse]:
        return ANALYSIS_CACHE.get(analysis_id)

    @classmethod
    def save_preferences(cls, prefs: UserPreferences) -> UserPreferences:
        USER_PREFERENCES_STORE["default"] = prefs
        return prefs

    @classmethod
    def get_preferences(cls) -> UserPreferences:
        return USER_PREFERENCES_STORE.get("default", UserPreferences())
