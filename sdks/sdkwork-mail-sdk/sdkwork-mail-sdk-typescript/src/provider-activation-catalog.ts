import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderActivationEntry } from './types.js';

export const mail_PROVIDER_ACTIVATION_STATUSES = freezeMailRuntimeValue(['package-boundary', 'control-metadata-only'] as const);

export const SMTP_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'smtp',
  pluginId: 'Mail-smtp',
  driverId: 'sdkwork-mail-driver-smtp',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: true,
  packageIdentity: '@sdkwork/Mail-sdk-provider-smtp',
});

export const IMAP_mail_PROVIDER_ACTIVATION_ENTRY: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: 'imap',
  pluginId: 'Mail-imap',
  driverId: 'sdkwork-mail-driver-imap',
  activationStatus: 'package-boundary',
  runtimeBridge: true,
  rootPublic: false,
  packageBoundary: true,
  builtin: true,
  packageIdentity: '@sdkwork/Mail-sdk-provider-imap',
});

export const mail_PROVIDER_ACTIVATION_CATALOG: readonly MailProviderActivationEntry[] = freezeMailRuntimeValue([
  SMTP_mail_PROVIDER_ACTIVATION_ENTRY,
  IMAP_mail_PROVIDER_ACTIVATION_ENTRY
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
