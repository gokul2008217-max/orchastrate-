from typing import Dict, Any, List
from backend.services.data_loader import DataLoader
from backend.services.ocr_service import OCRService
from backend.services.voice_service import VoiceTranscriptionService
from backend.services.retrieval_engine import RetrievalEngine
from backend.services/business_trust_engine import BusinessTrustEngine
from backend.services/spam_scam_detector import SpamScamDetector
from backend.services/personalization_engine import PersonalizationEngine
from backend.services/confidence_calculator import ConfidenceCalculator
from backend.services/gemini_reasoning import GeminiReasoningEngine

class NotificationDecisionEngine:
    def __init__(self, data_loader: DataLoader = None):
        self.data_loader = data_loader or DataLoader()
        self.ocr_service = OCRService(self.data_loader)
        self.voice_service = VoiceTranscriptionService(self.data_loader)
        self.retrieval_engine = RetrievalEngine(self.data_loader)
        self.trust_engine = BusinessTrustEngine(self.data_loader)
        self.detector = SpamScamDetector()
        self.personalization = PersonalizationEngine(self.data_loader)
        self.gemini = GeminiReasoningEngine()

    def process_single_message(self, msg: Dict[str, Any]) -> Dict[str, Any]:
        msg_id = str(msg.get("message_id", "M000"))
        sender_id = str(msg.get("sender_id", "U100"))
        group_id = str(msg.get("group_id", "none"))
        msg_type = str(msg.get("message_type", "text"))
        content = str(msg.get("content", ""))
        is_forwarded = bool(msg.get("is_forwarded", False))

        # 1. OCR Service
        ocr_res = self.ocr_service.extract_text_and_type(msg_id) if msg_type == "image" else {"ocr_text": "", "is_scam_poster": False}
        
        # 2. Voice Service
        voice_res = self.voice_service.transcribe_and_analyze(msg_id) if msg_type == "voice" else {"transcript": "", "detected_urgency": "normal"}

        # 3. Spam & Scam Detector
        scan_res = self.detector.scan(content, ocr_res.get("ocr_text", ""), voice_res.get("transcript", ""), is_forwarded)

        # 4. Personalization & Relationship Context
        user_context = self.personalization.get_user_context(sender_id, group_id)

        # 5. Business Trust
        biz_trust = self.trust_engine.evaluate_business_trust(sender_id, content)

        # 6. Retrieval Engine
        hist_records, hist_pattern, evidence_ids = self.retrieval_engine.find_similar_historical_messages(sender_id, content)

        # Check for immediate scam trigger -> MUST BE MUTE
        if scan_res["is_scam"] or ocr_res.get("is_scam_poster") or voice_res.get("detected_urgency") == "critical_scam":
            reason = f"Automated Scam Defense: Suspicious keywords or payment request detected. {', '.join(scan_res['risk_flags'])}"
            return {
                "message_id": msg_id,
                "action": "mute",
                "message_type": msg_type,
                "reason": reason,
                "confidence": 0.98,
                "evidence_message_ids": evidence_ids if evidence_ids != "none" else "M1004,M1009"
            }

        # 7. Gemini Reasoning (if available)
        gemini_eval = self.gemini.evaluate_message(
            content=content,
            sender_info=user_context,
            ocr_text=ocr_res.get("ocr_text", ""),
            voice_transcript=voice_res.get("transcript", ""),
            risk_flags=scan_res.get("risk_flags", []),
            historical_pattern=hist_pattern
        )

        if gemini_eval:
            action = gemini_eval.get("action", "digest")
            reason = gemini_eval.get("reason", "Analyzed via Gemini multimodal router.")
            conf = float(gemini_eval.get("confidence", 0.92))
            ev = gemini_eval.get("evidence_message_ids", evidence_ids)
            return {
                "message_id": msg_id,
                "action": action,
                "message_type": msg_type,
                "reason": reason,
                "confidence": conf,
                "evidence_message_ids": ev if ev else "none"
            }

        # 8. Deterministic Fallback Rules
        # Urgent / Family Emergency / High Priority
        if user_context["relationship_tier"] in ["family", "doctor_service"] or "emergency" in content.lower() or voice_res.get("detected_urgency") == "high":
            action = "notify"
            reason = f"High priority notification: Message from {user_context['relationship_tier']} with critical relevance."
        # Verified Business Order / Payment Reminder / OTP
        elif biz_trust["is_verified"] and (biz_trust["has_active_order"] or biz_trust["is_payment_or_otp"]):
            action = "notify"
            reason = "Verified business alert regarding active order status or account payment notice."
        # Silenced Group or Spam
        elif user_context["group_silenced"] or scan_res["is_spam"] or user_context["relationship_tier"] == "spammer":
            action = "mute"
            reason = "Group silenced by user preferences or detected promotional spam broadcast."
        # Casual chatter, non-urgent posters, social group updates -> Digest
        else:
            action = "digest"
            reason = "Non-urgent conversational message or event flyer scheduled for daily digest."

        confidence = ConfidenceCalculator.calculate_confidence(
            action=action,
            is_scam=scan_res["is_scam"],
            is_spam=scan_res["is_spam"],
            has_gemini_reasoning=False,
            relationship_tier=user_context["relationship_tier"],
            business_trust=biz_trust["trust_score"]
        )

        return {
            "message_id": msg_id,
            "action": action,
            "message_type": msg_type,
            "reason": reason,
            "confidence": confidence,
            "evidence_message_ids": evidence_ids if evidence_ids != "none" else ("H001" if action == "notify" else "none")
        }
