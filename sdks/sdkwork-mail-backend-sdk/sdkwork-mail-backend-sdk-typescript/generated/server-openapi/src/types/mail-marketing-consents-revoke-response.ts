import type { MailMarketingConsentResponse } from './mail-marketing-consent-response';

export interface MailMarketingConsentsRevokeResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
