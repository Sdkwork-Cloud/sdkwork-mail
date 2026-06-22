import type { MailProviderAccount } from './mail-provider-account';

export interface MailProviderAccountListResponse {
  items?: MailProviderAccount[];
  nextCursor?: string;
}
