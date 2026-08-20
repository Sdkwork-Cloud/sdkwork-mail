import type { MailMarketingConsent } from './mail-marketing-consent';

export interface MailMarketingConsentsListResponse {
  code: 0;
  data: unknown & { items: MailMarketingConsent[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
