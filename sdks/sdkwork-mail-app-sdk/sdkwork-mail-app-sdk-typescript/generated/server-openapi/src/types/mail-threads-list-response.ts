import type { MailThread } from './mail-thread';

export interface MailThreadsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
