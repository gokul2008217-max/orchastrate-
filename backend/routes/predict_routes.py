from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from backend.models.schemas import MessageInput, PredictionResult, ImagePredictionRequest, VoicePredictionRequest
from backend.services.notification_decision_engine import NotificationDecisionEngine
from backend.services.output_generator import OutputGenerator

router = APIRouter()
engine = NotificationDecisionEngine()
generator = OutputGenerator()

@router.post("/predict", response_model=Dict[str, Any])
def predict_dataset():
    """Runs prediction pipeline on dataset and generates output.csv"""
    try:
        results = generator.generate_output_csv("output.csv")
        return {
            "status": "success",
            "processed_count": len(results),
            "output_file": "output.csv",
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-single", response_model=Dict[str, Any])
def predict_single_message(msg: MessageInput):
    """Predict routing for a single custom input message"""
    try:
        res = engine.process_single_message(msg.model_dump())
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-image", response_model=Dict[str, Any])
def predict_image(req: ImagePredictionRequest):
    """Predict routing for image poster/screenshot"""
    msg = {
        "message_id": "MSG_IMG_TEST",
        "sender_id": "U104",
        "message_type": "image",
        "content": req.caption or "Image poster submission",
        "is_forwarded": False
    }
    res = engine.process_single_message(msg)
    if req.ocr_text:
        res["ocr_text_analyzed"] = req.ocr_text
    return res

@router.post("/predict-voice", response_model=Dict[str, Any])
def predict_voice(req: VoicePredictionRequest):
    """Predict routing for voice note audio/transcript"""
    msg = {
        "message_id": "MSG_VN_TEST",
        "sender_id": "U102",
        "message_type": "voice",
        "content": req.transcript or "Voice note submission",
        "is_forwarded": False
    }
    res = engine.process_single_message(msg)
    return res
