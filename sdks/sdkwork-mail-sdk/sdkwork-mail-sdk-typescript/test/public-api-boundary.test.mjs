import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

async function loadSdk() {
  return import('../dist/index.js');
}

function readPackageJson() {
  return JSON.parse(readFileSync(path.resolve('package.json'), 'utf8'));
}

function joined(parts, separator = '') {
  return parts.join(separator);
}

function retiredRootExports() {
  const transportWord = joined(['SIGN', 'ALING']);
  const transportLower = transportWord.toLowerCase();

  return [
    joined(['mail_', transportWord, '_TRANSPORT_STANDARD']),
    joined(['mail_', transportWord, '_TRANSPORT_TERM']),
    joined(['createStandardMail', 'CallStack']),
    joined(['createStandardMail', 'CallController']),
    joined(['createStandardMail', 'CallControllerStack']),
    joined(['createMail', 'App', 'Http', 'Client']),
    joined(['createMail', transportLower[0].toUpperCase(), transportLower.slice(1), 'Adapter']),
    joined(['StandardMail', 'CallSession']),
    joined(['StandardMail', 'CallController']),
    joined(['DEFAULT_mail_', 'CALL', '_SUBSCRIBE_', transportWord, 'S']),
    joined(['mail_', 'CALL', '_INVITE_', transportWord, '_TYPE']),
    joined(['mail_', 'CALL', '_ACCEPTED_', transportWord, '_TYPE']),
  ];
}

const ROOT_NEUTRAL_EXPORT_PATHS = [
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
];

const FORBIDDEN_ROOT_PROVIDER_EXPORTS = [
  'createBuiltinMailDriverManager',
  'getBuiltinMailProviderModules',
  'getOfficialMailProviderModules',
  'createSmtpMailDriver',
  'createImapMailDriver',
  'SMTP_mail_PROVIDER_MODULE',
  'IMAP_mail_PROVIDER_MODULE',
];

