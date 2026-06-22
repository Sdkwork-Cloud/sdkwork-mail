import {
  IMAP_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const IMAP_mail_PROVIDER_METADATA = IMAP_mail_PROVIDER_CATALOG_ENTRY;

export function createImapMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: IMAP_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const IMAP_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: IMAP_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: IMAP_mail_PROVIDER_METADATA,
  builtin: IMAP_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createImapMailDriver,
});
