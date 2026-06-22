import {
  mail_CAPABILITY_CATEGORIES,
  mail_CAPABILITY_NEGOTIATION_RULES,
  mail_CAPABILITY_NEGOTIATION_STATUSES,
  DEFAULT_LOOKUP_HELPER_NAMING_STANDARD,
  DEFAULT_ROOT_PUBLIC_SURFACE_STANDARD,
  mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM,
  mail_RUNTIME_IMMUTABILITY_FROZEN_TERM,
  mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM,
  mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM,
  mail_CAPABILITY_SURFACES,
  mail_RUNTIME_SURFACE_FAILURE_CODE,
  mail_RUNTIME_SURFACE_METHODS,
  mail_SDK_ERROR_CODES,
  mail_SDK_ERROR_FALLBACK_CODE,
  BUILTIN_mail_PROVIDER_KEYS,
  DEFAULT_mail_PROVIDER_KEY,
  DEFAULT_TYPESCRIPT_ADAPTER_CONTRACT,
  DEFAULT_TYPESCRIPT_PACKAGE_STANDARD,
  mail_LANGUAGE_MATURITY_TIERS,
  mail_LANGUAGE_MATURITY_TIER_SUMMARIES,
  OFFICIAL_mail_LANGUAGE_WORKSPACE_KEYS,
  mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS,
  mail_PROVIDER_ACTIVATION_STATUSES,
  mail_PROVIDER_EXTENSION_ACCESSES,
  mail_PROVIDER_EXTENSION_STATUSES,
  mail_PROVIDER_PACKAGE_BOUNDARY_LIFECYCLE_STATUS_TERMS,
  mail_PROVIDER_PACKAGE_BOUNDARY_MODES,
  mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES,
  mail_PROVIDER_PACKAGE_BOUNDARY_ROOT_PUBLIC_POLICIES,
  mail_PROVIDER_PACKAGE_BOUNDARY_RUNTIME_BRIDGE_STATUS_TERMS,
  mail_PROVIDER_TIERS,
  mail_PROVIDER_TIER_SUMMARIES,
  mail_PROVIDER_SELECTION_PRECEDENCE,
  mail_PROVIDER_SELECTION_SOURCES,
  mail_PROVIDER_SUPPORT_STATUSES,
  TYPESCRIPT_ADAPTER_BINDING_STRATEGIES,
  TYPESCRIPT_ADAPTER_BUNDLE_POLICIES,
  TYPESCRIPT_ADAPTER_OFFICIAL_VENDOR_SDK_REQUIREMENTS,
  TYPESCRIPT_ADAPTER_RUNTIME_BRIDGE_STATUSES,
  TYPESCRIPT_ADAPTER_SDK_PROVISIONING_VALUES,
} from './Mail-standard-contract-constants.mjs';

