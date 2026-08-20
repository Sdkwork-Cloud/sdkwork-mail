import type { MailTransactionalDelivery } from './mail-transactional-delivery';

export interface MailTransactionalDeliveriesListResponse {
  code: 0;
  data: unknown & { items: MailTransactionalDelivery[]; pageInfo: { mode: 'cursor'; nextCursor?: string | null; hasMore: boolean; }; };
  /** Server-owned request correlation id. */
  traceId: string;
}
