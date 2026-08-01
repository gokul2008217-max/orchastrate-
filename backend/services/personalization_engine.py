from typing import Dict, Any, Optional

class PersonalizationEngine:
    def __init__(self, data_loader=None):
        self.data_loader = data_loader

    def get_user_context(self, sender_id: str, group_id: Optional[str] = "none") -> Dict[str, Any]:
        """
        Calculates relationship tier, group silence settings, notification preference.
        """
        relationship_tier = "unknown"
        pref = "normal"
        group_silenced = False

        if self.data_loader:
            user = self.data_loader.get_user(sender_id)
            if user:
                relationship_tier = user.get("relationship_tier", "unknown")
                pref = user.get("notification_preference", "normal")

            if group_id and group_id != "none":
                group = self.data_loader.get_group(group_id)
                if group:
                    group_silenced = bool(group.get("silenced_by_user", False))

        return {
            "relationship_tier": relationship_tier,
            "notification_preference": pref,
            "group_silenced": group_silenced
        }
