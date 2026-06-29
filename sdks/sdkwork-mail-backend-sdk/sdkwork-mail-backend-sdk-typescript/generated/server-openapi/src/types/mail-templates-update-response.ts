import type { MailTemplateResponse } from './mail-template-response';

export interface MailTemplatesUpdateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
