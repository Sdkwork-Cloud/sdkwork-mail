import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderPackageCatalogEntry } from './types.js';

export const mail_PROVIDER_PACKAGE_STATUSES = freezeMailRuntimeValue(['package_reference_boundary'] as const);

export const VOLCENGINE_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'volcengine',
  pluginId: 'Mail-volcengine',
  driverId: 'sdkwork-mail-driver-volcengine',
  packageIdentity: '@sdkwork/Mail-sdk-provider-volcengine',
  manifestPath: 'providers/Mail-sdk-provider-volcengine/package.json',
  readmePath: 'providers/Mail-sdk-provider-volcengine/README.md',
  sourcePath: 'providers/Mail-sdk-provider-volcengine/index.js',
  declarationPath: 'providers/Mail-sdk-provider-volcengine/index.d.ts',
  sourceSymbol: 'VOLCENGINE_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createVolcengineMailDriver',
  metadataSymbol: 'VOLCENGINE_mail_PROVIDER_METADATA',
  moduleSymbol: 'VOLCENGINE_mail_PROVIDER_MODULE',
  builtin: true,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reference-baseline',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'cloud-mix', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['volcengine.native-client'] as const),
});

export const ALIYUN_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'aliyun',
  pluginId: 'Mail-aliyun',
  driverId: 'sdkwork-mail-driver-aliyun',
  packageIdentity: '@sdkwork/Mail-sdk-provider-aliyun',
  manifestPath: 'providers/Mail-sdk-provider-aliyun/package.json',
  readmePath: 'providers/Mail-sdk-provider-aliyun/README.md',
  sourcePath: 'providers/Mail-sdk-provider-aliyun/index.js',
  declarationPath: 'providers/Mail-sdk-provider-aliyun/index.d.ts',
  sourceSymbol: 'ALIYUN_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createAliyunMailDriver',
  metadataSymbol: 'ALIYUN_mail_PROVIDER_METADATA',
  moduleSymbol: 'ALIYUN_mail_PROVIDER_MODULE',
  builtin: true,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'cloud-mix', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['aliyun.native-client'] as const),
});

export const TENCENT_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'tencent',
  pluginId: 'Mail-tencent',
  driverId: 'sdkwork-mail-driver-tencent',
  packageIdentity: '@sdkwork/Mail-sdk-provider-tencent',
  manifestPath: 'providers/Mail-sdk-provider-tencent/package.json',
  readmePath: 'providers/Mail-sdk-provider-tencent/README.md',
  sourcePath: 'providers/Mail-sdk-provider-tencent/index.js',
  declarationPath: 'providers/Mail-sdk-provider-tencent/index.d.ts',
  sourceSymbol: 'TENCENT_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createTencentMailDriver',
  metadataSymbol: 'TENCENT_mail_PROVIDER_METADATA',
  moduleSymbol: 'TENCENT_mail_PROVIDER_MODULE',
  builtin: true,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reference-baseline',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'cdn-relay', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['tencent.native-client'] as const),
});

export const AGORA_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'agora',
  pluginId: 'Mail-agora',
  driverId: 'sdkwork-mail-driver-agora',
  packageIdentity: '@sdkwork/Mail-sdk-provider-agora',
  manifestPath: 'providers/Mail-sdk-provider-agora/package.json',
  readmePath: 'providers/Mail-sdk-provider-agora/README.md',
  sourcePath: 'providers/Mail-sdk-provider-agora/index.js',
  declarationPath: 'providers/Mail-sdk-provider-agora/index.d.ts',
  sourceSymbol: 'AGORA_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createAgoraMailDriver',
  metadataSymbol: 'AGORA_mail_PROVIDER_METADATA',
  moduleSymbol: 'AGORA_mail_PROVIDER_MODULE',
  builtin: true,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'cloud-mix', 'data-channel', 'spatial-audio', 'e2ee', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['agora.native-client'] as const),
});

