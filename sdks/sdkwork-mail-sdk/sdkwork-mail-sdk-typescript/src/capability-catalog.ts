import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailCapabilityDescriptor } from './types.js';

export const REQUIRED_mail_CAPABILITIES = freezeMailRuntimeValue(['session', 'credential', 'provider.webhook', 'provider.event-normalization', 'health', 'media.audio', 'media.video', 'live.broadcast', 'live.audience'] as const);
export const OPTIONAL_mail_CAPABILITIES = freezeMailRuntimeValue(['screen-share', 'recording', 'artifact', 'cloud-mix', 'cdn-relay', 'data-channel', 'transcription', 'beauty', 'spatial-audio', 'e2ee', 'provider.active-query'] as const);

export type MailRequiredCapability = (typeof REQUIRED_mail_CAPABILITIES)[number];
export type MailOptionalCapability = (typeof OPTIONAL_mail_CAPABILITIES)[number];
export type MailCapabilityKey = MailRequiredCapability | MailOptionalCapability;

export const SESSION_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'session',
  category: 'required-baseline',
  surface: 'cross-surface',
});

export const CREDENTIAL_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'credential',
  category: 'required-baseline',
  surface: 'control-plane',
});

export const PROVIDER_WEBHOOK_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'provider.webhook',
  category: 'required-baseline',
  surface: 'control-plane',
});

export const PROVIDER_EVENT_NORMALIZATION_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'provider.event-normalization',
  category: 'required-baseline',
  surface: 'control-plane',
});

export const HEALTH_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'health',
  category: 'required-baseline',
  surface: 'control-plane',
});

export const MEDIA_AUDIO_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'media.audio',
  category: 'required-baseline',
  surface: 'runtime-bridge',
});

export const MEDIA_VIDEO_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'media.video',
  category: 'required-baseline',
  surface: 'runtime-bridge',
});

export const LIVE_BROADCAST_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'live.broadcast',
  category: 'required-baseline',
  surface: 'cross-surface',
});

export const LIVE_AUDIENCE_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'live.audience',
  category: 'required-baseline',
  surface: 'cross-surface',
});

export const SCREEN_SHARE_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'screen-share',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const RECORDING_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'recording',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const ARTIFACT_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'artifact',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const CLOUD_MIX_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'cloud-mix',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const CDN_RELAY_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'cdn-relay',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const DATA_CHANNEL_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'data-channel',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const TRANSCRIPTION_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'transcription',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const BEAUTY_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'beauty',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const SPATIAL_AUDIO_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'spatial-audio',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const E2EE_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'e2ee',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const PROVIDER_ACTIVE_QUERY_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'provider.active-query',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const mail_CAPABILITY_CATALOG: readonly MailCapabilityDescriptor<MailCapabilityKey>[] = freezeMailRuntimeValue([
  SESSION_mail_CAPABILITY_DESCRIPTOR,
  CREDENTIAL_mail_CAPABILITY_DESCRIPTOR,
  PROVIDER_WEBHOOK_mail_CAPABILITY_DESCRIPTOR,
  PROVIDER_EVENT_NORMALIZATION_mail_CAPABILITY_DESCRIPTOR,
  HEALTH_mail_CAPABILITY_DESCRIPTOR,
  MEDIA_AUDIO_mail_CAPABILITY_DESCRIPTOR,
  MEDIA_VIDEO_mail_CAPABILITY_DESCRIPTOR,
  LIVE_BROADCAST_mail_CAPABILITY_DESCRIPTOR,
  LIVE_AUDIENCE_mail_CAPABILITY_DESCRIPTOR,
  SCREEN_SHARE_mail_CAPABILITY_DESCRIPTOR,
  RECORDING_mail_CAPABILITY_DESCRIPTOR,
  ARTIFACT_mail_CAPABILITY_DESCRIPTOR,
  CLOUD_MIX_mail_CAPABILITY_DESCRIPTOR,
  CDN_RELAY_mail_CAPABILITY_DESCRIPTOR,
  DATA_CHANNEL_mail_CAPABILITY_DESCRIPTOR,
  TRANSCRIPTION_mail_CAPABILITY_DESCRIPTOR,
  BEAUTY_mail_CAPABILITY_DESCRIPTOR,
  SPATIAL_AUDIO_mail_CAPABILITY_DESCRIPTOR,
  E2EE_mail_CAPABILITY_DESCRIPTOR,
  PROVIDER_ACTIVE_QUERY_mail_CAPABILITY_DESCRIPTOR
]);

const mail_CAPABILITY_DESCRIPTOR_BY_KEY = new Map<
  MailCapabilityKey,
  MailCapabilityDescriptor<MailCapabilityKey>
>(mail_CAPABILITY_CATALOG.map((descriptor) => [descriptor.capabilityKey, descriptor]));

export function getMailCapabilityCatalog(): readonly MailCapabilityDescriptor<MailCapabilityKey>[] {
  return mail_CAPABILITY_CATALOG;
}

export function getMailCapabilityDescriptor(
  capabilityKey: MailCapabilityKey,
): MailCapabilityDescriptor<MailCapabilityKey> | undefined {
  return mail_CAPABILITY_DESCRIPTOR_BY_KEY.get(capabilityKey);
}
