import type { MailThread } from './mail-thread';

export interface MailThreadsListResponse {
  code: 0;
  data: unknown & { items: MailThread[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