export const ZEGO_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'zego',
  pluginId: 'Mail-zego',
  driverId: 'sdkwork-mail-driver-zego',
  packageIdentity: '@sdkwork/Mail-sdk-provider-zego',
  manifestPath: 'providers/Mail-sdk-provider-zego/package.json',
  readmePath: 'providers/Mail-sdk-provider-zego/README.md',
  sourcePath: 'providers/Mail-sdk-provider-zego/index.js',
  declarationPath: 'providers/Mail-sdk-provider-zego/index.d.ts',
  sourceSymbol: 'ZEGO_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createZegoMailDriver',
  metadataSymbol: 'ZEGO_mail_PROVIDER_METADATA',
  moduleSymbol: 'ZEGO_mail_PROVIDER_MODULE',
  builtin: false,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'cloud-mix', 'beauty', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['zego.native-client'] as const),
});

export const LIVEKIT_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'livekit',
  pluginId: 'Mail-livekit',
  driverId: 'sdkwork-mail-driver-livekit',
  packageIdentity: '@sdkwork/Mail-sdk-provider-livekit',
  manifestPath: 'providers/Mail-sdk-provider-livekit/package.json',
  readmePath: 'providers/Mail-sdk-provider-livekit/README.md',
  sourcePath: 'providers/Mail-sdk-provider-livekit/index.js',
  declarationPath: 'providers/Mail-sdk-provider-livekit/index.d.ts',
  sourceSymbol: 'LIVEKIT_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createLivekitMailDriver',
  metadataSymbol: 'LIVEKIT_mail_PROVIDER_METADATA',
  moduleSymbol: 'LIVEKIT_mail_PROVIDER_MODULE',
  builtin: true,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'data-channel', 'transcription', 'e2ee', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['livekit.native-client'] as const),
});

export const TWILIO_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'twilio',
  pluginId: 'Mail-twilio',
  driverId: 'sdkwork-mail-driver-twilio',
  packageIdentity: '@sdkwork/Mail-sdk-provider-twilio',
  manifestPath: 'providers/Mail-sdk-provider-twilio/package.json',
  readmePath: 'providers/Mail-sdk-provider-twilio/README.md',
  sourcePath: 'providers/Mail-sdk-provider-twilio/index.js',
  declarationPath: 'providers/Mail-sdk-provider-twilio/index.d.ts',
  sourceSymbol: 'TWILIO_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createTwilioMailDriver',
  metadataSymbol: 'TWILIO_mail_PROVIDER_METADATA',
  moduleSymbol: 'TWILIO_mail_PROVIDER_MODULE',
  builtin: false,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'data-channel', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['twilio.native-client'] as const),
});

export const JITSI_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'jitsi',
  pluginId: 'Mail-jitsi',
  driverId: 'sdkwork-mail-driver-jitsi',
  packageIdentity: '@sdkwork/Mail-sdk-provider-jitsi',
  manifestPath: 'providers/Mail-sdk-provider-jitsi/package.json',
  readmePath: 'providers/Mail-sdk-provider-jitsi/README.md',
  sourcePath: 'providers/Mail-sdk-provider-jitsi/index.js',
  declarationPath: 'providers/Mail-sdk-provider-jitsi/index.d.ts',
  sourceSymbol: 'JITSI_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createJitsiMailDriver',
  metadataSymbol: 'JITSI_mail_PROVIDER_METADATA',
  moduleSymbol: 'JITSI_mail_PROVIDER_MODULE',
  builtin: false,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'transcription', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['jitsi.native-client'] as const),
});

