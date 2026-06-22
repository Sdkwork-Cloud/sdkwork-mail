import {
  AGORA_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const AGORA_mail_PROVIDER_METADATA = AGORA_mail_PROVIDER_CATALOG_ENTRY;

export function createAgoraMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: AGORA_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const AGORA_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: AGORA_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: AGORA_mail_PROVIDER_METADATA,
  builtin: AGORA_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createAgoraMailDriver,
});
