export interface GrantMailMarketingConsentRequest {
  recipientEmail: string;
  consentSource?: string;
  metadata?: Record<string, unknown>;
}
