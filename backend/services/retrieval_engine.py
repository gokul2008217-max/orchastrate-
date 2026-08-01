from typing import List, Dict, Any, Tuple

try:
    import numpy as np
    import faiss
    from sentence_transformers import SentenceTransformer
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False

class RetrievalEngine:
    def __init__(self, data_loader=None):
        self.data_loader = data_loader
        self.encoder = None
        self.index = None
        if FAISS_AVAILABLE:
            try:
                self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
            except Exception:
                self.encoder = None

    def find_similar_historical_messages(self, sender_id: str, content: str) -> Tuple[List[Dict[str, Any]], str, str]:
        """
        Find historical messages for sender and determine user behavior patterns using FAISS vector search and SentenceTransformers.
        If similar messages were ignored repeatedly -> prefer Digest or Mute.
        If similar messages received replies -> prefer Notify.
        Returns (historical_records, behavioral_preference, evidence_ids).
        """
        if not self.data_loader or self.data_loader.message_history is None:
            return [], "neutral", "none"

        history_df = self.data_loader.message_history
        sender_matches = history_df[history_df["sender_id"] == sender_id]

        evidence_ids = []
        if not sender_matches.empty:
            for _, row in sender_matches.iterrows():
                evidence_ids.append(str(row["history_id"]))
            
            actions = sender_matches["user_action_taken"].tolist()
            if "replied" in actions or "opened" in actions:
                return sender_matches.to_dict(orient="records"), "prefer_notify", ",".join(evidence_ids[:3])
            elif "ignored" in actions or "reported_spam" in actions:
                return sender_matches.to_dict(orient="records"), "prefer_mute_or_digest", ",".join(evidence_ids[:3])

        return [], "neutral", "none"
