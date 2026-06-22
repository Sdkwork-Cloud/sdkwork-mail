import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const JITSI_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateJitsiMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createJitsiMailDriver<TNativeClient = unknown>(
  options?: CreateJitsiMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const JITSI_mail_PROVIDER_MODULE: MailProviderModule;
