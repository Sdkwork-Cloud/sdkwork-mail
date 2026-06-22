import type { MailTransactionalDelivery } from './mail-transactional-delivery';

export interface MailTransactionalDeliveryListResponse {
  items?: MailTransactionalDelivery[];
  nextCursor?: string;
}
