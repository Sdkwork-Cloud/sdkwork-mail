import type { VerifyMailCodeResponse } from './verify-mail-code-response';

export interface MailVerificationVerifyResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
