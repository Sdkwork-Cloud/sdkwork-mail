import type { MailTemplateResponse } from './mail-template-response';

export interface MailTemplatesCreateResponse201 {
  code: 0;
  data: unknown & { item: MailTemplateResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
