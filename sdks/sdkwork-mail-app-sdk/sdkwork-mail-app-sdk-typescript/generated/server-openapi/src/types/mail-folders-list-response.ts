import type { MailFolder } from './mail-folder';

export interface MailFoldersListResponse {
  code: 0;
  data: unknown & { items: MailFolder[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
