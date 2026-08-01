class ConfidenceCalculator:
    @staticmethod
    def calculate_confidence(
        action: str,
        is_scam: bool,
        is_spam: bool,
        has_gemini_reasoning: bool,
        relationship_tier: str,
        business_trust: float
    ) -> float:
        score = 0.75

        if is_scam:
            score = 0.98  # Extremely high confidence on scam detection
        elif action == "notify" and relationship_tier in ["family", "doctor_service", "verified_business"]:
            score += 0.18
        elif action == "mute" and (is_spam or relationship_tier == "spammer"):
            score += 0.15
        elif action == "digest":
            score += 0.08

        if has_gemini_reasoning:
            score += 0.05

        return round(min(0.99, max(0.55, score)), 2)
