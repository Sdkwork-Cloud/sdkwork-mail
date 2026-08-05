import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/mail-sdk';

export const SMTP_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateSmtpMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createSmtpMailDriver<TNativeClient = unknown>(
  options?: CreateSmtpMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const SMTP_mail_PROVIDER_MODULE: MailProviderModule;
