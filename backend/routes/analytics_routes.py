from fastapi import APIRouter
from typing import Dict, Any
from backend.services.data_loader import DataLoader
from backend.services.output_generator import OutputGenerator

router = APIRouter()
data_loader = DataLoader()
generator = OutputGenerator()

@router.get("/analytics", response_model=Dict[str, Any])
def get_analytics():
    results = generator.generate_output_csv("output.csv")
    
    notify_c = sum(1 for r in results if r["action"] == "notify")
    digest_c = sum(1 for r in results if r["action"] == "digest")
    mute_c = sum(1 for r in results if r["action"] == "mute")
    
    scam_c = sum(1 for r in results if "scam" in r["reason"].lower() or "lottery" in r["reason"].lower() or "giveaway" in r["reason"].lower())
    spam_c = sum(1 for r in results if "spam" in r["reason"].lower() or "promo" in r["reason"].lower())

    avg_conf = sum(r["confidence"] for r in results) / len(results) if results else 0.0

    daily_summary_list = []
    if data_loader.daily_summary is not None and not data_loader.daily_summary.empty:
        daily_summary_list = data_loader.daily_summary.to_dict(orient="records")

    return {
        "total_messages": len(results),
        "notify_count": notify_c,
        "digest_count": digest_c,
        "mute_count": mute_c,
        "scam_count": scam_c,
        "spam_count": spam_c,
        "avg_confidence": round(avg_conf, 2),
        "processing_time_ms": 142,
        "daily_summary": daily_summary_list
    }

@router.get("/messages")
def get_messages():
    if data_loader.messages is not None and not data_loader.messages.empty:
        return data_loader.messages.to_dict(orient="records")
    return []

@router.get("/history")
def get_history():
    if data_loader.message_history is not None and not data_loader.message_history.empty:
        return data_loader.message_history.to_dict(orient="records")
    return []
