import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailCapabilityDescriptor } from './types.js';

export const REQUIRED_mail_CAPABILITIES = freezeMailRuntimeValue(['transport.connect', 'transport.authenticate', 'health'] as const);
export const OPTIONAL_mail_CAPABILITIES = freezeMailRuntimeValue(['smtp.send', 'imap.sync', 'imap.folder-sync', 'imap.message-sync', 'transport.retry', 'transport.pool'] as const);

export type MailRequiredCapability = (typeof REQUIRED_mail_CAPABILITIES)[number];
export type MailOptionalCapability = (typeof OPTIONAL_mail_CAPABILITIES)[number];
export type MailCapabilityKey = MailRequiredCapability | MailOptionalCapability;

export const TRANSPORT_CONNECT_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'transport.connect',
  category: 'required-baseline',
  surface: 'control-plane',
});

export const TRANSPORT_AUTHENTICATE_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'transport.authenticate',
  category: 'required-baseline',
  surface: 'control-plane',
});

export const HEALTH_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'health',
  category: 'required-baseline',
  surface: 'control-plane',
});

export const SMTP_SEND_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'smtp.send',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const IMAP_SYNC_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'imap.sync',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const IMAP_FOLDER_SYNC_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'imap.folder-sync',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const IMAP_MESSAGE_SYNC_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'imap.message-sync',
  category: 'optional-advanced',
  surface: 'runtime-bridge',
});

export const TRANSPORT_RETRY_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'transport.retry',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const TRANSPORT_POOL_mail_CAPABILITY_DESCRIPTOR: MailCapabilityDescriptor<MailCapabilityKey> = freezeMailRuntimeValue({
  capabilityKey: 'transport.pool',
  category: 'optional-advanced',
  surface: 'control-plane',
});

export const mail_CAPABILITY_CATALOG: readonly MailCapabilityDescriptor<MailCapabilityKey>[] = freezeMailRuntimeValue([
  TRANSPORT_CONNECT_mail_CAPABILITY_DESCRIPTOR,
  TRANSPORT_AUTHENTICATE_mail_CAPABILITY_DESCRIPTOR,
  HEALTH_mail_CAPABILITY_DESCRIPTOR,
  SMTP_SEND_mail_CAPABILITY_DESCRIPTOR,
  IMAP_SYNC_mail_CAPABILITY_DESCRIPTOR,
  IMAP_FOLDER_SYNC_mail_CAPABILITY_DESCRIPTOR,
  IMAP_MESSAGE_SYNC_mail_CAPABILITY_DESCRIPTOR,
  TRANSPORT_RETRY_mail_CAPABILITY_DESCRIPTOR,
  TRANSPORT_POOL_mail_CAPABILITY_DESCRIPTOR
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
