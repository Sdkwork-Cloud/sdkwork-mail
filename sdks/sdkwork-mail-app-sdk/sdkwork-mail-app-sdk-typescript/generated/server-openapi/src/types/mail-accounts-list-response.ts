import type { MailAccount } from './mail-account';

export interface MailAccountsListResponse {
  code: 0;
  data: unknown & { items: MailAccount[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
