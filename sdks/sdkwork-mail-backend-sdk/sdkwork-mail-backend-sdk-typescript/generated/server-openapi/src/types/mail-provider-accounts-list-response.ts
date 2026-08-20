import type { MailProviderAccount } from './mail-provider-account';

export interface MailProviderAccountsListResponse {
  code: 0;
  data: unknown & { items: MailProviderAccount[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
