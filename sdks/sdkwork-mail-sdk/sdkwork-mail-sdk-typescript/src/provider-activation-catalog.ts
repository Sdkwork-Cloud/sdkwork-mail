import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderActivationEntry } from './types.js';

export const mail_PROVIDER_ACTIVATION_STATUSES = freezeMailRuntimeValue(['package-boundary', 'control-metadata-only'] as const);

export const VOLCENGINE_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'volcengine',
  pluginId: 'Mail-volcengine',
  driverId: 'sdkwork-mail-driver-volcengine',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: true,
  packageIdentity: '@sdkwork/Mail-sdk-provider-volcengine',
});

export const ALIYUN_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'aliyun',
  pluginId: 'Mail-aliyun',
  driverId: 'sdkwork-mail-driver-aliyun',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: true,
  packageIdentity: '@sdkwork/Mail-sdk-provider-aliyun',
});

export const TENCENT_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'tencent',
  pluginId: 'Mail-tencent',
  driverId: 'sdkwork-mail-driver-tencent',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: true,
  packageIdentity: '@sdkwork/Mail-sdk-provider-tencent',
});

export const AGORA_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'agora',
  pluginId: 'Mail-agora',
  driverId: 'sdkwork-mail-driver-agora',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: true,
  packageIdentity: '@sdkwork/Mail-sdk-provider-agora',
});

export const ZEGO_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'zego',
  pluginId: 'Mail-zego',
  driverId: 'sdkwork-mail-driver-zego',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: false,
  packageIdentity: '@sdkwork/Mail-sdk-provider-zego',
});

export const LIVEKIT_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'livekit',
  pluginId: 'Mail-livekit',
  driverId: 'sdkwork-mail-driver-livekit',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: true,
  packageIdentity: '@sdkwork/Mail-sdk-provider-livekit',
});

export const TWILIO_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'twilio',
  pluginId: 'Mail-twilio',
  driverId: 'sdkwork-mail-driver-twilio',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: false,
  packageIdentity: '@sdkwork/Mail-sdk-provider-twilio',
});

export const JITSI_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'jitsi',
  pluginId: 'Mail-jitsi',
  driverId: 'sdkwork-mail-driver-jitsi',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: false,
  packageIdentity: '@sdkwork/Mail-sdk-provider-jitsi',
});

export const JANUS_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'janus',
  pluginId: 'Mail-janus',
  driverId: 'sdkwork-mail-driver-janus',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: false,
  packageIdentity: '@sdkwork/Mail-sdk-provider-janus',
});

export const MEDIASOUP_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'mediasoup',
  pluginId: 'Mail-mediasoup',
  driverId: 'sdkwork-mail-driver-mediasoup',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: false,
  packageIdentity: '@sdkwork/Mail-sdk-provider-mediasoup',
});

export const mail_PROVIDER_ACTIVATION_CATALOG: readonly MailProviderActivationEntry[] = freezeMailRuntimeValue([
  VOLCENGINE_mail_PROVIDER_ACTIVATION_ENTRY,
  ALIYUN_mail_PROVIDER_ACTIVATION_ENTRY,
  TENCENT_mail_PROVIDER_ACTIVATION_ENTRY,
  AGORA_mail_PROVIDER_ACTIVATION_ENTRY,
  ZEGO_mail_PROVIDER_ACTIVATION_ENTRY,
  LIVEKIT_mail_PROVIDER_ACTIVATION_ENTRY,
  TWILIO_mail_PROVIDER_ACTIVATION_ENTRY,
  JITSI_mail_PROVIDER_ACTIVATION_ENTRY,
  JANUS_mail_PROVIDER_ACTIVATION_ENTRY,
  MEDIASOUP_mail_PROVIDER_ACTIVATION_ENTRY
]);

const mail_PROVIDER_ACTIVATION_BY_PROVIDER_KEY = new Map<
  string,
  MailProviderActivationEntry
>(mail_PROVIDER_ACTIVATION_CATALOG.map((entry) => [entry.providerKey, entry]));

export function getMailProviderActivationCatalog(): readonly MailProviderActivationEntry[] {
  return mail_PROVIDER_ACTIVATION_CATALOG;
}

export function getMailProviderActivationByProviderKey(
  providerKey: string,
): MailProviderActivationEntry | undefined {
  return mail_PROVIDER_ACTIVATION_BY_PROVIDER_KEY.get(providerKey);
}

export function getMailProviderActivation(
  providerKey: string,
): MailProviderActivationEntry | undefined {
  return getMailProviderActivationByProviderKey(providerKey);
}
