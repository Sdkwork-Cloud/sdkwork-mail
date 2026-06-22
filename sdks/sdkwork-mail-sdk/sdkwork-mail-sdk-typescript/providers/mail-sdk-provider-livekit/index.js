import {
  LIVEKIT_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const LIVEKIT_mail_PROVIDER_METADATA = LIVEKIT_mail_PROVIDER_CATALOG_ENTRY;

export function createLivekitMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: LIVEKIT_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const LIVEKIT_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: LIVEKIT_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: LIVEKIT_mail_PROVIDER_METADATA,
  builtin: LIVEKIT_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createLivekitMailDriver,
});
