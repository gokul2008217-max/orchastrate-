import os
import pandas as pd
from typing import Dict, Any, Optional

class DataLoader:
    def __init__(self, dataset_dir: str = "dataset"):
        self.dataset_dir = dataset_dir
        self.messages = None
        self.users = None
        self.groups = None
        self.group_members = None
        self.business_accounts = None
        self.user_business_history = None
        self.message_history = None
        self.message_events = None
        self.images = None
        self.voice_notes = None
        self.daily_summary = None
        self.load_all()

    def _read_csv_safe(self, filename: str) -> pd.DataFrame:
        path = os.path.join(self.dataset_dir, filename)
        if os.path.exists(path):
            try:
                return pd.read_csv(path)
            except Exception as e:
                print(f"Error reading {path}: {e}")
                return pd.DataFrame()
        return pd.DataFrame()

    def load_all(self):
        self.messages = self._read_csv_safe("messages.csv")
        self.users = self._read_csv_safe("users.csv")
        self.groups = self._read_csv_safe("groups.csv")
        self.group_members = self._read_csv_safe("group_members.csv")
        self.business_accounts = self._read_csv_safe("business_accounts.csv")
        self.user_business_history = self._read_csv_safe("user_business_history.csv")
        self.message_history = self._read_csv_safe("message_history.csv")
        self.message_events = self._read_csv_safe("message_events.csv")
        self.images = self._read_csv_safe("images.csv")
        self.voice_notes = self._read_csv_safe("voice_notes.csv")
        self.daily_summary = self._read_csv_safe("daily_notification_summary.csv")

    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        if self.users is not None and not self.users.empty:
            matches = self.users[self.users["user_id"] == user_id]
            if not matches.empty:
                return matches.iloc[0].to_dict()
        return None

    def get_group(self, group_id: str) -> Optional[Dict[str, Any]]:
        if self.groups is not None and not self.groups.empty:
            matches = self.groups[self.groups["group_id"] == group_id]
            if not matches.empty:
                return matches.iloc[0].to_dict()
        return None

    def get_image_details(self, message_id: str) -> Optional[Dict[str, Any]]:
        if self.images is not None and not self.images.empty:
            matches = self.images[self.images["message_id"] == message_id]
            if not matches.empty:
                return matches.iloc[0].to_dict()
        return None

    def get_voice_details(self, message_id: str) -> Optional[Dict[str, Any]]:
        if self.voice_notes is not None and not self.voice_notes.empty:
            matches = self.voice_notes[self.voice_notes["message_id"] == message_id]
            if not matches.empty:
                return matches.iloc[0].to_dict()
        return None
