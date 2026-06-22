import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const ZEGO_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateZegoMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createZegoMailDriver<TNativeClient = unknown>(
  options?: CreateZegoMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const ZEGO_mail_PROVIDER_MODULE: MailProviderModule;
