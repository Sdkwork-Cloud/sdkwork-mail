import type { CreateMailProviderAccountResponse } from './create-mail-provider-account-response';

export interface MailProviderAccountsCreateResponse201 {
  code: 0;
  data: unknown & { item: CreateMailProviderAccountResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
