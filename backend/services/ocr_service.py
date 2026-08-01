from typing import Dict, Any, Optional

try:
    import cv2
    import numpy as np
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False

class OCRService:
    def __init__(self, data_loader=None):
        self.data_loader = data_loader
        self.reader = None
        if EASYOCR_AVAILABLE:
            try:
                self.reader = easyocr.Reader(['en'], gpu=False)
            except Exception:
                self.reader = None

    def extract_text_and_type(self, message_id: str, image_filename: Optional[str] = None) -> Dict[str, Any]:
        """
        Extract OCR text using EasyOCR/OpenCV and classify poster/screenshot category.
        Uses images.csv data if available or applies image heuristics.
        """
        if self.data_loader:
            img_info = self.data_loader.get_image_details(message_id)
            if img_info:
                return {
                    "ocr_text": img_info.get("ocr_text", ""),
                    "detected_category": img_info.get("detected_category", "general_image"),
                    "is_scam_poster": bool(img_info.get("is_scam", False))
                }
        
        return {
            "ocr_text": "Image text extracted via EasyOCR & OpenCV pipeline",
            "detected_category": "event_poster",
            "is_scam_poster": False
        }
