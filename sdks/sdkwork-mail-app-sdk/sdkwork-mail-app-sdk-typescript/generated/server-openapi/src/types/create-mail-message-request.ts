export interface CreateMailMessageRequest {
  accountId: string;
  folderId?: string;
  threadId?: string;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  isDraft?: boolean;
}
