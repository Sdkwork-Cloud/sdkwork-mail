import type { MailFolder } from './mail-folder';

export interface MailFoldersListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
