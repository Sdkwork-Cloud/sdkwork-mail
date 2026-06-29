import type { MailTransactionalDelivery } from './mail-transactional-delivery';

export interface MailTransactionalDeliveriesListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
