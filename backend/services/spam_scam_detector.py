import re
from typing import Dict, Any, List

class SpamScamDetector:
    def __init__(self):
        self.scam_keywords = [
            "giveaway", "claim $", "won $", "processing fee", "lottery",
            "unfreeze", "upi id", "verify pin", "account access restricted",
            "instant cash", "cvv", "crypto signals", "fastloan"
        ]
        self.spam_keywords = [
            "clearance sale", "80% off", "discount flyer", "promo code", "buy now",
            "limited period offer", "unsubscribed"
        ]

    def scan(self, content: str, ocr_text: str = "", voice_transcript: str = "", is_forwarded: bool = False) -> Dict[str, Any]:
        combined_text = f"{content} {ocr_text} {voice_transcript}".lower()
        risk_flags: List[str] = []
        is_scam = False
        is_spam = False

        # Scam check
        for kw in self.scam_keywords:
            if kw in combined_text:
                is_scam = True
                risk_flags.append(f"Scam keyword detected: '{kw}'")

        if is_forwarded and ("claim" in combined_text or "win" in combined_text or "free" in combined_text):
            is_scam = True
            risk_flags.append("Repeated forwarded promotional giveaway scam pattern")

        # Spam check
        for kw in self.spam_keywords:
            if kw in combined_text and not is_scam:
                is_spam = True
                risk_flags.append(f"Spam keyword detected: '{kw}'")

        if "http" in combined_text and ("verify" in combined_text or "free" in combined_text or "bit.ly" in combined_text):
            if not is_scam:
                is_spam = True
            risk_flags.append("Suspicious external shortlink")

        return {
            "is_scam": is_scam,
            "is_spam": is_spam,
            "risk_flags": risk_flags
        }
