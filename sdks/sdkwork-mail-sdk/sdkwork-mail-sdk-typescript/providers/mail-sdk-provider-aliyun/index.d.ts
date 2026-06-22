import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const ALIYUN_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export type CreateAliyunMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function createAliyunMailDriver<TNativeClient = unknown>(
  options?: CreateAliyunMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const ALIYUN_mail_PROVIDER_MODULE: MailProviderModule;