export const JANUS_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'janus',
  pluginId: 'Mail-janus',
  driverId: 'sdkwork-mail-driver-janus',
  packageIdentity: '@sdkwork/Mail-sdk-provider-janus',
  manifestPath: 'providers/Mail-sdk-provider-janus/package.json',
  readmePath: 'providers/Mail-sdk-provider-janus/README.md',
  sourcePath: 'providers/Mail-sdk-provider-janus/index.js',
  declarationPath: 'providers/Mail-sdk-provider-janus/index.d.ts',
  sourceSymbol: 'JANUS_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createJanusMailDriver',
  metadataSymbol: 'JANUS_mail_PROVIDER_METADATA',
  moduleSymbol: 'JANUS_mail_PROVIDER_MODULE',
  builtin: false,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['data-channel', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['janus.native-client'] as const),
});

export const MEDIASOUP_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'mediasoup',
  pluginId: 'Mail-mediasoup',
  driverId: 'sdkwork-mail-driver-mediasoup',
  packageIdentity: '@sdkwork/Mail-sdk-provider-mediasoup',
  manifestPath: 'providers/Mail-sdk-provider-mediasoup/package.json',
  readmePath: 'providers/Mail-sdk-provider-mediasoup/README.md',
  sourcePath: 'providers/Mail-sdk-provider-mediasoup/index.js',
  declarationPath: 'providers/Mail-sdk-provider-mediasoup/index.d.ts',
  sourceSymbol: 'MEDIASOUP_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createMediasoupMailDriver',
  metadataSymbol: 'MEDIASOUP_mail_PROVIDER_METADATA',
  moduleSymbol: 'MEDIASOUP_mail_PROVIDER_MODULE',
  builtin: false,
  rootPublic: false,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience', 'provider.event-normalization'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['data-channel', 'provider.active-query'] as const),
  extensionKeys: freezeMailRuntimeValue(['mediasoup.native-client'] as const),
});

export const mail_PROVIDER_PACKAGE_CATALOG: readonly MailProviderPackageCatalogEntry[] = freezeMailRuntimeValue([
  VOLCENGINE_mail_PROVIDER_PACKAGE_ENTRY,
  ALIYUN_mail_PROVIDER_PACKAGE_ENTRY,
  TENCENT_mail_PROVIDER_PACKAGE_ENTRY,
  AGORA_mail_PROVIDER_PACKAGE_ENTRY,
  ZEGO_mail_PROVIDER_PACKAGE_ENTRY,
  LIVEKIT_mail_PROVIDER_PACKAGE_ENTRY,
  TWILIO_mail_PROVIDER_PACKAGE_ENTRY,
  JITSI_mail_PROVIDER_PACKAGE_ENTRY,
  JANUS_mail_PROVIDER_PACKAGE_ENTRY,
  MEDIASOUP_mail_PROVIDER_PACKAGE_ENTRY
]);

const mail_PROVIDER_PACKAGE_BY_PROVIDER_KEY = new Map<string, MailProviderPackageCatalogEntry>(
  mail_PROVIDER_PACKAGE_CATALOG.map((entry) => [entry.providerKey, entry]),
);

const mail_PROVIDER_PACKAGE_BY_PACKAGE_IDENTITY = new Map<string, MailProviderPackageCatalogEntry>(
  mail_PROVIDER_PACKAGE_CATALOG.map((entry) => [entry.packageIdentity, entry]),
);

export function getMailProviderPackageCatalog(): readonly MailProviderPackageCatalogEntry[] {
  return mail_PROVIDER_PACKAGE_CATALOG;
}

export function getMailProviderPackageByProviderKey(
  providerKey: string,
): MailProviderPackageCatalogEntry | undefined {
  return mail_PROVIDER_PACKAGE_BY_PROVIDER_KEY.get(providerKey);
}

export function getMailProviderPackageByPackageIdentity(
  packageIdentity: string,
): MailProviderPackageCatalogEntry | undefined {
  return mail_PROVIDER_PACKAGE_BY_PACKAGE_IDENTITY.get(packageIdentity);
}

export function getMailProviderPackage(
  providerKey: string,
): MailProviderPackageCatalogEntry | undefined {
  return getMailProviderPackageByProviderKey(providerKey);
}
