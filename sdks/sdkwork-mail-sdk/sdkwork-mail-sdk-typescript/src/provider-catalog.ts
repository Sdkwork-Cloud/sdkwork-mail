import { freezeMailRuntimeValue } from './runtime-freeze.js';
import { REQUIRED_mail_CAPABILITIES } from './capability-catalog.js';
import type { MailProviderCatalogEntry } from './types.js';

export const DEFAULT_mail_PROVIDER_KEY = 'volcengine';
export const DEFAULT_mail_PROVIDER_PLUGIN_ID = 'Mail-volcengine';
export const DEFAULT_mail_PROVIDER_DRIVER_ID = 'sdkwork-mail-driver-volcengine';
export const BUILTIN_mail_PROVIDER_KEYS = freezeMailRuntimeValue(['volcengine', 'aliyun', 'tencent', 'agora', 'livekit'] as const);
export const OFFICIAL_mail_PROVIDER_KEYS = freezeMailRuntimeValue(['volcengine', 'aliyun', 'tencent', 'agora', 'zego', 'livekit', 'twilio', 'jitsi', 'janus', 'mediasoup'] as const);

export const VOLCENGINE_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'volcengine',
  pluginId: 'Mail-volcengine',
  driverId: 'sdkwork-mail-driver-volcengine',
  displayName: 'Volcengine Mail',
  defaultSelected: true,
  urlSchemes: ['Mail:volcengine'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'cloud-mix', 'provider.active-query'] as const,
  extensionKeys: ['volcengine.native-client'] as const,
  tier: 'tier-a',
  builtin: true,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reference-baseline',
    officialVendorSdkRequirement: 'required',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-volcengine',
    sourceModule: './index.js',
    driverFactory: 'createVolcengineMailDriver',
    metadataSymbol: 'VOLCENGINE_mail_PROVIDER_METADATA',
    moduleSymbol: 'VOLCENGINE_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const ALIYUN_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'aliyun',
  pluginId: 'Mail-aliyun',
  driverId: 'sdkwork-mail-driver-aliyun',
  displayName: 'Aliyun Mail',
  defaultSelected: false,
  urlSchemes: ['Mail:aliyun'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'cloud-mix', 'provider.active-query'] as const,
  extensionKeys: ['aliyun.native-client'] as const,
  tier: 'tier-a',
  builtin: true,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-aliyun',
    sourceModule: './index.js',
    driverFactory: 'createAliyunMailDriver',
    metadataSymbol: 'ALIYUN_mail_PROVIDER_METADATA',
    moduleSymbol: 'ALIYUN_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const TENCENT_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'tencent',
  pluginId: 'Mail-tencent',
  driverId: 'sdkwork-mail-driver-tencent',
  displayName: 'Tencent Mail',
  defaultSelected: false,
  urlSchemes: ['Mail:tencent'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'cdn-relay', 'provider.active-query'] as const,
  extensionKeys: ['tencent.native-client'] as const,
  tier: 'tier-a',
  builtin: true,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reference-baseline',
    officialVendorSdkRequirement: 'required',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-tencent',
    sourceModule: './index.js',
    driverFactory: 'createTencentMailDriver',
    metadataSymbol: 'TENCENT_mail_PROVIDER_METADATA',
    moduleSymbol: 'TENCENT_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const AGORA_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'agora',
  pluginId: 'Mail-agora',
  driverId: 'sdkwork-mail-driver-agora',
  displayName: 'Agora Mail',
  defaultSelected: false,
  urlSchemes: ['Mail:agora'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'cloud-mix', 'data-channel', 'spatial-audio', 'e2ee', 'provider.active-query'] as const,
  extensionKeys: ['agora.native-client'] as const,
  tier: 'tier-a',
  builtin: true,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-agora',
    sourceModule: './index.js',
    driverFactory: 'createAgoraMailDriver',
    metadataSymbol: 'AGORA_mail_PROVIDER_METADATA',
    moduleSymbol: 'AGORA_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const ZEGO_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'zego',
  pluginId: 'Mail-zego',
  driverId: 'sdkwork-mail-driver-zego',
  displayName: 'ZEGO Mail',
  defaultSelected: false,
  urlSchemes: ['Mail:zego'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'cloud-mix', 'beauty', 'provider.active-query'] as const,
  extensionKeys: ['zego.native-client'] as const,
  tier: 'tier-b',
  builtin: false,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-zego',
    sourceModule: './index.js',
    driverFactory: 'createZegoMailDriver',
    metadataSymbol: 'ZEGO_mail_PROVIDER_METADATA',
    moduleSymbol: 'ZEGO_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const LIVEKIT_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'livekit',
  pluginId: 'Mail-livekit',
  driverId: 'sdkwork-mail-driver-livekit',
  displayName: 'LiveKit Mail',
  defaultSelected: false,
  urlSchemes: ['Mail:livekit'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'data-channel', 'transcription', 'e2ee', 'provider.active-query'] as const,
  extensionKeys: ['livekit.native-client'] as const,
  tier: 'tier-a',
  builtin: true,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-livekit',
    sourceModule: './index.js',
    driverFactory: 'createLivekitMailDriver',
    metadataSymbol: 'LIVEKIT_mail_PROVIDER_METADATA',
    moduleSymbol: 'LIVEKIT_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const TWILIO_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'twilio',
  pluginId: 'Mail-twilio',
  driverId: 'sdkwork-mail-driver-twilio',
  displayName: 'Twilio Video',
  defaultSelected: false,
  urlSchemes: ['Mail:twilio'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'data-channel', 'provider.active-query'] as const,
  extensionKeys: ['twilio.native-client'] as const,
  tier: 'tier-b',
  builtin: false,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-twilio',
    sourceModule: './index.js',
    driverFactory: 'createTwilioMailDriver',
    metadataSymbol: 'TWILIO_mail_PROVIDER_METADATA',
    moduleSymbol: 'TWILIO_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const JITSI_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'jitsi',
  pluginId: 'Mail-jitsi',
  driverId: 'sdkwork-mail-driver-jitsi',
  displayName: 'Jitsi Meet',
  defaultSelected: false,
  urlSchemes: ['Mail:jitsi'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['screen-share', 'recording', 'artifact', 'transcription', 'provider.active-query'] as const,
  extensionKeys: ['jitsi.native-client'] as const,
  tier: 'tier-b',
  builtin: false,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-jitsi',
    sourceModule: './index.js',
    driverFactory: 'createJitsiMailDriver',
    metadataSymbol: 'JITSI_mail_PROVIDER_METADATA',
    moduleSymbol: 'JITSI_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const JANUS_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'janus',
  pluginId: 'Mail-janus',
  driverId: 'sdkwork-mail-driver-janus',
  displayName: 'Janus Mail',
  defaultSelected: false,
  urlSchemes: ['Mail:janus'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['data-channel', 'provider.active-query'] as const,
  extensionKeys: ['janus.native-client'] as const,
  tier: 'tier-c',
  builtin: false,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-janus',
    sourceModule: './index.js',
    driverFactory: 'createJanusMailDriver',
    metadataSymbol: 'JANUS_mail_PROVIDER_METADATA',
    moduleSymbol: 'JANUS_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const MEDIASOUP_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'mediasoup',
  pluginId: 'Mail-mediasoup',
  driverId: 'sdkwork-mail-driver-mediasoup',
  displayName: 'mediasoup Mail',
  defaultSelected: false,
  urlSchemes: ['Mail:mediasoup'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['data-channel', 'provider.active-query'] as const,
  extensionKeys: ['mediasoup.native-client'] as const,
  tier: 'tier-c',
  builtin: false,
  typescriptAdapter: {
    sdkProvisioning: 'consumer-supplied',
    bindingStrategy: 'native-factory',
    bundlePolicy: 'must-not-bundle',
    runtimeBridgeStatus: 'reserved',
    officialVendorSdkRequirement: 'not-declared-until-bridge',
  },
  typescriptPackage: {
    packageName: '@sdkwork/Mail-sdk-provider-mediasoup',
    sourceModule: './index.js',
    driverFactory: 'createMediasoupMailDriver',
    metadataSymbol: 'MEDIASOUP_mail_PROVIDER_METADATA',
    moduleSymbol: 'MEDIASOUP_mail_PROVIDER_MODULE',
    rootPublic: false,
  },
});

export const BUILTIN_mail_PROVIDER_CATALOG: readonly MailProviderCatalogEntry[] = freezeMailRuntimeValue([
  VOLCENGINE_mail_PROVIDER_CATALOG_ENTRY,
  ALIYUN_mail_PROVIDER_CATALOG_ENTRY,
  TENCENT_mail_PROVIDER_CATALOG_ENTRY,
  AGORA_mail_PROVIDER_CATALOG_ENTRY,
  LIVEKIT_mail_PROVIDER_CATALOG_ENTRY
]);

export const OFFICIAL_mail_PROVIDER_CATALOG: readonly MailProviderCatalogEntry[] = freezeMailRuntimeValue([
  VOLCENGINE_mail_PROVIDER_CATALOG_ENTRY,
  ALIYUN_mail_PROVIDER_CATALOG_ENTRY,
  TENCENT_mail_PROVIDER_CATALOG_ENTRY,
  AGORA_mail_PROVIDER_CATALOG_ENTRY,
  ZEGO_mail_PROVIDER_CATALOG_ENTRY,
  LIVEKIT_mail_PROVIDER_CATALOG_ENTRY,
  TWILIO_mail_PROVIDER_CATALOG_ENTRY,
  JITSI_mail_PROVIDER_CATALOG_ENTRY,
  JANUS_mail_PROVIDER_CATALOG_ENTRY,
  MEDIASOUP_mail_PROVIDER_CATALOG_ENTRY
]);

const BUILTIN_mail_PROVIDER_BY_KEY = new Map<string, MailProviderCatalogEntry>(
  BUILTIN_mail_PROVIDER_CATALOG.map((provider) => [provider.providerKey, provider]),
);

const OFFICIAL_mail_PROVIDER_BY_KEY = new Map<string, MailProviderCatalogEntry>(
  OFFICIAL_mail_PROVIDER_CATALOG.map((provider) => [provider.providerKey, provider]),
);

export function getBuiltinMailProviderMetadata(): readonly MailProviderCatalogEntry[] {
  return BUILTIN_mail_PROVIDER_CATALOG;
}

export function getBuiltinMailProviderMetadataByKey(
  providerKey: string,
): MailProviderCatalogEntry | undefined {
  return BUILTIN_mail_PROVIDER_BY_KEY.get(providerKey);
}

export function getOfficialMailProviderMetadata(): readonly MailProviderCatalogEntry[] {
  return OFFICIAL_mail_PROVIDER_CATALOG;
}

export function getOfficialMailProviderMetadataByKey(
  providerKey: string,
): MailProviderCatalogEntry | undefined {
  return OFFICIAL_mail_PROVIDER_BY_KEY.get(providerKey);
}

export function getMailProviderByProviderKey(
  providerKey: string,
): MailProviderCatalogEntry | undefined {
  return getOfficialMailProviderMetadataByKey(providerKey);
}
