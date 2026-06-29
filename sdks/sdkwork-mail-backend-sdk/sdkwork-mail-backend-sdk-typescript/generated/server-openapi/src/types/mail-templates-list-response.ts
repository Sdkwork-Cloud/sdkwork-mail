import type { MailTemplate } from './mail-template';

export interface MailTemplatesListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
