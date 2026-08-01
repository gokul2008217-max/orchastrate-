import os
import json
from typing import Dict, Any, Optional

try:
    from google import genai
    from google.genai import types
    HAS_GENAI_LIB = True
except ImportError:
    HAS_GENAI_LIB = False

class GeminiReasoningEngine:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY", "")
        self.client = None
        if HAS_GENAI_LIB and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Gemini client init notice: {e}")

    def evaluate_message(
        self,
        content: str,
        sender_info: Dict[str, Any],
        ocr_text: str = "",
        voice_transcript: str = "",
        risk_flags: list = [],
        historical_pattern: str = "neutral"
    ) -> Optional[Dict[str, Any]]:
        """
        Uses Gemini 3.6 Flash for intelligent multimodal classification and reasoning.
        """
        if not self.client:
            return None

        prompt = f"""
        Analyze this incoming WhatsApp message for notification routing decision:
        Message Content: "{content}"
        OCR Text from Image: "{ocr_text}"
        Voice Transcript: "{voice_transcript}"
        Sender Relationship: {sender_info.get('relationship_tier', 'unknown')}
        Sender Preference: {sender_info.get('notification_preference', 'normal')}
        Detected Risk Flags: {risk_flags}
        Historical Behavior Pattern: {historical_pattern}

        Rules:
        - If scam/phishing/lottery/fake fee detected -> MUST choose action='mute', confidence>=0.95.
        - If family emergency/hospital/urgent work deadline/OTP delivery -> action='notify'.
        - If non-urgent event poster/group chat/casual voice note/newsletter -> action='digest'.
        - Return ONLY JSON object with keys: "action" ("notify"|"digest"|"mute"), "reason" (1-2 sentences), "confidence" (0.00-1.00), "evidence_message_ids" (string).
        """

        try:
            response = self.client.models.generateContent(
                model="gemini-3.6-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            if response and response.text:
                return json.loads(response.text.strip())
        except Exception as err:
            print(f"Gemini API call notice: {err}")
            return None
