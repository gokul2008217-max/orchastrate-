from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MessageInput(BaseModel):
    message_id: str
    sender_id: str
    group_id: Optional[str] = "none"
    message_type: str  # text, image, voice
    content: str
    timestamp: Optional[str] = ""
    media_file: Optional[str] = "none"
    is_forwarded: Optional[bool] = False
    reply_to_message_id: Optional[str] = "none"

class PredictionResult(BaseModel):
    message_id: str
    action: str  # notify, digest, mute
    message_type: str
    reason: str
    confidence: float
    evidence_message_ids: str
    risk_flags: List[str] = []
    business_trust_score: float = 0.5
    user_relationship: str = "unknown"

class ImagePredictionRequest(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = ""
    ocr_text: Optional[str] = ""

class VoicePredictionRequest(BaseModel):
    transcript: Optional[str] = ""
    duration_seconds: Optional[int] = 10
    detected_urgency: Optional[str] = "normal"

class AnalyticsResponse(BaseModel):
    total_messages: int
    notify_count: int
    digest_count: int
    mute_count: int
    scam_count: int
    spam_count: int
    avg_confidence: float
    action_breakdown: Dict[str, int]
    hourly_distribution: List[Dict[str, Any]]
