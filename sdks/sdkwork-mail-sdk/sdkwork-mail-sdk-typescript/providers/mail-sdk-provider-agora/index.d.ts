import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const AGORA_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateAgoraMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createAgoraMailDriver<TNativeClient = unknown>(
  options?: CreateAgoraMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const AGORA_mail_PROVIDER_MODULE: MailProviderModule;
