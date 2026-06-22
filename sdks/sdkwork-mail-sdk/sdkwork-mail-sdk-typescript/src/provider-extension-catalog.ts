import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderExtensionDescriptor } from './types.js';

export const mail_PROVIDER_EXTENSION_KEYS = freezeMailRuntimeValue(['volcengine.native-client', 'aliyun.native-client', 'tencent.native-client', 'agora.native-client', 'zego.native-client', 'livekit.native-client', 'twilio.native-client', 'jitsi.native-client', 'janus.native-client', 'mediasoup.native-client'] as const);
export type MailKnownProviderExtensionKey = (typeof mail_PROVIDER_EXTENSION_KEYS)[number];

export const VOLCENGINE_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'volcengine.native-client',
  providerKey: 'volcengine',
  displayName: 'Volcengine Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reference-baseline',
});

export const ALIYUN_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'aliyun.native-client',
  providerKey: 'aliyun',
  displayName: 'Aliyun Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const TENCENT_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'tencent.native-client',
  providerKey: 'tencent',
  displayName: 'Tencent Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reference-baseline',
});

export const AGORA_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'agora.native-client',
  providerKey: 'agora',
  displayName: 'Agora Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const ZEGO_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'zego.native-client',
  providerKey: 'zego',
  displayName: 'ZEGO Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const LIVEKIT_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'livekit.native-client',
  providerKey: 'livekit',
  displayName: 'LiveKit Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const TWILIO_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'twilio.native-client',
  providerKey: 'twilio',
  displayName: 'Twilio Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const JITSI_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'jitsi.native-client',
  providerKey: 'jitsi',
  displayName: 'Jitsi Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const JANUS_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'janus.native-client',
  providerKey: 'janus',
  displayName: 'Janus Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const MEDIASOUP_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'mediasoup.native-client',
  providerKey: 'mediasoup',
  displayName: 'mediasoup Native Client',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const mail_PROVIDER_EXTENSION_CATALOG: readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] = freezeMailRuntimeValue([
  VOLCENGINE_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  ALIYUN_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  TENCENT_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  AGORA_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  ZEGO_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  LIVEKIT_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  TWILIO_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  JITSI_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  JANUS_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  MEDIASOUP_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
]);

const mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY = new Map<
  string,
  MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>
>(mail_PROVIDER_EXTENSION_CATALOG.map((descriptor) => [descriptor.extensionKey, descriptor]));

const EMPTY_mail_PROVIDER_EXTENSIONS = freezeMailRuntimeValue([] as const);

const mail_PROVIDER_EXTENSIONS_BY_PROVIDER_KEY = new Map<
  string,
  readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[]
>([
  ['volcengine', freezeMailRuntimeValue([
    VOLCENGINE_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['aliyun', freezeMailRuntimeValue([
    ALIYUN_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['tencent', freezeMailRuntimeValue([
    TENCENT_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['agora', freezeMailRuntimeValue([
    AGORA_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['zego', freezeMailRuntimeValue([
    ZEGO_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['livekit', freezeMailRuntimeValue([
    LIVEKIT_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['twilio', freezeMailRuntimeValue([
    TWILIO_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['jitsi', freezeMailRuntimeValue([
    JITSI_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['janus', freezeMailRuntimeValue([
    JANUS_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['mediasoup', freezeMailRuntimeValue([
    MEDIASOUP_NATIVE_CLIENT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
]);

export function getMailProviderExtensionCatalog(): readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] {
  return mail_PROVIDER_EXTENSION_CATALOG;
}

export function getMailProviderExtensionDescriptor(
  extensionKey: string,
): MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> | undefined {
  return mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY.get(extensionKey);
}

export function getMailProviderExtensionsForProvider(
  providerKey: string,
): readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] {
  return mail_PROVIDER_EXTENSIONS_BY_PROVIDER_KEY.get(providerKey) ?? EMPTY_mail_PROVIDER_EXTENSIONS;
}

export function getMailProviderExtensions(
  extensionKeys: readonly string[],
): readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] {
  const descriptors: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] = [];

  for (const extensionKey of extensionKeys) {
    const descriptor = mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY.get(extensionKey);
    if (descriptor) {
      descriptors.push(descriptor);
    }
  }

  return freezeMailRuntimeValue(descriptors);
}

export function hasMailProviderExtension(
  extensionKeys: readonly string[],
  extensionKey: string,
): boolean {
  for (const providerExtensionKey of extensionKeys) {
    if (
      providerExtensionKey === extensionKey &&
      mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY.has(extensionKey)
    ) {
      return true;
    }
  }

  return false;
}
