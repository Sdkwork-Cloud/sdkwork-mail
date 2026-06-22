import type { MailTemplate } from './mail-template';

export interface MailTemplateListResponse {
  items?: MailTemplate[];
  nextCursor?: string;
}
