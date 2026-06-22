import {
  ZEGO_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const ZEGO_mail_PROVIDER_METADATA = ZEGO_mail_PROVIDER_CATALOG_ENTRY;

export function createZegoMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: ZEGO_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const ZEGO_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: ZEGO_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: ZEGO_mail_PROVIDER_METADATA,
  builtin: ZEGO_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createZegoMailDriver,
});
