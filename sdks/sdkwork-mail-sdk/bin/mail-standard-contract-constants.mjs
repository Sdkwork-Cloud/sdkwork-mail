export const mail_PROVIDER_SELECTION_SOURCES = Object.freeze([
  'provider_url',
  'provider_key',
  'tenant_override',
  'deployment_profile',
  'default_provider',
]);

export const mail_PROVIDER_SELECTION_PRECEDENCE = mail_PROVIDER_SELECTION_SOURCES;

export const DEFAULT_mail_PROVIDER_KEY = 'smtp';

export const BUILTIN_mail_PROVIDER_KEYS = Object.freeze(['smtp', 'imap']);

export const OFFICIAL_mail_LANGUAGE_WORKSPACE_KEYS = Object.freeze([
  'typescript',
  'flutter',
  'rust',
  'java',
  'csharp',
  'swift',
  'kotlin',
  'go',
  'python',
]);

export const mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS = Object.freeze([
  'default',
]);

export const mail_PROVIDER_SUPPORT_STATUSES = Object.freeze([
  'builtin_registered',
  'official_registered',
  'official_unregistered',
  'unknown',
]);

export const mail_PROVIDER_ACTIVATION_STATUSES = Object.freeze([
  'package-boundary',
  'control-metadata-only',
]);

export const mail_PROVIDER_TIERS = Object.freeze([
  'tier-a',
  'tier-b',
  'tier-c',
]);

export const mail_PROVIDER_TIER_SUMMARIES = Object.freeze({
  'tier-a': 'Built-in baseline providers',
  'tier-b': 'Official extension targets with reserved adapter positions',
  'tier-c': 'Future SPI targets',
});

export const mail_PROVIDER_PACKAGE_BOUNDARY_MODES = Object.freeze([
  'catalog-governed-mixed',
  'scaffold-per-provider-package',
]);

export const mail_PROVIDER_PACKAGE_BOUNDARY_ROOT_PUBLIC_POLICIES = Object.freeze([
  'none',
]);

export const mail_PROVIDER_PACKAGE_BOUNDARY_LIFECYCLE_STATUS_TERMS = Object.freeze([
  'package_reference_boundary',
  'future-runtime-bridge-only',
]);

export const mail_PROVIDER_PACKAGE_BOUNDARY_RUNTIME_BRIDGE_STATUS_TERMS = Object.freeze([
  'reference-baseline',
  'reserved',
]);

export const mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES = Object.freeze({
  reference: Object.freeze({
    mode: 'catalog-governed-mixed',
    rootPublicPolicy: 'none',
    lifecycleStatusTerms: Object.freeze(['package_reference_boundary']),
    runtimeBridgeStatusTerms: Object.freeze(['reference-baseline']),
  }),
  reserved: Object.freeze({
    mode: 'scaffold-per-provider-package',
    rootPublicPolicy: 'none',
    lifecycleStatusTerms: Object.freeze(['future-runtime-bridge-only']),
    runtimeBridgeStatusTerms: Object.freeze(['reserved']),
  }),
});

export const REQUIRED_mail_CAPABILITIES = Object.freeze([
  'transport.connect',
  'transport.authenticate',
  'health',
]);

export const OPTIONAL_mail_CAPABILITIES = Object.freeze([
  'smtp.send',
  'imap.sync',
  'imap.folder-sync',
  'imap.message-sync',
  'transport.retry',
  'transport.pool',
]);

export const mail_CAPABILITY_CATEGORIES = Object.freeze([
  'required-baseline',
  'optional-advanced',
]);

export const mail_CAPABILITY_SURFACES = Object.freeze([
  'control-plane',
  'runtime-bridge',
  'cross-surface',
]);

export const mail_CAPABILITY_NEGOTIATION_STATUSES = Object.freeze([
  'supported',
  'degraded',
  'unsupported',
]);

export const mail_CAPABILITY_NEGOTIATION_RULES = Object.freeze({
  supported: 'all-requested-capabilities-available',
  degraded: 'all-required-capabilities-available_optional-capabilities-missing',
  unsupported: 'required-capabilities-missing',
});

