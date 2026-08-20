import type { MailTemplate } from './mail-template';

export interface MailTemplatesListResponse {
  code: 0;
  data: unknown & { items: MailTemplate[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
