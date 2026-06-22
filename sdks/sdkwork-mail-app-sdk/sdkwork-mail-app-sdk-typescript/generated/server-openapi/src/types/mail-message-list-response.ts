import type { MailMessage } from './mail-message';

export interface MailMessageListResponse {
  items?: MailMessage[];
  nextCursor?: string;
}
