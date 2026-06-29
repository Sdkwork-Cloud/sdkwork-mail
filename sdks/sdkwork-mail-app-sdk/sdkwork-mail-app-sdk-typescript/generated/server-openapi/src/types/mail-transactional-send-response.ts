import type { MailTransactionalDeliveryResponse } from './mail-transactional-delivery-response';

export interface MailTransactionalSendResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
