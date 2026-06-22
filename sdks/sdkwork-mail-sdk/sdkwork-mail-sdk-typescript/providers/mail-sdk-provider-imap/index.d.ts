import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const IMAP_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateImapMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createImapMailDriver<TNativeClient = unknown>(
  options?: CreateImapMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const IMAP_mail_PROVIDER_MODULE: MailProviderModule;
