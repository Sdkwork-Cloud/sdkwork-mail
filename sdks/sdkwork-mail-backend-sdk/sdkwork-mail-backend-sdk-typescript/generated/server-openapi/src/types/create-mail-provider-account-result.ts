import type { MailProviderAccount } from './mail-provider-account';
import type { MailProviderCredential } from './mail-provider-credential';

export interface CreateMailProviderAccountResult {
  account?: MailProviderAccount;
  credential?: MailProviderCredential;
}