export const mail_RUNTIME_SURFACE_METHODS = Object.freeze([
  'connectTransport',
  'authenticateTransport',
  'disconnectTransport',
  'sendMail',
  'probeMailbox',
  'syncMailbox',
  'healthCheck',
]);

export const mail_RUNTIME_SURFACE_FAILURE_CODE = 'native_sdk_not_available';

export const mail_RUNTIME_IMMUTABILITY_FROZEN_TERM = 'runtime-frozen';

export const mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM = 'immutable-snapshots';

export const mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM = 'shallow-immutable-context';

export const mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM = 'mutable-native-client';

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS = Object.freeze([
  './errors.js',
  './runtime-surface.js',
  './runtime-immutability.js',
  './root-public-surface.js',
  './types.js',
  './capability-catalog.js',
  './capability-negotiation.js',
  './provider-catalog.js',
  './language-workspace-catalog.js',
  './provider-selection.js',
  './provider-support.js',
  './provider-extension-catalog.js',
  './provider-package-catalog.js',
  './provider-package-loader.js',
  './provider-activation-catalog.js',
  './capabilities.js',
  './client.js',
  './driver.js',
  './driver-manager.js',
  './data-source.js',
  './provider-module.js',
]);

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS = Object.freeze([]);

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES = Object.freeze([]);

export const mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES = Object.freeze([
  'standard-contract',
  'provider-catalog',
  'provider-package-catalog',
  'provider-activation-catalog',
  'capability-catalog',
  'provider-extension-catalog',
  'language-workspace-catalog',
  'provider-selection',
  'provider-package-loader',
  'provider-support',
  'driver-manager',
  'data-source',
]);

export const mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS = Object.freeze({
  flutter: 'barrel',
  python: 'package-init',
});

export const mail_ROOT_PUBLIC_SURFACE_BUILTIN_PROVIDER_EXPOSURE_TERM =
  'provider-plugin-package-only';

export const mail_ROOT_PUBLIC_SURFACE_NON_BUILTIN_PROVIDER_EXPOSURE_TERM =
  'package-boundary-only';

export const mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS = Object.freeze([
  'lower-camel-Mail',
  'upper-camel-Mail',
  'snake-case-Mail',
]);

export const mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS = Object.freeze([
  'provider-catalog-by-provider-key',
  'provider-package-by-provider-key',
  'provider-package-by-package-identity',
  'provider-activation-by-provider-key',
  'capability-catalog',
  'capability-descriptor-by-capability-key',
  'provider-extension-catalog',
  'provider-extension-descriptor-by-extension-key',
  'provider-extensions-for-provider',
  'provider-extensions-by-extension-keys',
  'provider-extension-membership',
  'language-workspace-by-language',
  'provider-url-parser',
  'provider-selection-resolver',
  'provider-support-status-resolver',
  'provider-support-state-factory',
  'provider-package-loader-factory',
  'provider-package-load-target-resolver',
  'provider-module-loader',
  'single-provider-package-installer',
  'batch-provider-package-installer',
]);

