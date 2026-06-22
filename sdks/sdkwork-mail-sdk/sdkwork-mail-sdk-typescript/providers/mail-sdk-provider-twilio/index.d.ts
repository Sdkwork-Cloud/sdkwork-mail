import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const TWILIO_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateTwilioMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createTwilioMailDriver<TNativeClient = unknown>(
  options?: CreateTwilioMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const TWILIO_mail_PROVIDER_MODULE: MailProviderModule;
