import {
  MEDIASOUP_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const MEDIASOUP_mail_PROVIDER_METADATA = MEDIASOUP_mail_PROVIDER_CATALOG_ENTRY;

export function createMediasoupMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: MEDIASOUP_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const MEDIASOUP_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: MEDIASOUP_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: MEDIASOUP_mail_PROVIDER_METADATA,
  builtin: MEDIASOUP_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createMediasoupMailDriver,
});
