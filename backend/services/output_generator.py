import os
import pandas as pd
from typing import List, Dict, Any
from backend.services.data_loader import DataLoader
from backend.services.notification_decision_engine import NotificationDecisionEngine

class OutputGenerator:
    def __init__(self, dataset_dir: str = "dataset"):
        self.data_loader = DataLoader(dataset_dir)
        self.engine = NotificationDecisionEngine(self.data_loader)

    def generate_output_csv(self, output_path: str = "output.csv") -> List[Dict[str, Any]]:
        results = []
        if self.data_loader.messages is None or self.data_loader.messages.empty:
            return results

        for _, row in self.data_loader.messages.iterrows():
            msg_dict = row.to_dict()
            res = self.engine.process_single_message(msg_dict)
            results.append(res)

        df_out = pd.DataFrame(results)
        # Ensure exact requested columns: message_id, action, message_type, reason, confidence, evidence_message_ids
        cols = ["message_id", "action", "message_type", "reason", "confidence", "evidence_message_ids"]
        for col in cols:
            if col not in df_out.columns:
                df_out[col] = "none"

        df_out = df_out[cols]
        df_out.to_csv(output_path, index=False)

        # Also write to backend/output/output.csv
        os.makedirs("backend/output", exist_ok=True)
        df_out.to_csv("backend/output/output.csv", index=False)

        return results
