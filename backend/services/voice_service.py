from typing import Dict, Any, Optional

class VoiceTranscriptionService:
    def __init__(self, data_loader=None):
        self.data_loader = data_loader

    def transcribe_and_analyze(self, message_id: str, voice_filename: Optional[str] = None) -> Dict[str, Any]:
        """
        Transcribe voice note and detect urgency, reminders, or personal conversation.
        Uses voice_notes.csv if available.
        """
        if self.data_loader:
            vn_info = self.data_loader.get_voice_details(message_id)
            if vn_info:
                return {
                    "transcript": vn_info.get("transcript", ""),
                    "detected_urgency": vn_info.get("detected_urgency", "normal"),
                    "duration_seconds": int(vn_info.get("duration_seconds", 10))
                }

        return {
            "transcript": "Voice note audio processed",
            "detected_urgency": "normal",
            "duration_seconds": 12
        }
