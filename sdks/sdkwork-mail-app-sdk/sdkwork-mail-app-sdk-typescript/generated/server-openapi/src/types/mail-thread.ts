export interface MailThread {
  id?: string;
  accountId?: string;
  folderId?: string;
  subject?: string;
  snippet?: string;
  messageCount?: number;
  unreadCount?: number;
  isStarred?: boolean;
}
