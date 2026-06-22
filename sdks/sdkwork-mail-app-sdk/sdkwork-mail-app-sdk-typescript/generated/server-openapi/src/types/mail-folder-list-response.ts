import type { MailFolder } from './mail-folder';

export interface MailFolderListResponse {
  items?: MailFolder[];
  nextCursor?: string;
}
