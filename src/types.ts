export type ActionType = 'notify' | 'digest' | 'mute';
export type MessageMedium = 'text' | 'image' | 'voice';

export interface PredictionResult {
  message_id: string;
  action: ActionType;
  message_type: MessageMedium;
  reason: string;
  confidence: number;
  evidence_message_ids: string;
}

export interface WhatsAppMessage {
  message_id: string;
  sender_id: string;
  group_id: string;
  message_type: MessageMedium;
  content: string;
  timestamp: string;
  media_file: string;
  is_forwarded: boolean | string;
  reply_to_message_id: string;
}

export interface AnalyticsData {
  total_messages: number;
  notify_count: number;
  digest_count: number;
  mute_count: number;
  scam_count: number;
  spam_count: number;
  avg_confidence: number;
  processing_time_ms: number;
  daily_summary: Array<{
    date: string;
    total_received: number;
    notify_count: number;
    digest_count: number;
    mute_count: number;
    scam_blocked_count: number;
  }>;
}

export interface MessageHistoryRecord {
  history_id: string;
  sender_id: string;
  content_category: string;
  user_action_taken: string;
  response_time_seconds: number;
  action_count: number;
}