export const mail_LOOKUP_HELPER_NAMING_PROFILES = Object.freeze({
  'lower-camel-Mail': Object.freeze({
    languages: Object.freeze(['typescript', 'flutter', 'java', 'swift', 'kotlin']),
    helpers: Object.freeze({
      providerCatalogByProviderKey: 'getMailProviderByProviderKey',
      providerPackageByProviderKey: 'getMailProviderPackageByProviderKey',
      providerPackageByPackageIdentity: 'getMailProviderPackageByPackageIdentity',
      providerActivationByProviderKey: 'getMailProviderActivationByProviderKey',
      capabilityCatalog: 'getMailCapabilityCatalog',
      capabilityDescriptorByCapabilityKey: 'getMailCapabilityDescriptor',
      providerExtensionCatalog: 'getMailProviderExtensionCatalog',
      providerExtensionDescriptorByExtensionKey: 'getMailProviderExtensionDescriptor',
      providerExtensionsForProvider: 'getMailProviderExtensionsForProvider',
      providerExtensionsByExtensionKeys: 'getMailProviderExtensions',
      providerExtensionMembership: 'hasMailProviderExtension',
      languageWorkspaceByLanguage: 'getMailLanguageWorkspaceByLanguage',
      providerUrlParser: 'parseMailProviderUrl',
      providerSelectionResolver: 'resolveMailProviderSelection',
      providerSupportStatusResolver: 'resolveMailProviderSupportStatus',
      providerSupportStateFactory: 'createMailProviderSupportState',
      providerPackageLoaderFactory: 'createMailProviderPackageLoader',
      providerPackageLoadTargetResolver: 'resolveMailProviderPackageLoadTarget',
      providerModuleLoader: 'loadMailProviderModule',
      singleProviderPackageInstaller: 'installMailProviderPackage',
      batchProviderPackageInstaller: 'installMailProviderPackages',
    }),
  }),
  'upper-camel-Mail': Object.freeze({
    languages: Object.freeze(['csharp', 'go']),
    helpers: Object.freeze({
      providerCatalogByProviderKey: 'GetMailProviderByProviderKey',
      providerPackageByProviderKey: 'GetMailProviderPackageByProviderKey',
      providerPackageByPackageIdentity: 'GetMailProviderPackageByPackageIdentity',
      providerActivationByProviderKey: 'GetMailProviderActivationByProviderKey',
      capabilityCatalog: 'GetMailCapabilityCatalog',
      capabilityDescriptorByCapabilityKey: 'GetMailCapabilityDescriptor',
      providerExtensionCatalog: 'GetMailProviderExtensionCatalog',
      providerExtensionDescriptorByExtensionKey: 'GetMailProviderExtensionDescriptor',
      providerExtensionsForProvider: 'GetMailProviderExtensionsForProvider',
      providerExtensionsByExtensionKeys: 'GetMailProviderExtensions',
      providerExtensionMembership: 'HasMailProviderExtension',
      languageWorkspaceByLanguage: 'GetMailLanguageWorkspaceByLanguage',
      providerUrlParser: 'ParseMailProviderUrl',
      providerSelectionResolver: 'ResolveMailProviderSelection',
      providerSupportStatusResolver: 'ResolveMailProviderSupportStatus',
      providerSupportStateFactory: 'CreateMailProviderSupportState',
      providerPackageLoaderFactory: 'CreateMailProviderPackageLoader',
      providerPackageLoadTargetResolver: 'ResolveMailProviderPackageLoadTarget',
      providerModuleLoader: 'LoadMailProviderModule',
      singleProviderPackageInstaller: 'InstallMailProviderPackage',
      batchProviderPackageInstaller: 'InstallMailProviderPackages',
    }),
  }),
  'snake-case-Mail': Object.freeze({
    languages: Object.freeze(['rust', 'python']),
    helpers: Object.freeze({
      providerCatalogByProviderKey: 'get_mail_provider_by_provider_key',
      providerPackageByProviderKey: 'get_mail_provider_package_by_provider_key',
      providerPackageByPackageIdentity: 'get_mail_provider_package_by_package_identity',
      providerActivationByProviderKey: 'get_mail_provider_activation_by_provider_key',
      capabilityCatalog: 'get_mail_capability_catalog',
      capabilityDescriptorByCapabilityKey: 'get_mail_capability_descriptor',
      providerExtensionCatalog: 'get_mail_provider_extension_catalog',
      providerExtensionDescriptorByExtensionKey: 'get_mail_provider_extension_descriptor',
      providerExtensionsForProvider: 'get_mail_provider_extensions_for_provider',
      providerExtensionsByExtensionKeys: 'get_mail_provider_extensions',
      providerExtensionMembership: 'has_mail_provider_extension',
      languageWorkspaceByLanguage: 'get_mail_language_workspace_by_language',
      providerUrlParser: 'parse_mail_provider_url',
      providerSelectionResolver: 'resolve_mail_provider_selection',
      providerSupportStatusResolver: 'resolve_mail_provider_support_status',
      providerSupportStateFactory: 'create_mail_provider_support_state',
      providerPackageLoaderFactory: 'create_mail_provider_package_loader',
      providerPackageLoadTargetResolver: 'resolve_mail_provider_package_load_target',
      providerModuleLoader: 'load_mail_provider_module',
      singleProviderPackageInstaller: 'install_mail_provider_package',
      batchProviderPackageInstaller: 'install_mail_provider_packages',
    }),
  }),
});

