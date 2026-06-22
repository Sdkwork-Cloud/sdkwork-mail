import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const JANUS_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateJanusMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createJanusMailDriver<TNativeClient = unknown>(
  options?: CreateJanusMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const JANUS_mail_PROVIDER_MODULE: MailProviderModule;
