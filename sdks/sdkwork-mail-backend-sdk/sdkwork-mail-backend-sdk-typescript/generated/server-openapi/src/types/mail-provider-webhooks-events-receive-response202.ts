import type { MailProviderWebhookEventResponse } from './mail-provider-webhook-event-response';

export interface MailProviderWebhooksEventsReceiveResponse202 {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
