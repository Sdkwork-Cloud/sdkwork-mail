import type { MailProviderAccount } from './mail-provider-account';

export interface MailProviderAccountsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
