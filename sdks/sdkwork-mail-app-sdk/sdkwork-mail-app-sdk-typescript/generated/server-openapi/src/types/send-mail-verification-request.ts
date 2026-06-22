export interface SendMailVerificationRequest {
  recipientEmail: string;
  purpose: string;
  templateKey?: string;
  locale?: string;
  variables?: Record<string, unknown>;
  correlationId?: string;
}
