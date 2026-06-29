import type { MailAccount } from './mail-account';

export interface MailAccountsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
