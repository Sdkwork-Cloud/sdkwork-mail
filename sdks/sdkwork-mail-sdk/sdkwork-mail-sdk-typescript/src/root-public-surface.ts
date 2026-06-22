import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS = freezeMailRuntimeValue(['./errors.js', './runtime-surface.js', './runtime-immutability.js', './root-public-surface.js', './types.js', './capability-catalog.js', './capability-negotiation.js', './provider-catalog.js', './language-workspace-catalog.js', './provider-selection.js', './provider-support.js', './provider-extension-catalog.js', './provider-package-catalog.js', './provider-package-loader.js', './provider-activation-catalog.js', './capabilities.js', './client.js', './driver.js', './driver-manager.js', './data-source.js', './provider-module.js'] as const);

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS = freezeMailRuntimeValue([] as const);

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES = freezeMailRuntimeValue([] as const);

export const mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES = freezeMailRuntimeValue(['standard-contract', 'provider-catalog', 'provider-package-catalog', 'provider-activation-catalog', 'capability-catalog', 'provider-extension-catalog', 'language-workspace-catalog', 'provider-selection', 'provider-package-loader', 'provider-support', 'driver-manager', 'data-source'] as const);

export const mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS = freezeMailRuntimeValue({
  "flutter": 'barrel',
  "python": 'package-init',
} as const);

export const mail_ROOT_PUBLIC_SURFACE_BUILTIN_PROVIDER_EXPOSURE_TERM = 'provider-plugin-package-only';

export const mail_ROOT_PUBLIC_SURFACE_NON_BUILTIN_PROVIDER_EXPOSURE_TERM = 'package-boundary-only';

export {
  mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS,
  mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS,
  mail_LOOKUP_HELPER_NAMING_STANDARD,
} from './lookup-helper-naming.js';

export const mail_ROOT_PUBLIC_SURFACE_STANDARD = freezeMailRuntimeValue({
  typescriptProviderNeutralExportPaths:
    mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS,
  typescriptBuiltinProviderExportPaths:
    mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS,
  typescriptInlineHelperNames: mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES,
  reservedSurfaceFamilies: mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES,
  reservedEntryPointKinds: mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS,
  builtinProviderExposureTerm: mail_ROOT_PUBLIC_SURFACE_BUILTIN_PROVIDER_EXPOSURE_TERM,
  nonBuiltinProviderExposureTerm: mail_ROOT_PUBLIC_SURFACE_NON_BUILTIN_PROVIDER_EXPOSURE_TERM,
} as const);
