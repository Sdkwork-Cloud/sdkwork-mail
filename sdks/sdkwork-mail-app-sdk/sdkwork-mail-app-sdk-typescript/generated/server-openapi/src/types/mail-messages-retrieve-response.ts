import type { MailMessageResponse } from './mail-message-response';

export interface MailMessagesRetrieveResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
