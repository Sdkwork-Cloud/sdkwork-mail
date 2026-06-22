import type { MailMarketingConsent } from './mail-marketing-consent';

export interface MailMarketingConsentListResponse {
  items?: MailMarketingConsent[];
  nextCursor?: string;
}
