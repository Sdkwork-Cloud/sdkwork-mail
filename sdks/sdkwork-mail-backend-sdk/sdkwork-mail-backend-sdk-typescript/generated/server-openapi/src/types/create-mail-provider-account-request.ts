import type { CreateMailProviderCredentialInput } from './create-mail-provider-credential-input';

export interface CreateMailProviderAccountRequest {
  providerKind: string;
  name: string;
  host: string;
  port: number;
  useTls: boolean;
  credential?: CreateMailProviderCredentialInput;
}
