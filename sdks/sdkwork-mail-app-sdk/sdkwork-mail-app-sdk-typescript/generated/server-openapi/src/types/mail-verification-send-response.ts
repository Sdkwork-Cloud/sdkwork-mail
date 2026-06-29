import type { SendMailVerificationResponse } from './send-mail-verification-response';

export interface MailVerificationSendResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
