export interface MailProviderAccount {
  id?: string;
  providerKind?: string;
  name?: string;
  host?: string;
  port?: number;
  useTls?: boolean;
  status?: string;
}
