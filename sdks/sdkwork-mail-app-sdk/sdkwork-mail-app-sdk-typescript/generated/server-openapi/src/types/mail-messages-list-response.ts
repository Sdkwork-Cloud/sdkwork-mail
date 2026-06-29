import type { MailMessage } from './mail-message';

export interface MailMessagesListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