export const mail_SDK_ERROR_CODES = Object.freeze([
  'provider_package_not_found',
  'provider_package_identity_mismatch',
  'provider_package_load_failed',
  'provider_module_export_missing',
  'provider_module_contract_mismatch',
  'driver_already_registered',
  'driver_not_found',
  'provider_not_official',
  'provider_not_supported',
  'provider_metadata_mismatch',
  'provider_selection_failed',
  'capability_not_supported',
  'invalid_provider_url',
  'invalid_native_config',
  'native_sdk_not_available',
  'vendor_error',
]);

export const mail_SDK_ERROR_FALLBACK_CODE = 'vendor_error';

export const mail_PROVIDER_EXTENSION_ACCESSES = Object.freeze([
  'unwrap-only',
  'extension-object',
]);

export const mail_PROVIDER_EXTENSION_STATUSES = Object.freeze([
  'reference-baseline',
  'reserved',
]);

export const mail_LANGUAGE_MATURITY_TIERS = Object.freeze([
  'reference',
  'reserved',
]);

export const mail_LANGUAGE_MATURITY_TIER_SUMMARIES = Object.freeze({
  reference: 'Executable baseline language workspace',
  reserved: 'Official but not yet executable runtime-bridge workspace',
});

export const TYPESCRIPT_ADAPTER_SDK_PROVISIONING_VALUES = Object.freeze([
  'consumer-supplied',
]);

export const TYPESCRIPT_ADAPTER_BINDING_STRATEGIES = Object.freeze([
  'native-factory',
]);

export const TYPESCRIPT_ADAPTER_BUNDLE_POLICIES = Object.freeze([
  'must-not-bundle',
]);

export const TYPESCRIPT_ADAPTER_RUNTIME_BRIDGE_STATUSES = Object.freeze([
  'reference-baseline',
  'reserved',
]);

export const TYPESCRIPT_ADAPTER_OFFICIAL_VENDOR_SDK_REQUIREMENTS = Object.freeze([
  'required',
  'not-declared-until-bridge',
]);

export const DEFAULT_TYPESCRIPT_ADAPTER_CONTRACT = Object.freeze({
  sdkProvisioning: 'consumer-supplied',
  bindingStrategy: 'native-factory',
  bundlePolicy: 'must-not-bundle',
  runtimeBridgeStatus: 'reference-baseline',
  officialVendorSdkRequirement: 'required',
});

export const DEFAULT_TYPESCRIPT_PACKAGE_STANDARD = Object.freeze({
  packageNamePattern: '@sdkwork/Mail-sdk-provider-{providerKey}',
  sourceModulePattern: './index.js',
  driverFactoryPattern: 'create{providerPascal}MailDriver',
  metadataSymbolPattern: '{providerUpperSnake}_mail_PROVIDER_METADATA',
  moduleSymbolPattern: '{providerUpperSnake}_mail_PROVIDER_MODULE',
  rootPublicRule: 'plugin-package-only',
});

export const DEFAULT_ROOT_PUBLIC_SURFACE_STANDARD = Object.freeze({
  typescriptProviderNeutralExportPaths:
    mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS,
  typescriptBuiltinProviderExportPaths:
    mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS,
  typescriptInlineHelperNames: mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES,
  reservedSurfaceFamilies: mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES,
  reservedEntryPointKinds: mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS,
  builtinProviderExposureTerm: mail_ROOT_PUBLIC_SURFACE_BUILTIN_PROVIDER_EXPOSURE_TERM,
  nonBuiltinProviderExposureTerm: mail_ROOT_PUBLIC_SURFACE_NON_BUILTIN_PROVIDER_EXPOSURE_TERM,
});

export const DEFAULT_LOOKUP_HELPER_NAMING_STANDARD = Object.freeze({
  profileTerms: mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS,
  familyTerms: mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS,
  profiles: mail_LOOKUP_HELPER_NAMING_PROFILES,
});
