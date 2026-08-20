import type { MailMessageResponse } from './mail-message-response';

export interface MailMessagesUpdateResponse {
  code: 0;
  data: unknown & { item: MailMessageResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
