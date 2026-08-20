import type { MailProviderWebhookEventResponse } from './mail-provider-webhook-event-response';

export interface MailProviderWebhooksEventsCreateResponse201 {
  code: 0;
  data: unknown & { item: MailProviderWebhookEventResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
