import {
  JANUS_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const JANUS_mail_PROVIDER_METADATA = JANUS_mail_PROVIDER_CATALOG_ENTRY;

export function createJanusMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: JANUS_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const JANUS_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: JANUS_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: JANUS_mail_PROVIDER_METADATA,
  builtin: JANUS_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createJanusMailDriver,
});
