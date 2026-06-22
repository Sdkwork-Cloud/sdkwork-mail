import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderPackageCatalogEntry } from './types.js';

export const mail_PROVIDER_PACKAGE_STATUSES = freezeMailRuntimeValue(['package_reference_boundary'] as const);

export const SMTP_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'smtp',
  pluginId: 'Mail-smtp',
  driverId: 'sdkwork-mail-driver-smtp',
  packageIdentity: '@sdkwork/Mail-sdk-provider-smtp',
  manifestPath: 'providers/Mail-sdk-provider-smtp/package.json',
  readmePath: 'providers/Mail-sdk-provider-smtp/README.md',
  sourcePath: 'providers/Mail-sdk-provider-smtp/index.js',
  declarationPath: 'providers/Mail-sdk-provider-smtp/index.d.ts',
  sourceSymbol: 'SMTP_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createSmtpMailDriver',
  metadataSymbol: 'SMTP_mail_PROVIDER_METADATA',
  moduleSymbol: 'SMTP_mail_PROVIDER_MODULE',
  builtin: true,
  rootPublic: true,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['transport.connect', 'transport.authenticate', 'health'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['smtp.send', 'transport.retry', 'transport.pool'] as const),
  extensionKeys: freezeMailRuntimeValue(['smtp.transport'] as const),
});

export const IMAP_mail_PROVIDER_PACKAGE_ENTRY: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'imap',
  pluginId: 'Mail-imap',
  driverId: 'sdkwork-mail-driver-imap',
  packageIdentity: '@sdkwork/Mail-sdk-provider-imap',
  manifestPath: 'providers/Mail-sdk-provider-imap/package.json',
  readmePath: 'providers/Mail-sdk-provider-imap/README.md',
  sourcePath: 'providers/Mail-sdk-provider-imap/index.js',
  declarationPath: 'providers/Mail-sdk-provider-imap/index.d.ts',
  sourceSymbol: 'IMAP_mail_PROVIDER_MODULE',
  sourceModule: './index.js',
  driverFactory: 'createImapMailDriver',
  metadataSymbol: 'IMAP_mail_PROVIDER_METADATA',
  moduleSymbol: 'IMAP_mail_PROVIDER_MODULE',
  builtin: true,
  rootPublic: true,
  status: 'package_reference_boundary',
  runtimeBridgeStatus: 'reserved',
  requiredCapabilities: freezeMailRuntimeValue(['transport.connect', 'transport.authenticate', 'health'] as const),
  optionalCapabilities: freezeMailRuntimeValue(['imap.sync', 'imap.folder-sync', 'imap.message-sync'] as const),
  extensionKeys: freezeMailRuntimeValue(['imap.sync'] as const),
});

export const mail_PROVIDER_PACKAGE_CATALOG: readonly MailProviderPackageCatalogEntry[] = freezeMailRuntimeValue([
  SMTP_mail_PROVIDER_PACKAGE_ENTRY,
  IMAP_mail_PROVIDER_PACKAGE_ENTRY
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
