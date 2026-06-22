import {
  TWILIO_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const TWILIO_mail_PROVIDER_METADATA = TWILIO_mail_PROVIDER_CATALOG_ENTRY;

export function createTwilioMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: TWILIO_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const TWILIO_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: TWILIO_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: TWILIO_mail_PROVIDER_METADATA,
  builtin: TWILIO_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createTwilioMailDriver,
});
