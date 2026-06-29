import type { MailMessageResponse } from './mail-message-response';

export interface MailMessagesCreateResponse201 {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
