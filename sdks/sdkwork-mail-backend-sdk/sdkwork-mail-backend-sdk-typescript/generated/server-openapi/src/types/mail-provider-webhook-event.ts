export interface MailProviderWebhookEvent {
  provider?: string;
  eventType?: string;
  payload?: Record<string, unknown>;
}
