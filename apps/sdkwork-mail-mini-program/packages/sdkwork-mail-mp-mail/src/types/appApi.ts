export interface MailAccount {
  id?: string;
  emailAddress?: string;
  displayName?: string;
  providerKind?: string;
  status?: string;
  syncEnabled?: boolean;
}

export interface MailFolder {
  id?: string;
  accountId?: string;
  folderKind?: string;
  name?: string;
  unreadCount?: number;
  totalCount?: number;
}

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

export interface CreateMailMessageRequest {
  accountId: string;
  subject: string;
  folderId?: string;
  threadId?: string;
  bodyText?: string;
  bodyHtml?: string;
  isDraft?: boolean;
}

export interface UpdateMailMessageRequest {
  folderId?: string;
  isRead?: boolean;
  isStarred?: boolean;
  isDraft?: boolean;
}
