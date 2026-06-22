import {
  ALIYUN_mail_PROVIDER_CATALOG_ENTRY,
  createMailProviderDriver,
  createMailProviderModule,
} from '@sdkwork/Mail-sdk';


export const ALIYUN_mail_PROVIDER_METADATA = ALIYUN_mail_PROVIDER_CATALOG_ENTRY;

export function createAliyunMailDriver(options = {}) {
  return createMailProviderDriver({
    metadata: ALIYUN_mail_PROVIDER_METADATA,
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const ALIYUN_mail_PROVIDER_MODULE = createMailProviderModule({
  packageName: ALIYUN_mail_PROVIDER_METADATA.typescriptPackage.packageName,
  metadata: ALIYUN_mail_PROVIDER_METADATA,
  builtin: ALIYUN_mail_PROVIDER_CATALOG_ENTRY.builtin,
  createDriver: createAliyunMailDriver,
});
