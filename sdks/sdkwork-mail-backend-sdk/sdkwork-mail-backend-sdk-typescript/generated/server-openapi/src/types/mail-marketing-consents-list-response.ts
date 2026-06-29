import type { MailMarketingConsent } from './mail-marketing-consent';

export interface MailMarketingConsentsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
