import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const MEDIASOUP_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateMediasoupMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createMediasoupMailDriver<TNativeClient = unknown>(
  options?: CreateMediasoupMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const MEDIASOUP_mail_PROVIDER_MODULE: MailProviderModule;
