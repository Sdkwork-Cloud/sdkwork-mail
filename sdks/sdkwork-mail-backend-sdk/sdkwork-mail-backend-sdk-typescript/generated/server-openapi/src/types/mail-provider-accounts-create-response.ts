import type { CreateMailProviderAccountResponse } from './create-mail-provider-account-response';

export interface MailProviderAccountsCreateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
