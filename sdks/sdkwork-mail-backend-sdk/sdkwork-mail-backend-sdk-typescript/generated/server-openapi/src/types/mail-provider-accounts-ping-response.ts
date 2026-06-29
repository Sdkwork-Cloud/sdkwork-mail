import type { MailProviderPingResponse } from './mail-provider-ping-response';

export interface MailProviderAccountsPingResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
