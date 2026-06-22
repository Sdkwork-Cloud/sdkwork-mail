import { freezeMailRuntimeValue } from './runtime-freeze.js';
import { REQUIRED_mail_CAPABILITIES } from './capability-catalog.js';
import type { MailProviderCatalogEntry } from './types.js';

export const DEFAULT_mail_PROVIDER_KEY = 'smtp';
export const DEFAULT_mail_PROVIDER_PLUGIN_ID = 'Mail-smtp';
export const DEFAULT_mail_PROVIDER_DRIVER_ID = 'sdkwork-mail-driver-smtp';
export const BUILTIN_mail_PROVIDER_KEYS = freezeMailRuntimeValue(['smtp', 'imap'] as const);
export const OFFICIAL_mail_PROVIDER_KEYS = freezeMailRuntimeValue(['smtp', 'imap'] as const);

export const SMTP_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'smtp',
  pluginId: 'Mail-smtp',
  driverId: 'sdkwork-mail-driver-smtp',
  displayName: 'SMTP Mail Transport',
  defaultSelected: true,
  urlSchemes: ['mail:smtp'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['smtp.send', 'transport.retry', 'transport.pool'] as const,
  extensionKeys: ['smtp.transport'] as const,
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
    packageName: '@sdkwork/Mail-sdk-provider-smtp',
    sourceModule: './index.js',
    driverFactory: 'createSmtpMailDriver',
    metadataSymbol: 'SMTP_mail_PROVIDER_METADATA',
    moduleSymbol: 'SMTP_mail_PROVIDER_MODULE',
    rootPublic: true,
  },
});

export const IMAP_mail_PROVIDER_CATALOG_ENTRY: MailProviderCatalogEntry = freezeMailRuntimeValue({
  providerKey: 'imap',
  pluginId: 'Mail-imap',
  driverId: 'sdkwork-mail-driver-imap',
  displayName: 'IMAP Mail Sync',
  defaultSelected: false,
  urlSchemes: ['mail:imap'] as const,
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ['imap.sync', 'imap.folder-sync', 'imap.message-sync'] as const,
  extensionKeys: ['imap.sync'] as const,
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
    packageName: '@sdkwork/Mail-sdk-provider-imap',
    sourceModule: './index.js',
    driverFactory: 'createImapMailDriver',
    metadataSymbol: 'IMAP_mail_PROVIDER_METADATA',
    moduleSymbol: 'IMAP_mail_PROVIDER_MODULE',
    rootPublic: true,
  },
});

export const BUILTIN_mail_PROVIDER_CATALOG: readonly MailProviderCatalogEntry[] = freezeMailRuntimeValue([
  SMTP_mail_PROVIDER_CATALOG_ENTRY,
  IMAP_mail_PROVIDER_CATALOG_ENTRY
]);

export const OFFICIAL_mail_PROVIDER_CATALOG: readonly MailProviderCatalogEntry[] = freezeMailRuntimeValue([
  SMTP_mail_PROVIDER_CATALOG_ENTRY,
  IMAP_mail_PROVIDER_CATALOG_ENTRY
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