function hasExactArray(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export const mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_MODES = ['runtime-backed', 'analysis-backed'];
const mail_LANGUAGE_RUNTIME_DOCUMENTATION_REQUIRED_FIELDS = [
  'baselineConclusion',
  'guideTitle',
  'runtimeLabel',
  'detailedGuidePath',
  'detailedGuideLabel',
  'smokeNarrative',
];

export function getMailAssemblyLanguageEntries(assembly) {
  const languageEntries = assembly?.languages ?? [];
  if (!Array.isArray(languageEntries)) {
    throw new Error('assembly.languages must be an array');
  }

  return languageEntries;
}

export function getMailLanguageEntryByLanguage(assembly, language) {
  return getMailAssemblyLanguageEntries(assembly).find(
    (languageEntry) => languageEntry.language === language,
  );
}

export function isMailExecutableLanguageEntry(languageEntry) {
  return (
    languageEntry?.runtimeBridge === true &&
    languageEntry?.maturityTier === 'reference' &&
    typeof languageEntry?.workspace === 'string' &&
    languageEntry.workspace.length > 0 &&
    languageEntry?.runtimeBaseline != null
  );
}

export function getMailExecutableLanguageEntries(assembly) {
  return getMailAssemblyLanguageEntries(assembly).filter(isMailExecutableLanguageEntry);
}

export function getMailExecutableLanguageEntryByLanguage(assembly, language) {
  return getMailExecutableLanguageEntries(assembly).find(
    (languageEntry) => languageEntry.language === language,
  );
}

export function getMailExecutableLanguageEntriesBySmokeMode(assembly, smokeMode) {
  if (!mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_MODES.includes(smokeMode)) {
    throw new Error(
      `Unknown Mail runtime baseline smoke mode: ${smokeMode}. Expected one of ${mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_MODES.join(', ')}`,
    );
  }

  return getMailExecutableLanguageEntries(assembly).filter(
    (languageEntry) => languageEntry.runtimeBaseline?.smokeMode === smokeMode,
  );
}

export function getMailDefaultCallSmokeLanguage(assembly) {
  const runtimeBackedEntries = getMailExecutableLanguageEntriesBySmokeMode(
    assembly,
    'runtime-backed',
  );
  if (runtimeBackedEntries.length > 0) {
    return runtimeBackedEntries[0].language;
  }

  const executableEntries = getMailExecutableLanguageEntries(assembly);
  if (executableEntries.length === 0) {
    throw new Error('Assembly does not declare any executable Mail language entries');
  }

  return executableEntries[0].language;
}

export function assertMailAssemblyWorkspaceBaseline(assembly) {
  if (assembly.workspace !== 'sdkwork-mail-sdk') {
    throw new Error(`Unexpected workspace name: ${assembly.workspace}`);
  }

  if (assembly.defaults?.providerKey !== DEFAULT_mail_PROVIDER_KEY) {
    throw new Error(
      `Default provider must be ${DEFAULT_mail_PROVIDER_KEY}, received: ${assembly.defaults?.providerKey ?? '<missing>'}`,
    );
  }

  const officialLanguages = assembly.officialLanguages ?? [];
  if (
    !Array.isArray(officialLanguages) ||
    !hasExactArray(officialLanguages, OFFICIAL_mail_LANGUAGE_WORKSPACE_KEYS)
  ) {
    throw new Error(
      `officialLanguages must declare the full nine-language family: ${OFFICIAL_mail_LANGUAGE_WORKSPACE_KEYS.join(', ')}`,
    );
  }

  const providers = assembly.providers ?? [];
  const builtinProviderKeys = providers
    .filter((provider) => provider.builtin)
    .map((provider) => provider.providerKey);
  if (!hasExactArray(builtinProviderKeys, BUILTIN_mail_PROVIDER_KEYS)) {
    throw new Error(`Builtin providers must be ${BUILTIN_mail_PROVIDER_KEYS.join(', ')}`);
  }

  const defaultProviderEntry = providers.find(
    (provider) => provider.providerKey === DEFAULT_mail_PROVIDER_KEY,
  );
  if (!defaultProviderEntry?.builtin) {
    throw new Error('Default provider must point at a builtin providers entry');
  }

  if (!defaultProviderEntry?.defaultSelected) {
    throw new Error('Default provider must also be marked as the default-selected provider');
  }

  const defaultSelectedProviders = providers
    .filter((provider) => provider.defaultSelected)
    .map((provider) => provider.providerKey);
  if (!hasExactArray(defaultSelectedProviders, [DEFAULT_mail_PROVIDER_KEY])) {
    throw new Error(
      'Assembly must declare exactly one defaultSelected provider and it must match defaults.providerKey',
    );
  }

  for (const provider of providers) {
    const adapter = provider.typescriptAdapter ?? {};
    if (!TYPESCRIPT_ADAPTER_SDK_PROVISIONING_VALUES.includes(adapter.sdkProvisioning)) {
      throw new Error(
        `provider ${provider.providerKey} typescriptAdapter.sdkProvisioning must be one of ${TYPESCRIPT_ADAPTER_SDK_PROVISIONING_VALUES.join(', ')}`,
      );
    }

    if (!TYPESCRIPT_ADAPTER_BINDING_STRATEGIES.includes(adapter.bindingStrategy)) {
      throw new Error(
        `provider ${provider.providerKey} typescriptAdapter.bindingStrategy must be one of ${TYPESCRIPT_ADAPTER_BINDING_STRATEGIES.join(', ')}`,
      );
    }

    if (!TYPESCRIPT_ADAPTER_BUNDLE_POLICIES.includes(adapter.bundlePolicy)) {
      throw new Error(
        `provider ${provider.providerKey} typescriptAdapter.bundlePolicy must be one of ${TYPESCRIPT_ADAPTER_BUNDLE_POLICIES.join(', ')}`,
      );
    }

    if (!TYPESCRIPT_ADAPTER_RUNTIME_BRIDGE_STATUSES.includes(adapter.runtimeBridgeStatus)) {
      throw new Error(
        `provider ${provider.providerKey} typescriptAdapter.runtimeBridgeStatus must be one of ${TYPESCRIPT_ADAPTER_RUNTIME_BRIDGE_STATUSES.join(', ')}`,
      );
    }

    if (
      !TYPESCRIPT_ADAPTER_OFFICIAL_VENDOR_SDK_REQUIREMENTS.includes(
        adapter.officialVendorSdkRequirement,
      )
    ) {
      throw new Error(
        `provider ${provider.providerKey} typescriptAdapter.officialVendorSdkRequirement must be one of ${TYPESCRIPT_ADAPTER_OFFICIAL_VENDOR_SDK_REQUIREMENTS.join(', ')}`,
      );
    }

    const expectedVendorRequirement =
      adapter.runtimeBridgeStatus === 'reference-baseline'
        ? 'required'
        : 'not-declared-until-bridge';
    if (adapter.officialVendorSdkRequirement !== expectedVendorRequirement) {
      throw new Error(
        `provider ${provider.providerKey} official vendor SDK requirement must be ${expectedVendorRequirement} when runtime bridge status is ${adapter.runtimeBridgeStatus}`,
      );
    }
  }

  const defaultBridgeStatus = defaultProviderEntry.typescriptAdapter?.runtimeBridgeStatus;
  if (
    defaultBridgeStatus !== 'reference-baseline' &&
    defaultBridgeStatus !== 'reserved'
  ) {
    throw new Error(
      'Default provider must declare runtimeBridgeStatus as reference-baseline or reserved',
    );
  }

  const providerSelectionStandard = assembly.providerSelectionStandard ?? {};
  if (!hasExactArray(providerSelectionStandard.sourceTerms, mail_PROVIDER_SELECTION_SOURCES)) {
    throw new Error(
      `providerSelectionStandard.sourceTerms must be ${mail_PROVIDER_SELECTION_SOURCES.join(', ')}`,
    );
  }

  if (!hasExactArray(providerSelectionStandard.precedence, mail_PROVIDER_SELECTION_PRECEDENCE)) {
    throw new Error(
      `providerSelectionStandard.precedence must be ${mail_PROVIDER_SELECTION_PRECEDENCE.join(', ')}`,
    );
  }

  const canonicalDefaultSelectionSource =
    mail_PROVIDER_SELECTION_SOURCES[mail_PROVIDER_SELECTION_SOURCES.length - 1];
  if (providerSelectionStandard.defaultSource !== canonicalDefaultSelectionSource) {
    throw new Error(
      `providerSelectionStandard.defaultSource must be ${canonicalDefaultSelectionSource}, received: ${providerSelectionStandard.defaultSource ?? '<missing>'}`,
    );
  }

  const providerSupportStandard = assembly.providerSupportStandard ?? {};
  if (!hasExactArray(providerSupportStandard.statusTerms, mail_PROVIDER_SUPPORT_STATUSES)) {
    throw new Error(
      `providerSupportStandard.statusTerms must be ${mail_PROVIDER_SUPPORT_STATUSES.join(', ')}`,
    );
  }

  const providerActivationStandard = assembly.providerActivationStandard ?? {};
  if (!hasExactArray(providerActivationStandard.statusTerms, mail_PROVIDER_ACTIVATION_STATUSES)) {
    throw new Error(
      `providerActivationStandard.statusTerms must be ${mail_PROVIDER_ACTIVATION_STATUSES.join(', ')}`,
    );
  }

  const capabilityStandard = assembly.capabilityStandard ?? {};
  if (!hasExactArray(capabilityStandard.categoryTerms, mail_CAPABILITY_CATEGORIES)) {
    throw new Error(
      `capabilityStandard.categoryTerms must be ${mail_CAPABILITY_CATEGORIES.join(', ')}`,
    );
  }

  if (!hasExactArray(capabilityStandard.surfaceTerms, mail_CAPABILITY_SURFACES)) {
    throw new Error(
      `capabilityStandard.surfaceTerms must be ${mail_CAPABILITY_SURFACES.join(', ')}`,
    );
  }

  const capabilityNegotiationStandard = assembly.capabilityNegotiationStandard ?? {};
  if (
    !hasExactArray(
      capabilityNegotiationStandard.statusTerms,
      mail_CAPABILITY_NEGOTIATION_STATUSES,
    )
  ) {
    throw new Error(
      `capabilityNegotiationStandard.statusTerms must be ${mail_CAPABILITY_NEGOTIATION_STATUSES.join(', ')}`,
    );
  }

  if (
    JSON.stringify(capabilityNegotiationStandard.statusRules ?? {}) !==
    JSON.stringify(mail_CAPABILITY_NEGOTIATION_RULES)
  ) {
    throw new Error(
      'capabilityNegotiationStandard.statusRules must exactly match the canonical negotiation rules',
    );
  }

  const runtimeSurfaceStandard = assembly.runtimeSurfaceStandard ?? {};
  if (!hasExactArray(runtimeSurfaceStandard.methodTerms, mail_RUNTIME_SURFACE_METHODS)) {
    throw new Error(
      `runtimeSurfaceStandard.methodTerms must be ${mail_RUNTIME_SURFACE_METHODS.join(', ')}`,
    );
  }

  if (runtimeSurfaceStandard.failureCode !== mail_RUNTIME_SURFACE_FAILURE_CODE) {
    throw new Error(
      `runtimeSurfaceStandard.failureCode must be ${mail_RUNTIME_SURFACE_FAILURE_CODE}, received: ${runtimeSurfaceStandard.failureCode ?? '<missing>'}`,
    );
  }

  const runtimeImmutabilityStandard = assembly.runtimeImmutabilityStandard ?? {};
  if (runtimeImmutabilityStandard.frozenTerm !== mail_RUNTIME_IMMUTABILITY_FROZEN_TERM) {
    throw new Error(
      `runtimeImmutabilityStandard.frozenTerm must be ${mail_RUNTIME_IMMUTABILITY_FROZEN_TERM}, received: ${runtimeImmutabilityStandard.frozenTerm ?? '<missing>'}`,
    );
  }

  if (runtimeImmutabilityStandard.snapshotTerm !== mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM) {
    throw new Error(
      `runtimeImmutabilityStandard.snapshotTerm must be ${mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM}, received: ${runtimeImmutabilityStandard.snapshotTerm ?? '<missing>'}`,
    );
  }

  if (
    runtimeImmutabilityStandard.controllerContextTerm !==
    mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM
  ) {
    throw new Error(
      `runtimeImmutabilityStandard.controllerContextTerm must be ${mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM}, received: ${runtimeImmutabilityStandard.controllerContextTerm ?? '<missing>'}`,
    );
  }

  if (
    runtimeImmutabilityStandard.nativeClientTerm !== mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM
  ) {
    throw new Error(
      `runtimeImmutabilityStandard.nativeClientTerm must be ${mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM}, received: ${runtimeImmutabilityStandard.nativeClientTerm ?? '<missing>'}`,
    );
  }

  const rootPublicSurfaceStandard = assembly.rootPublicSurfaceStandard ?? {};
  if (
    JSON.stringify(rootPublicSurfaceStandard) !==
    JSON.stringify(DEFAULT_ROOT_PUBLIC_SURFACE_STANDARD)
  ) {
    throw new Error(
      'rootPublicSurfaceStandard must exactly match the canonical root public surface contract',
    );
  }

  const lookupHelperNamingStandard = assembly.lookupHelperNamingStandard ?? {};
  if (
    JSON.stringify(lookupHelperNamingStandard) !==
    JSON.stringify(DEFAULT_LOOKUP_HELPER_NAMING_STANDARD)
  ) {
    throw new Error(
      'lookupHelperNamingStandard must exactly match the canonical lookup helper naming contract',
    );
  }

  const errorCodeStandard = assembly.errorCodeStandard ?? {};
  if (!hasExactArray(errorCodeStandard.codeTerms, mail_SDK_ERROR_CODES)) {
    throw new Error(
      `errorCodeStandard.codeTerms must be ${mail_SDK_ERROR_CODES.join(', ')}`,
    );
  }

  if (errorCodeStandard.fallbackCode !== mail_SDK_ERROR_FALLBACK_CODE) {
    throw new Error(
      `errorCodeStandard.fallbackCode must be ${mail_SDK_ERROR_FALLBACK_CODE}, received: ${errorCodeStandard.fallbackCode ?? '<missing>'}`,
    );
  }

  const providerExtensionStandard = assembly.providerExtensionStandard ?? {};
  if (!hasExactArray(providerExtensionStandard.accessTerms, mail_PROVIDER_EXTENSION_ACCESSES)) {
    throw new Error(
      `providerExtensionStandard.accessTerms must be ${mail_PROVIDER_EXTENSION_ACCESSES.join(', ')}`,
    );
  }

  if (!hasExactArray(providerExtensionStandard.statusTerms, mail_PROVIDER_EXTENSION_STATUSES)) {
    throw new Error(
      `providerExtensionStandard.statusTerms must be ${mail_PROVIDER_EXTENSION_STATUSES.join(', ')}`,
    );
  }

  const providerTierStandard = assembly.providerTierStandard ?? {};
  if (!hasExactArray(providerTierStandard.tierTerms, mail_PROVIDER_TIERS)) {
    throw new Error(
      `providerTierStandard.tierTerms must be ${mail_PROVIDER_TIERS.join(', ')}`,
    );
  }

  if (
    JSON.stringify(providerTierStandard.tierSummaries ?? {}) !==
    JSON.stringify(mail_PROVIDER_TIER_SUMMARIES)
  ) {
    throw new Error('providerTierStandard.tierSummaries must exactly match the canonical tier summaries');
  }

  const languageMaturityStandard = assembly.languageMaturityStandard ?? {};
  if (!hasExactArray(languageMaturityStandard.tierTerms, mail_LANGUAGE_MATURITY_TIERS)) {
    throw new Error(
      `languageMaturityStandard.tierTerms must be ${mail_LANGUAGE_MATURITY_TIERS.join(', ')}`,
    );
  }

  if (
    JSON.stringify(languageMaturityStandard.tierSummaries ?? {}) !==
    JSON.stringify(mail_LANGUAGE_MATURITY_TIER_SUMMARIES)
  ) {
    throw new Error(
      'languageMaturityStandard.tierSummaries must exactly match the canonical maturity summaries',
    );
  }

  const typescriptAdapterStandard = assembly.typescriptAdapterStandard ?? {};
  if (
    !hasExactArray(
      typescriptAdapterStandard.sdkProvisioningTerms,
      TYPESCRIPT_ADAPTER_SDK_PROVISIONING_VALUES,
    )
  ) {
    throw new Error(
      `typescriptAdapterStandard.sdkProvisioningTerms must be ${TYPESCRIPT_ADAPTER_SDK_PROVISIONING_VALUES.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      typescriptAdapterStandard.bindingStrategyTerms,
      TYPESCRIPT_ADAPTER_BINDING_STRATEGIES,
    )
  ) {
    throw new Error(
      `typescriptAdapterStandard.bindingStrategyTerms must be ${TYPESCRIPT_ADAPTER_BINDING_STRATEGIES.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      typescriptAdapterStandard.bundlePolicyTerms,
      TYPESCRIPT_ADAPTER_BUNDLE_POLICIES,
    )
  ) {
    throw new Error(
      `typescriptAdapterStandard.bundlePolicyTerms must be ${TYPESCRIPT_ADAPTER_BUNDLE_POLICIES.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      typescriptAdapterStandard.runtimeBridgeStatusTerms,
      TYPESCRIPT_ADAPTER_RUNTIME_BRIDGE_STATUSES,
    )
  ) {
    throw new Error(
      `typescriptAdapterStandard.runtimeBridgeStatusTerms must be ${TYPESCRIPT_ADAPTER_RUNTIME_BRIDGE_STATUSES.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      typescriptAdapterStandard.officialVendorSdkRequirementTerms,
      TYPESCRIPT_ADAPTER_OFFICIAL_VENDOR_SDK_REQUIREMENTS,
    )
  ) {
    throw new Error(
      `typescriptAdapterStandard.officialVendorSdkRequirementTerms must be ${TYPESCRIPT_ADAPTER_OFFICIAL_VENDOR_SDK_REQUIREMENTS.join(', ')}`,
    );
  }

  if (
    JSON.stringify(typescriptAdapterStandard.referenceContract ?? {}) !==
    JSON.stringify(DEFAULT_TYPESCRIPT_ADAPTER_CONTRACT)
  ) {
    throw new Error(
      'typescriptAdapterStandard.referenceContract must exactly match the canonical TypeScript adapter baseline',
    );
  }

  const typescriptPackageStandard = assembly.typescriptPackageStandard ?? {};
  if (
    JSON.stringify(typescriptPackageStandard) !==
    JSON.stringify(DEFAULT_TYPESCRIPT_PACKAGE_STANDARD)
  ) {
    throw new Error(
      'typescriptPackageStandard must exactly match the canonical TypeScript package naming standard',
    );
  }

  const providerPackageBoundaryStandard = assembly.providerPackageBoundaryStandard ?? {};
  if (!hasExactArray(providerPackageBoundaryStandard.modeTerms, mail_PROVIDER_PACKAGE_BOUNDARY_MODES)) {
    throw new Error(
      `providerPackageBoundaryStandard.modeTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_MODES.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      providerPackageBoundaryStandard.rootPublicPolicyTerms,
      mail_PROVIDER_PACKAGE_BOUNDARY_ROOT_PUBLIC_POLICIES,
    )
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.rootPublicPolicyTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_ROOT_PUBLIC_POLICIES.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      providerPackageBoundaryStandard.lifecycleStatusTerms,
      mail_PROVIDER_PACKAGE_BOUNDARY_LIFECYCLE_STATUS_TERMS,
    )
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.lifecycleStatusTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_LIFECYCLE_STATUS_TERMS.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      providerPackageBoundaryStandard.runtimeBridgeStatusTerms,
      mail_PROVIDER_PACKAGE_BOUNDARY_RUNTIME_BRIDGE_STATUS_TERMS,
    )
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.runtimeBridgeStatusTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_RUNTIME_BRIDGE_STATUS_TERMS.join(', ')}`,
    );
  }

  const referenceProfile = providerPackageBoundaryStandard.profiles?.reference ?? {};
  if (referenceProfile.mode !== mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.mode) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reference.mode must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.mode}`,
    );
  }

  if (
    referenceProfile.rootPublicPolicy !==
    mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.rootPublicPolicy
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reference.rootPublicPolicy must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.rootPublicPolicy}`,
    );
  }

  if (
    !hasExactArray(
      referenceProfile.lifecycleStatusTerms,
      mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.lifecycleStatusTerms,
    )
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reference.lifecycleStatusTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.lifecycleStatusTerms.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      referenceProfile.runtimeBridgeStatusTerms,
      mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.runtimeBridgeStatusTerms,
    )
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reference.runtimeBridgeStatusTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reference.runtimeBridgeStatusTerms.join(', ')}`,
    );
  }

  const reservedProfile = providerPackageBoundaryStandard.profiles?.reserved ?? {};
  if (reservedProfile.mode !== mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.mode) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reserved.mode must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.mode}`,
    );
  }

  if (
    reservedProfile.rootPublicPolicy !==
    mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.rootPublicPolicy
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reserved.rootPublicPolicy must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.rootPublicPolicy}`,
    );
  }

  if (
    !hasExactArray(
      reservedProfile.lifecycleStatusTerms,
      mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.lifecycleStatusTerms,
    )
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reserved.lifecycleStatusTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.lifecycleStatusTerms.join(', ')}`,
    );
  }

  if (
    !hasExactArray(
      reservedProfile.runtimeBridgeStatusTerms,
      mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.runtimeBridgeStatusTerms,
    )
  ) {
    throw new Error(
      `providerPackageBoundaryStandard.profiles.reserved.runtimeBridgeStatusTerms must be ${mail_PROVIDER_PACKAGE_BOUNDARY_PROFILES.reserved.runtimeBridgeStatusTerms.join(', ')}`,
    );
  }

  for (const languageEntry of assembly.languages ?? []) {
    const expectsRuntimeBaseline =
      languageEntry.runtimeBridge === true && languageEntry.maturityTier === 'reference';
    const runtimeBaseline = languageEntry.runtimeBaseline;
    const runtimeDocumentation = languageEntry.runtimeDocumentation;

    if (expectsRuntimeBaseline && !runtimeBaseline) {
      throw new Error(
        `Reference runtime language ${languageEntry.language} must declare runtimeBaseline metadata`,
      );
    }

    if (expectsRuntimeBaseline && !runtimeDocumentation) {
      throw new Error(
        `Reference runtime language ${languageEntry.language} must declare runtimeDocumentation metadata`,
      );
    }

    if (!expectsRuntimeBaseline && runtimeDocumentation) {
      throw new Error(
        `Non-executable language ${languageEntry.language} must not declare runtimeDocumentation metadata`,
      );
    }

    if (!runtimeBaseline) {
      continue;
    }

    for (const field of [
      'vendorSdkPackage',
      'vendorSdkImportPath',
      'recommendedEntrypoint',
      'smokeCommand',
    ]) {
      if (typeof runtimeBaseline[field] !== 'string' || runtimeBaseline[field].length === 0) {
        throw new Error(
          `language ${languageEntry.language} runtimeBaseline.${field} must be a non-empty string`,
        );
      }
    }

    if (!mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_MODES.includes(runtimeBaseline.smokeMode)) {
      throw new Error(
        `language ${languageEntry.language} runtimeBaseline.smokeMode must be one of ${mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_MODES.join(', ')}`,
      );
    }

    if (
      !Array.isArray(runtimeBaseline.smokeVariants) ||
      runtimeBaseline.smokeVariants.length === 0
    ) {
      throw new Error(
        `language ${languageEntry.language} runtimeBaseline.smokeVariants must be a non-empty array`,
      );
    }

    if (
      runtimeBaseline.smokeVariants[0] !==
      mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS[0]
    ) {
      throw new Error(
        `language ${languageEntry.language} runtimeBaseline.smokeVariants must start with ${mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS[0]}`,
      );
    }

    const uniqueSmokeVariants = [...new Set(runtimeBaseline.smokeVariants)];
    if (!hasExactArray(runtimeBaseline.smokeVariants, uniqueSmokeVariants)) {
      throw new Error(
        `language ${languageEntry.language} runtimeBaseline.smokeVariants must not contain duplicates`,
      );
    }

    for (const smokeVariant of runtimeBaseline.smokeVariants) {
      if (
        typeof smokeVariant !== 'string' ||
        !mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS.includes(smokeVariant)
      ) {
        throw new Error(
          `language ${languageEntry.language} runtimeBaseline.smokeVariants must use only ${mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS.join(', ')}`,
        );
      }
    }

    const canonicalSmokeVariants = mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS.filter((variant) =>
      runtimeBaseline.smokeVariants.includes(variant),
    );
    if (!hasExactArray(runtimeBaseline.smokeVariants, canonicalSmokeVariants)) {
      throw new Error(
        `language ${languageEntry.language} runtimeBaseline.smokeVariants must preserve canonical order ${mail_LANGUAGE_RUNTIME_BASELINE_SMOKE_VARIANTS.join(', ')}`,
      );
    }

    for (const field of mail_LANGUAGE_RUNTIME_DOCUMENTATION_REQUIRED_FIELDS) {
      if (
        typeof runtimeDocumentation?.[field] !== 'string' ||
        runtimeDocumentation[field].length === 0
      ) {
        throw new Error(
          `language ${languageEntry.language} runtimeDocumentation.${field} must be a non-empty string`,
        );
      }
    }
  }

  return {
    officialLanguages,
    providers,
    providerSelectionStandard,
    providerSupportStandard,
    providerActivationStandard,
    capabilityStandard,
    capabilityNegotiationStandard,
    runtimeSurfaceStandard,
    runtimeImmutabilityStandard,
    rootPublicSurfaceStandard,
    lookupHelperNamingStandard,
    errorCodeStandard,
    providerExtensionStandard,
    providerTierStandard,
    languageMaturityStandard,
    typescriptAdapterStandard,
    typescriptPackageStandard,
    providerPackageBoundaryStandard,
  };
}
