import { mail_LOOKUP_HELPER_NAMING_PROFILES } from './Mail-standard-contract-constants.mjs';

export function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toGoExportedFieldToken(token) {
  if (!/^[a-z][A-Za-z0-9]*$/.test(token)) {
    return token;
  }

  return `${token.charAt(0).toUpperCase()}${token.slice(1)}`;
}

export function matchesReservedLanguageToken(language, content, token) {
  if (new RegExp(escapeRegExp(token)).test(content)) {
    return true;
  }

  if (language === 'go') {
    const goToken = toGoExportedFieldToken(token);
    if (goToken !== token && new RegExp(escapeRegExp(goToken)).test(content)) {
      return true;
    }
  }

  return false;
}

function getLookupHelperNamingProfile(language) {
  for (const [profileKey, profile] of Object.entries(mail_LOOKUP_HELPER_NAMING_PROFILES)) {
    if (profile.languages.includes(language)) {
      return profileKey;
    }
  }

  throw new Error(`Unsupported reserved language lookup helper profile: ${language}`);
}

function getLookupHelperNames(language) {
  return mail_LOOKUP_HELPER_NAMING_PROFILES[getLookupHelperNamingProfile(language)].helpers;
}

function buildHelperPattern(helperName) {
  return new RegExp(escapeRegExp(helperName));
}

