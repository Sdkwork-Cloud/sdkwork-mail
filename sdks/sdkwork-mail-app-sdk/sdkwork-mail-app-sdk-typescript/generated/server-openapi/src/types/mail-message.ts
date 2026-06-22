export interface MailMessage {
  id?: string;
  accountId?: string;
  folderId?: string;
  threadId?: string;
  fromEmail?: string;
  subject?: string;
  snippet?: string;
  bodyText?: string;
  bodyHtml?: string;
  isRead?: boolean;
  isStarred?: boolean;
  isDraft?: boolean;
  hasAttachments?: boolean;
}
