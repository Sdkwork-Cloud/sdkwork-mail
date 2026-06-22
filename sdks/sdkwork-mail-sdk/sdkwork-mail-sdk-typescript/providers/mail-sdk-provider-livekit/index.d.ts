import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const LIVEKIT_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateLivekitMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createLivekitMailDriver<TNativeClient = unknown>(
  options?: CreateLivekitMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const LIVEKIT_mail_PROVIDER_MODULE: MailProviderModule;
