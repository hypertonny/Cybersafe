import math
from typing import Dict, Any, Tuple
from app.models.schemas import InputProcessorOutput, EvidenceItem, ThreatCategory

class MLClassifier:
    """
    Stage 2B: Machine Learning Classifier
    Extracts lexical features, domain age, SSL status, and textual vectors
    to produce a classification label and threat probability.
    """

    @classmethod
    async def predict(cls, input_data: InputProcessorOutput) -> Tuple[Dict[str, Any], EvidenceItem]:
        features = cls._extract_features(input_data)
        
        # Scoring function (calibrated logistic regression simulation)
        # Linear combination of weights
        score = -2.2  # Baseline prior (benign bias)

        score += features["url_length_penalty"] * 1.5
        score += features["url_entropy"] * 0.8
        score += features["special_chars_weight"] * 1.2
        score += features["keyword_vector_score"] * 2.5
        
        if features["is_new_domain"]:
            score += 2.0
        if features["missing_ssl"]:
            score += 1.2
        if features["is_executable"]:
            score += 3.0

        # Sigmoid activation
        probability = 1.0 / (1.0 + math.exp(-max(-8.0, min(8.0, score))))

        # Determine label and category
        if probability >= 0.75:
            label = "phishing / malicious"
            category = ThreatCategory.PHISHING
            reason = f"ML model detected high-risk lexical features and keyword patterns (probability: {probability:.2f})."
        elif probability >= 0.40:
            label = "suspicious anomaly"
            category = ThreatCategory.MALICIOUS_URL
            reason = f"ML model detected anomalous patterns warranting caution (probability: {probability:.2f})."
        else:
            label = "benign"
            category = ThreatCategory.PHISHING
            reason = f"ML feature extraction aligns with standard benign patterns (threat probability: {probability:.2f})."

        result = {
            "label": label,
            "probability": round(probability, 3),
            "suggested_category": category,
            "feature_snapshot": {
                "entropy": round(features["url_entropy"], 2),
                "keyword_score": round(features["keyword_vector_score"], 2),
                "is_new_domain": features["is_new_domain"]
            }
        }

        evidence = EvidenceItem(reason=reason, source="ml_model")
        return result, evidence

    @classmethod
    def _extract_features(cls, input_data: InputProcessorOutput) -> Dict[str, Any]:
        text = input_data.normalized_text.lower()
        url = input_data.extracted_urls[0] if input_data.extracted_urls else ""

        # 1. Lexical URL Features
        url_len = len(url)
        url_length_penalty = 1.0 if url_len > 75 else (url_len / 75.0)

        # Shannon Entropy of URL or text snippet
        sample_str = url if url else text[:100]
        entropy = cls._calculate_entropy(sample_str)

        # Special characters in URL
        specials = sum(1 for c in url if c in "@-_%?&=#")
        special_chars_weight = min(1.0, specials / 5.0)

        # 2. Text Keyword Vector Score
        risk_keywords = ["urgent", "verify", "password", "bank", "suspended", "security", "login", "confirm", "free", "gift", "winner", "prize"]
        matches = sum(1 for kw in risk_keywords if kw in text)
        keyword_vector_score = min(1.0, matches / 3.0)

        # 3. Domain & SSL Features
        is_new_domain = input_data.domain_age_days is not None and input_data.domain_age_days < 30
        missing_ssl = input_data.ssl_info is not None and not input_data.ssl_info.valid
        is_executable = bool(input_data.file_type and "executable" in input_data.file_type)

        return {
            "url_length_penalty": url_length_penalty,
            "url_entropy": entropy,
            "special_chars_weight": special_chars_weight,
            "keyword_vector_score": keyword_vector_score,
            "is_new_domain": is_new_domain,
            "missing_ssl": missing_ssl,
            "is_executable": is_executable
        }

    @staticmethod
    def _calculate_entropy(text: str) -> float:
        if not text:
            return 0.0
        entropy = 0.0
        length = len(text)
        counts = {}
        for char in text:
            counts[char] = counts.get(char, 0) + 1
        for count in counts.values():
            p = count / length
            entropy -= p * math.log2(p)
        return min(5.0, entropy) / 5.0  # Normalized roughly to [0, 1]
