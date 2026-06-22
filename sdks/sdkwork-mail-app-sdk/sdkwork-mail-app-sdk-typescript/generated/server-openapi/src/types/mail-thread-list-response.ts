import type { MailThread } from './mail-thread';

export interface MailThreadListResponse {
  items?: MailThread[];
  nextCursor?: string;
}