test('root public API exposes provider-neutral Mail contracts and plugin SPI only', async () => {
  const sdk = await loadSdk();

  assert.equal(typeof sdk.MailDriverManager, 'function');
  assert.equal(typeof sdk.MailDataSource, 'function');
  assert.equal(typeof sdk.createMailProviderDriver, 'function');
  assert.equal(typeof sdk.createMailProviderModule, 'function');
  assert.equal(typeof sdk.registerMailProviderModule, 'function');
  assert.equal(typeof sdk.registerMailProviderModules, 'function');
  assert.equal(typeof sdk.createMailProviderPackageLoader, 'function');
  assert.equal(typeof sdk.resolveMailProviderPackageLoadTarget, 'function');
  assert.equal(typeof sdk.loadMailProviderModule, 'function');
  assert.equal(typeof sdk.installMailProviderPackage, 'function');
  assert.equal(typeof sdk.installMailProviderPackages, 'function');

  assert.equal(typeof sdk.resolveMailProviderSelection, 'function');
  assert.equal(typeof sdk.parseMailProviderUrl, 'function');
  assert.equal(typeof sdk.resolveMailCapabilityNegotiationStatus, 'function');
  assert.equal(typeof sdk.resolveMailProviderSupportStatus, 'function');
  assert.equal(typeof sdk.createMailProviderSupportState, 'function');
  assert.equal(typeof sdk.MailSdkException, 'function');

  assert.equal(typeof sdk.getMailProviderByProviderKey, 'function');
  assert.equal(typeof sdk.getBuiltinMailProviderMetadata, 'function');
  assert.equal(typeof sdk.getBuiltinMailProviderMetadataByKey, 'function');
  assert.equal(typeof sdk.getOfficialMailProviderMetadata, 'function');
  assert.equal(typeof sdk.getOfficialMailProviderMetadataByKey, 'function');
  assert.equal(typeof sdk.getMailLanguageWorkspaceCatalog, 'function');
  assert.equal(typeof sdk.getMailLanguageWorkspaceByLanguage, 'function');
  assert.equal(typeof sdk.getMailLanguageWorkspace, 'function');
  assert.equal(typeof sdk.getMailProviderPackageCatalog, 'function');
  assert.equal(typeof sdk.getMailProviderPackageByProviderKey, 'function');
  assert.equal(typeof sdk.getMailProviderPackageByPackageIdentity, 'function');
  assert.equal(typeof sdk.getMailProviderPackage, 'function');
  assert.equal(typeof sdk.getMailProviderActivationCatalog, 'function');
  assert.equal(typeof sdk.getMailProviderActivationByProviderKey, 'function');
  assert.equal(typeof sdk.getMailProviderActivation, 'function');

  assert.deepEqual(sdk.mail_SDK_ERROR_CODES, [
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
  assert.deepEqual(sdk.mail_RUNTIME_SURFACE_METHODS, [
    'connectTransport',
    'authenticateTransport',
    'disconnectTransport',
    'sendMail',
    'probeMailbox',
    'syncMailbox',
    'healthCheck',
  ]);
  assert.deepEqual(sdk.mail_RUNTIME_IMMUTABILITY_STANDARD, {
    frozenTerm: 'runtime-frozen',
    snapshotTerm: 'immutable-snapshots',
    controllerContextTerm: 'shallow-immutable-context',
    nativeClientTerm: 'mutable-native-client',
  });
  assert.deepEqual(sdk.mail_ROOT_PUBLIC_SURFACE_STANDARD, {
    typescriptProviderNeutralExportPaths: ROOT_NEUTRAL_EXPORT_PATHS,
    typescriptBuiltinProviderExportPaths: [],
    typescriptInlineHelperNames: [],
    reservedSurfaceFamilies: [
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
    ],
    reservedEntryPointKinds: {
      flutter: 'barrel',
      python: 'package-init',
    },
    builtinProviderExposureTerm: 'provider-plugin-package-only',
    nonBuiltinProviderExposureTerm: 'package-boundary-only',
  });

  assert.deepEqual(
    sdk.mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS,
    ROOT_NEUTRAL_EXPORT_PATHS,
  );
  assert.deepEqual(sdk.mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS, []);
  assert.deepEqual(sdk.mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES, []);
  assert.equal(
    sdk.mail_ROOT_PUBLIC_SURFACE_BUILTIN_PROVIDER_EXPOSURE_TERM,
    'provider-plugin-package-only',
  );
  assert.equal(
    sdk.mail_ROOT_PUBLIC_SURFACE_NON_BUILTIN_PROVIDER_EXPOSURE_TERM,
    'package-boundary-only',
  );
  assert.equal(Object.isFrozen(sdk.mail_ROOT_PUBLIC_SURFACE_STANDARD), true);
  assert.equal(Object.isFrozen(sdk.mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES), true);
  assert.equal(sdk.DEFAULT_mail_PROVIDER_KEY, 'smtp');
  assert.equal(sdk.DEFAULT_mail_PROVIDER_PLUGIN_ID, 'Mail-smtp');
  assert.equal(sdk.DEFAULT_mail_PROVIDER_DRIVER_ID, 'sdkwork-mail-driver-smtp');

  for (const retiredExport of retiredRootExports()) {
    assert.equal(retiredExport in sdk, false, `${retiredExport} must be owned by IM, not Mail`);
  }
});

test('root package does not export provider implementations or vendor dependencies', async () => {
  const sdk = await loadSdk();
  const packageJson = readPackageJson();

  for (const exportName of FORBIDDEN_ROOT_PROVIDER_EXPORTS) {
    assert.equal(exportName in sdk, false, `${exportName} must live in a provider plugin package`);
  }

  assert.deepEqual(Object.keys(packageJson.exports), ['.']);
  assert.equal(packageJson.peerDependencies?.['@volcengine/Mail'], undefined);
  assert.equal(packageJson.dependencies?.['@volcengine/Mail'], undefined);
  assert.equal(packageJson.optionalDependencies?.['@volcengine/Mail'], undefined);
});
