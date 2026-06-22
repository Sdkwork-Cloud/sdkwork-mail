export interface MailTransactionalDelivery {
  id?: string;
  templateKey?: string;
  businessKind?: string;
  recipientEmail?: string;
  subject?: string;
  status?: string;
  sentAt?: string;
  createdAt?: string;
}
