import type { MailAccount } from './mail-account';

export interface MailAccountListResponse {
  items?: MailAccount[];
  nextCursor?: string;
}
