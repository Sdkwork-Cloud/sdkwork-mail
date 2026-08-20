import type { MailTransactionalDeliveryResponse } from './mail-transactional-delivery-response';

export interface MailTransactionalSendResponse {
  code: 0;
  data: unknown & { item: MailTransactionalDeliveryResponse; };
  /** Server-owned request correlation id. */
  traceId: string;
}
