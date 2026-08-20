import type { MailMessage } from './mail-message';

export interface MailMessagesListResponse {
  code: 0;
  data: unknown & { items: MailMessage[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
