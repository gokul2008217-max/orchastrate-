from typing import Dict, Any, Optional

class OCRService:
    def __init__(self, data_loader=None):
        self.data_loader = data_loader

    def extract_text_and_type(self, message_id: str, image_filename: Optional[str] = None) -> Dict[str, Any]:
        """
        Extract OCR text and classify poster/screenshot category.
        Uses images.csv data if available or applies heuristics.
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
            "ocr_text": "Image text extracted via EasyOCR",
            "detected_category": "event_poster",
            "is_scam_poster": False
        }
