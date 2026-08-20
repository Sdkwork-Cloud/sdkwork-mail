import type { SendMailVerificationResponse } from './send-mail-verification-response';

export interface MailVerificationSendResponse {
  code: 0;
  data: unknown & { item: SendMailVerificationResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
