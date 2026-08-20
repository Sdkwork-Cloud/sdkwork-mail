import type { VerifyMailCodeResponse } from './verify-mail-code-response';

export interface MailVerificationVerifyResponse {
  code: 0;
  data: unknown & { item: VerifyMailCodeResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
