import {
  SMTP_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const SMTP_mail_PROVIDER_METADATA = SMTP_mail_PROVIDER_CATALOG_ENTRY;

export function createSmtpMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: SMTP_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const SMTP_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: SMTP_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: SMTP_mail_PROVIDER_METADATA,
  builtin: SMTP_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createSmtpMailDriver,
});