export function getReservedLanguageLookupHelperPatterns(language) {
  const helperNames = getLookupHelperNames(language);

  switch (language) {
    case 'flutter':
      return {
        providerCatalog: [buildHelperPattern(helperNames.providerCatalogByProviderKey)],
        providerPackageCatalog: [
          buildHelperPattern(helperNames.providerPackageByProviderKey),
          buildHelperPattern(helperNames.providerPackageByPackageIdentity),
        ],
        providerActivationCatalog: [
          buildHelperPattern(helperNames.providerActivationByProviderKey),
        ],
        capabilityCatalog: [
          buildHelperPattern(helperNames.capabilityCatalog),
          buildHelperPattern(helperNames.capabilityDescriptorByCapabilityKey),
        ],
        providerExtensionCatalog: [
          buildHelperPattern(helperNames.providerExtensionCatalog),
          buildHelperPattern(helperNames.providerExtensionDescriptorByExtensionKey),
          buildHelperPattern(helperNames.providerExtensionsForProvider),
          buildHelperPattern(helperNames.providerExtensionsByExtensionKeys),
          buildHelperPattern(helperNames.providerExtensionMembership),
        ],
        languageWorkspaceCatalog: [buildHelperPattern(helperNames.languageWorkspaceByLanguage)],
        providerSelection: [
          /MailProviderSelectionSources/,
          /MailProviderSelectionPrecedence/,
          /ParsedMailProviderUrl/,
          buildHelperPattern(helperNames.providerUrlParser),
          buildHelperPattern(helperNames.providerSelectionResolver),
        ],
        providerSupport: [
          /MailProviderSupportStatuses/,
          /MailProviderSupportStateRequest/,
          buildHelperPattern(helperNames.providerSupportStatusResolver),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
        providerPackageLoader: [
          /MailProviderPackageLoadRequest/,
          /MailResolvedProviderPackageLoadTarget/,
          /MailProviderPackageLoader/,
          buildHelperPattern(helperNames.providerPackageLoaderFactory),
          buildHelperPattern(helperNames.providerPackageLoadTargetResolver),
          buildHelperPattern(helperNames.providerModuleLoader),
          buildHelperPattern(helperNames.singleProviderPackageInstaller),
          buildHelperPattern(helperNames.batchProviderPackageInstaller),
          /provider_package_not_found/,
          /provider_package_identity_mismatch/,
          /provider_package_load_failed/,
          /provider_module_export_missing/,
        ],
        driverManagerDelegates: [
          buildHelperPattern(helperNames.providerSelectionResolver),
          buildHelperPattern(helperNames.providerCatalogByProviderKey),
          buildHelperPattern(helperNames.providerActivationByProviderKey),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
      };
    case 'rust':
      return {
        providerCatalog: [buildHelperPattern(helperNames.providerCatalogByProviderKey)],
        providerPackageCatalog: [
          buildHelperPattern(helperNames.providerPackageByProviderKey),
          buildHelperPattern(helperNames.providerPackageByPackageIdentity),
        ],
        providerActivationCatalog: [
          buildHelperPattern(helperNames.providerActivationByProviderKey),
        ],
        capabilityCatalog: [
          buildHelperPattern(helperNames.capabilityCatalog),
          buildHelperPattern(helperNames.capabilityDescriptorByCapabilityKey),
        ],
        providerExtensionCatalog: [
          buildHelperPattern(helperNames.providerExtensionCatalog),
          buildHelperPattern(helperNames.providerExtensionDescriptorByExtensionKey),
          buildHelperPattern(helperNames.providerExtensionsForProvider),
          buildHelperPattern(helperNames.providerExtensionsByExtensionKeys),
          buildHelperPattern(helperNames.providerExtensionMembership),
        ],
        languageWorkspaceCatalog: [buildHelperPattern(helperNames.languageWorkspaceByLanguage)],
        providerSelection: [
          /mail_PROVIDER_SELECTION_SOURCES/,
          /mail_PROVIDER_SELECTION_PRECEDENCE/,
          /ParsedMailProviderUrl/,
          buildHelperPattern(helperNames.providerUrlParser),
          buildHelperPattern(helperNames.providerSelectionResolver),
        ],
        providerSupport: [
          /mail_PROVIDER_SUPPORT_STATUSES/,
          /MailProviderSupportStateRequest/,
          buildHelperPattern(helperNames.providerSupportStatusResolver),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
        providerPackageLoader: [
          /MailProviderPackageLoadRequest/,
          /MailResolvedProviderPackageLoadTarget/,
          /MailProviderPackageLoader/,
          buildHelperPattern(helperNames.providerPackageLoaderFactory),
          buildHelperPattern(helperNames.providerPackageLoadTargetResolver),
          buildHelperPattern(helperNames.providerModuleLoader),
          buildHelperPattern(helperNames.singleProviderPackageInstaller),
          buildHelperPattern(helperNames.batchProviderPackageInstaller),
          /provider_package_not_found/,
          /provider_package_identity_mismatch/,
          /provider_package_load_failed/,
          /provider_module_export_missing/,
        ],
        driverManagerDelegates: [
          buildHelperPattern(helperNames.providerSelectionResolver),
          buildHelperPattern(helperNames.providerCatalogByProviderKey),
          buildHelperPattern(helperNames.providerActivationByProviderKey),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
      };
    case 'java':
    case 'swift':
    case 'kotlin':
      return {
        providerCatalog: [buildHelperPattern(helperNames.providerCatalogByProviderKey)],
        providerPackageCatalog: [
          buildHelperPattern(helperNames.providerPackageByProviderKey),
          buildHelperPattern(helperNames.providerPackageByPackageIdentity),
        ],
        providerActivationCatalog: [
          buildHelperPattern(helperNames.providerActivationByProviderKey),
        ],
        capabilityCatalog: [
          buildHelperPattern(helperNames.capabilityCatalog),
          buildHelperPattern(helperNames.capabilityDescriptorByCapabilityKey),
        ],
        providerExtensionCatalog: [
          buildHelperPattern(helperNames.providerExtensionCatalog),
          buildHelperPattern(helperNames.providerExtensionDescriptorByExtensionKey),
          buildHelperPattern(helperNames.providerExtensionsForProvider),
          buildHelperPattern(helperNames.providerExtensionsByExtensionKeys),
          buildHelperPattern(helperNames.providerExtensionMembership),
        ],
        languageWorkspaceCatalog: [buildHelperPattern(helperNames.languageWorkspaceByLanguage)],
        providerSelection: [
          /mail_PROVIDER_SELECTION_SOURCES|MailProviderSelectionSources/,
          /mail_PROVIDER_SELECTION_PRECEDENCE|MailProviderSelectionPrecedence/,
          /ParsedMailProviderUrl/,
          buildHelperPattern(helperNames.providerUrlParser),
          buildHelperPattern(helperNames.providerSelectionResolver),
        ],
        providerSupport: [
          /mail_PROVIDER_SUPPORT_STATUSES|MailProviderSupportStatuses/,
          /MailProviderSupportStateRequest/,
          buildHelperPattern(helperNames.providerSupportStatusResolver),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
        providerPackageLoader: [
          /MailProviderPackageLoadRequest/,
          /MailResolvedProviderPackageLoadTarget/,
          /MailProviderPackageLoader/,
          buildHelperPattern(helperNames.providerPackageLoaderFactory),
          buildHelperPattern(helperNames.providerPackageLoadTargetResolver),
          buildHelperPattern(helperNames.providerModuleLoader),
          buildHelperPattern(helperNames.singleProviderPackageInstaller),
          buildHelperPattern(helperNames.batchProviderPackageInstaller),
          /provider_package_not_found/,
          /provider_package_identity_mismatch/,
          /provider_package_load_failed/,
          /provider_module_export_missing/,
        ],
        driverManagerDelegates: [
          buildHelperPattern(helperNames.providerSelectionResolver),
          buildHelperPattern(helperNames.providerCatalogByProviderKey),
          buildHelperPattern(helperNames.providerActivationByProviderKey),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
      };
    case 'csharp':
    case 'go':
      return {
        providerCatalog: [buildHelperPattern(helperNames.providerCatalogByProviderKey)],
        providerPackageCatalog: [
          buildHelperPattern(helperNames.providerPackageByProviderKey),
          buildHelperPattern(helperNames.providerPackageByPackageIdentity),
        ],
        providerActivationCatalog: [
          buildHelperPattern(helperNames.providerActivationByProviderKey),
        ],
        capabilityCatalog: [
          buildHelperPattern(helperNames.capabilityCatalog),
          buildHelperPattern(helperNames.capabilityDescriptorByCapabilityKey),
        ],
        providerExtensionCatalog: [
          buildHelperPattern(helperNames.providerExtensionCatalog),
          buildHelperPattern(helperNames.providerExtensionDescriptorByExtensionKey),
          buildHelperPattern(helperNames.providerExtensionsForProvider),
          buildHelperPattern(helperNames.providerExtensionsByExtensionKeys),
          buildHelperPattern(helperNames.providerExtensionMembership),
        ],
        languageWorkspaceCatalog: [buildHelperPattern(helperNames.languageWorkspaceByLanguage)],
        providerSelection: [
          /MailProviderSelectionSources/,
          /MailProviderSelectionPrecedence/,
          /ParsedMailProviderUrl/,
          buildHelperPattern(helperNames.providerUrlParser),
          buildHelperPattern(helperNames.providerSelectionResolver),
        ],
        providerSupport: [
          /MailProviderSupportStatuses/,
          /MailProviderSupportStateRequest/,
          buildHelperPattern(helperNames.providerSupportStatusResolver),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
        providerPackageLoader: [
          /MailProviderPackageLoadRequest/,
          /MailResolvedProviderPackageLoadTarget/,
          /MailProviderPackageLoader/,
          buildHelperPattern(helperNames.providerPackageLoaderFactory),
          buildHelperPattern(helperNames.providerPackageLoadTargetResolver),
          buildHelperPattern(helperNames.providerModuleLoader),
          buildHelperPattern(helperNames.singleProviderPackageInstaller),
          buildHelperPattern(helperNames.batchProviderPackageInstaller),
          /provider_package_not_found/,
          /provider_package_identity_mismatch/,
          /provider_package_load_failed/,
          /provider_module_export_missing/,
        ],
        driverManagerDelegates: [
          buildHelperPattern(helperNames.providerSelectionResolver),
          buildHelperPattern(helperNames.providerCatalogByProviderKey),
          buildHelperPattern(helperNames.providerActivationByProviderKey),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
      };
    case 'python':
      return {
        providerCatalog: [buildHelperPattern(helperNames.providerCatalogByProviderKey)],
        providerPackageCatalog: [
          buildHelperPattern(helperNames.providerPackageByProviderKey),
          buildHelperPattern(helperNames.providerPackageByPackageIdentity),
        ],
        providerActivationCatalog: [
          buildHelperPattern(helperNames.providerActivationByProviderKey),
        ],
        capabilityCatalog: [
          buildHelperPattern(helperNames.capabilityCatalog),
          buildHelperPattern(helperNames.capabilityDescriptorByCapabilityKey),
        ],
        providerExtensionCatalog: [
          buildHelperPattern(helperNames.providerExtensionCatalog),
          buildHelperPattern(helperNames.providerExtensionDescriptorByExtensionKey),
          buildHelperPattern(helperNames.providerExtensionsForProvider),
          buildHelperPattern(helperNames.providerExtensionsByExtensionKeys),
          buildHelperPattern(helperNames.providerExtensionMembership),
        ],
        languageWorkspaceCatalog: [buildHelperPattern(helperNames.languageWorkspaceByLanguage)],
        providerSelection: [
          /mail_PROVIDER_SELECTION_SOURCES/,
          /mail_PROVIDER_SELECTION_PRECEDENCE/,
          /ParsedMailProviderUrl/,
          buildHelperPattern(helperNames.providerUrlParser),
          buildHelperPattern(helperNames.providerSelectionResolver),
        ],
        providerSupport: [
          /mail_PROVIDER_SUPPORT_STATUSES/,
          /MailProviderSupportStateRequest/,
          buildHelperPattern(helperNames.providerSupportStatusResolver),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
        providerPackageLoader: [
          /MailProviderPackageLoadRequest/,
          /MailResolvedProviderPackageLoadTarget/,
          /MailProviderPackageLoader/,
          buildHelperPattern(helperNames.providerPackageLoaderFactory),
          buildHelperPattern(helperNames.providerPackageLoadTargetResolver),
          buildHelperPattern(helperNames.providerModuleLoader),
          buildHelperPattern(helperNames.singleProviderPackageInstaller),
          buildHelperPattern(helperNames.batchProviderPackageInstaller),
          /provider_package_not_found/,
          /provider_package_identity_mismatch/,
          /provider_package_load_failed/,
          /provider_module_export_missing/,
        ],
        driverManagerDelegates: [
          buildHelperPattern(helperNames.providerSelectionResolver),
          buildHelperPattern(helperNames.providerCatalogByProviderKey),
          buildHelperPattern(helperNames.providerActivationByProviderKey),
          buildHelperPattern(helperNames.providerSupportStateFactory),
        ],
      };
    default:
      throw new Error(`Unsupported reserved language lookup helper contract: ${language}`);
  }
}

export function getReservedLanguageRootPublicContract(languageEntry) {
  switch (languageEntry.language) {
    case 'flutter':
      return {
        relativePath: 'lib/mail_sdk.dart',
        patterns: [
          /library mail_sdk;/,
          /export 'src\/mail_standard_contract\.dart';/,
          /export 'src\/mail_errors\.dart';/,
          /export 'src\/mail_types\.dart';/,
          /export 'src\/mail_provider_metadata\.dart';/,
          /export 'src\/mail_client\.dart';/,
          /export 'src\/mail_driver\.dart';/,
          /export 'src\/mail_runtime_surface\.dart';/,
          /export 'src\/mail_runtime_immutability\.dart';/,
          /export 'src\/mail_provider_catalog\.dart';/,
          /export 'src\/mail_provider_package_catalog\.dart';/,
          /export 'src\/mail_provider_activation_catalog\.dart';/,
          /export 'src\/mail_capability_catalog\.dart';/,
          /export 'src\/mail_provider_extension_catalog\.dart';/,
          /export 'src\/mail_language_workspace_catalog\.dart';/,
          /export 'src\/mail_provider_selection\.dart';/,
          /export 'src\/mail_provider_package_loader\.dart';/,
          /export 'src\/mail_provider_support\.dart';/,
          /export 'src\/mail_driver_manager\.dart';/,
          /export 'src\/mail_data_source\.dart';/,
        ],
      };
    case 'python':
      return {
        relativePath: 'sdkwork_mail_sdk/__init__.py',
        patterns: [
          /from \.provider_catalog import \(/,
          /from \.provider_package_catalog import \(/,
          /from \.provider_activation_catalog import \(/,
          /from \.language_workspace_catalog import \(/,
          /from \.provider_selection import \(/,
          /from \.provider_package_loader import \(/,
          /from \.provider_support import \(/,
          /ParsedMailProviderUrl/,
          /mail_PROVIDER_SELECTION_SOURCES/,
          /mail_PROVIDER_SUPPORT_STATUSES/,
          /create_mail_provider_package_loader/,
          /resolve_mail_provider_package_load_target/,
          /get_mail_provider_extensions_for_provider/,
          /get_mail_language_workspace_by_language/,
          /__all__ = \[/,
        ],
      };
    default:
      return null;
  }
}

export function getGoPublicStructFieldContracts(languageEntry) {
  if (languageEntry.language !== 'go') {
    return [];
  }

  return [
    {
      relativePath: languageEntry.metadataScaffold.providerCatalogRelativePath,
      patterns: [/ProviderKey\s+string/, /PluginId\s+string/, /DriverId\s+string/, /DefaultSelected\s+bool/],
    },
    {
      relativePath: languageEntry.metadataScaffold.providerPackageCatalogRelativePath,
      patterns: [
        /ProviderKey\s+string/,
        /PackageIdentity\s+string/,
        /RootPublic\s+bool/,
        /RuntimeBridgeStatus\s+string/,
      ],
    },
    {
      relativePath: languageEntry.metadataScaffold.capabilityCatalogRelativePath,
      patterns: [/CapabilityKey\s+string/, /Category\s+string/, /Surface\s+string/],
    },
    {
      relativePath: languageEntry.metadataScaffold.providerExtensionCatalogRelativePath,
      patterns: [/ExtensionKey\s+string/, /ProviderKey\s+string/, /DisplayName\s+string/],
    },
    {
      relativePath: languageEntry.metadataScaffold.providerSelectionRelativePath,
      patterns: [
        /ProviderUrl\s+string/,
        /ProviderKey\s+string/,
        /TenantOverrideProviderKey\s+string/,
        /DeploymentProfileProviderKey\s+string/,
      ],
    },
    {
      relativePath: languageEntry.resolutionScaffold.providerSupportRelativePath,
      patterns: [
        /ProviderKey\s+string/,
        /Status\s+string/,
        /Builtin\s+bool/,
        /Official\s+bool/,
        /Registered\s+bool/,
      ],
    },
    {
      relativePath: languageEntry.metadataScaffold.providerActivationCatalogRelativePath,
      patterns: [
        /ProviderKey\s+string/,
        /ActivationStatus\s+string/,
        /RuntimeBridge\s+bool/,
        /PackageIdentity\s+string/,
      ],
    },
    {
      relativePath: languageEntry.workspaceCatalogRelativePath,
      patterns: [
        /Language\s+string/,
        /PublicPackage\s+string/,
        /RoleHighlights\s+\[\]string/,
        /ProviderSelectionContract\s+MailLanguageWorkspaceProviderSelectionContract/,
        /ProviderSuppoMailontract\s+MailLanguageWorkspaceProviderSuppoMailontract/,
        /ProviderActivationContract\s+MailLanguageWorkspaceProviderActivationContract/,
        /ProviderPackageBoundaryContract\s+MailLanguageWorkspaceProviderPackageBoundaryContract/,
      ],
    },
    {
      relativePath: languageEntry.resolutionScaffold.dataSourceRelativePath,
      patterns: [
        /ProviderUrl\s+string/,
        /DefaultProviderKey\s+string/,
        /selection\.ProviderKey/,
      ],
    },
  ];
}
