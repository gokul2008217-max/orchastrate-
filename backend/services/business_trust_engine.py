from typing import Dict, Any

class BusinessTrustEngine:
    def __init__(self, data_loader=None):
        self.data_loader = data_loader

    def evaluate_business_trust(self, sender_id: str, content: str) -> Dict[str, Any]:
        """
        Evaluates business accounts and user business transaction history.
        Increases priority for verified businesses with active orders/subscriptions/OTP.
        Reduces priority for promotional spam or unverified businesses.
        """
        trust_score = 0.5
        is_verified = False
        has_active_order = False
        is_payment_or_otp = False

        if "OTP" in content.upper() or "PAYMENT" in content.upper() or "DUE" in content.upper() or "DELIVERY" in content.upper():
            is_payment_or_otp = True

        if self.data_loader:
            biz_df = self.data_loader.business_accounts
            hist_df = self.data_loader.user_business_history

            if biz_df is not None and not biz_df.empty:
                # Match sender by user or name keyword
                matched = biz_df[biz_df["business_id"].str.contains(sender_id, case=False, na=False)]
                if matched.empty:
                    # check content keywords
                    for _, row in biz_df.iterrows():
                        if str(row["name"]).lower() in content.lower():
                            matched = biz_df[biz_df["business_id"] == row["business_id"]]
                            break

                if not matched.empty:
                    biz_info = matched.iloc[0]
                    is_verified = (biz_info.get("verification_status") == "verified")
                    spam_score = float(biz_info.get("spam_score", 0.1))
                    
                    if is_verified:
                        trust_score += 0.35
                    trust_score -= (spam_score * 0.4)

            if hist_df is not None and not hist_df.empty:
                user_hist = hist_df[hist_df["user_id"] == "U101"]
                if not user_hist.empty:
                    for _, h_row in user_hist.iterrows():
                        if int(h_row.get("active_orders", 0)) > 0 or h_row.get("subscription_status") in ["active_account", "confirmed_booking", "out_for_delivery"]:
                            has_active_order = True
                            trust_score += 0.15
                            break

        trust_score = max(0.0, min(1.0, trust_score))
        return {
            "trust_score": round(trust_score, 2),
            "is_verified": is_verified,
            "has_active_order": has_active_order,
            "is_payment_or_otp": is_payment_or_otp
        }
