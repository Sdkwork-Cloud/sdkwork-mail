import type { MailTemplateResponse } from './mail-template-response';

export interface MailTemplatesRetrieveResponse {
  code: 0;
  data: unknown & { item: MailTemplateResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
