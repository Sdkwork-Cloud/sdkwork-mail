import {
  JITSI_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const JITSI_mail_PROVIDER_METADATA = JITSI_mail_PROVIDER_CATALOG_ENTRY;

export function createJitsiMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: JITSI_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const JITSI_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: JITSI_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: JITSI_mail_PROVIDER_METADATA,
  builtin: JITSI_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createJitsiMailDriver,
});
