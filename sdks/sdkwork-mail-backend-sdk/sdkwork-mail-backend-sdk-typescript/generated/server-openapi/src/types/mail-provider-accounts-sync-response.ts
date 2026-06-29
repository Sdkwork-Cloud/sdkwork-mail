import type { MailProviderSyncResponse } from './mail-provider-sync-response';

export interface MailProviderAccountsSyncResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
