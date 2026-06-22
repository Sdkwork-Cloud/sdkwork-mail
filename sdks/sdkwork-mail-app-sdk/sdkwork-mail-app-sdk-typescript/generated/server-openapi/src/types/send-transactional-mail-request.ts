export interface SendTransactionalMailRequest {
  templateKey: string;
  recipientEmail: string;
  locale?: string;
  variables?: Record<string, unknown>;
  correlationId?: string;
  fromEmail?: string;
}
