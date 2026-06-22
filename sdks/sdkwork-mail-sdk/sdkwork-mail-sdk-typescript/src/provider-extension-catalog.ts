import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderExtensionDescriptor } from './types.js';

export const mail_PROVIDER_EXTENSION_KEYS = freezeMailRuntimeValue(['smtp.transport', 'imap.sync'] as const);
export type MailKnownProviderExtensionKey = (typeof mail_PROVIDER_EXTENSION_KEYS)[number];

export const SMTP_TRANSPORT_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'smtp.transport',
  providerKey: 'smtp',
  displayName: 'SMTP Transport',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const IMAP_SYNC_mail_PROVIDER_EXTENSION_DESCRIPTOR: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = freezeMailRuntimeValue({
  extensionKey: 'imap.sync',
  providerKey: 'imap',
  displayName: 'IMAP Sync',
  surface: 'runtime-bridge',
  access: 'unwrap-only',
  status: 'reserved',
});

export const mail_PROVIDER_EXTENSION_CATALOG: readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] = freezeMailRuntimeValue([
  SMTP_TRANSPORT_mail_PROVIDER_EXTENSION_DESCRIPTOR,
  IMAP_SYNC_mail_PROVIDER_EXTENSION_DESCRIPTOR
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
  ['smtp', freezeMailRuntimeValue([
    SMTP_TRANSPORT_mail_PROVIDER_EXTENSION_DESCRIPTOR
  ])],
  ['imap', freezeMailRuntimeValue([
    IMAP_SYNC_mail_PROVIDER_EXTENSION_DESCRIPTOR
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
