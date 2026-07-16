import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { buildMailSdkMaterializationPlan } from '../bin/materialize-sdk.mjs';
import { assertMailAssemblyWorkspaceBaseline } from '../bin/Mail-standard-assembly-baseline.mjs';
import {
  readJsonFile as readJson,
  resolveMailSdkSdksReadmePath,
  resolveMailSdkWorkspaceRoot,
} from '../bin/Mail-standard-file-helpers.mjs';
import {
  mail_FLUTTER_REQUIRED_STANDARD_FILES,
  mail_ROOT_REQUIRED_CONTRACT_FILES,
  mail_TYPESCRIPT_REQUIRED_STANDARD_FILES,
  mail_TYPESCRIPT_REQUIRED_TEST_FILES,
} from '../bin/Mail-standard-workspace-file-contracts.mjs';
import { getReservedLanguageRootPublicContract } from '../bin/verify-sdk-language-helpers.mjs';
import {
  mail_RUNTIME_SURFACE_METHODS,
  DEFAULT_mail_PROVIDER_KEY,
} from '../bin/Mail-standard-contract-constants.mjs';
import { verifyMailSdkWorkspace } from '../bin/verify-sdk.mjs';

const workspaceRoot = resolveMailSdkWorkspaceRoot(import.meta.url);
const assemblyPath = path.join(workspaceRoot, 'sdk-manifest.json');
const sdksReadmePath = resolveMailSdkSdksReadmePath(import.meta.url);

function joined(parts, separator = '') {
  return parts.join(separator);
}

function retiredTerms() {
  const transportWord = joined(['sign', 'aling']);
  const upperTransportWord = joined(['SIGN', 'ALING']);
  return [
    joined(['sdk', 'call', 'smoke'], '-'),
    joined(['call', 'controller'], '-'),
    joined(['call', 'session'], '-'),
    joined(['app', 'http', 'client'], '-'),
    joined([transportWord, 'Sdk', 'Package']),
    joined([transportWord, 'Sdk', 'ImportPath']),
    joined([transportWord, 'TransportStandard']),
    joined(['mail_', upperTransportWord]),
    joined(['createStandardMail', 'CallControllerStack']),
    joined(['StandardMail', 'CallController']),
  ];
}

test('sdk overview lists sdkwork-mail-sdk workspace', () => {
  const content = readFileSync(sdksReadmePath, 'utf8');
  assert.match(content, /sdkwork-mail-sdk/);
});

test('root, TypeScript, and Flutter mail transport standard files exist', () => {
  for (const relativePath of [
    ...mail_ROOT_REQUIRED_CONTRACT_FILES,
    ...mail_TYPESCRIPT_REQUIRED_STANDARD_FILES,
    ...mail_TYPESCRIPT_REQUIRED_TEST_FILES,
    ...mail_FLUTTER_REQUIRED_STANDARD_FILES,
  ]) {
    assert.equal(existsSync(path.join(workspaceRoot, relativePath)), true, relativePath);
  }
});

test('Mail assembly matches the provider mail transport runtime baseline', () => {
  const assembly = readJson(assemblyPath);
  assertMailAssemblyWorkspaceBaseline(assembly);
  assert.equal(assembly.workspace, 'sdkwork-mail-sdk');
  assert.equal(assembly.defaults.providerKey, DEFAULT_mail_PROVIDER_KEY);
  assert.equal(assembly.runtimeSurfaceStandard.failureCode, 'native_sdk_not_available');
  assert.deepEqual(assembly.runtimeSurfaceStandard.methodTerms, [...mail_RUNTIME_SURFACE_METHODS]);
  assert.equal(Object.hasOwn(assembly, joined([joined(['sign', 'aling']), 'TransportStandard'])), false);

  const executableLanguages = assembly.languages.filter(
    (languageEntry) => languageEntry.runtimeBridge === true,
  );
  assert.deepEqual(
    executableLanguages.map((languageEntry) => languageEntry.language),
    ['typescript', 'flutter'],
  );

  for (const languageEntry of executableLanguages) {
    assert.equal(typeof languageEntry.runtimeBaseline.vendorSdkPackage, 'string');
    assert.equal(typeof languageEntry.runtimeBaseline.vendorSdkImportPath, 'string');
    assert.equal(typeof languageEntry.runtimeBaseline.recommendedEntrypoint, 'string');
    assert.equal(typeof languageEntry.runtimeBaseline.smokeCommand, 'string');
    assert.doesNotMatch(
      languageEntry.runtimeBaseline.vendorSdkPackage,
      /volcengine/i,
      `${languageEntry.language} baseline must not reference volcengine packages`,
    );
  }
});

test('materialized files match the current generator plan', () => {
  for (const entry of buildMailSdkMaterializationPlan(workspaceRoot)) {
    const actual = readFileSync(path.join(workspaceRoot, entry.relativePath), 'utf8');
    assert.equal(actual, entry.content, entry.relativePath);
  }
});

test('materialized markdown docs do not contain trailing whitespace', () => {
  for (const entry of buildMailSdkMaterializationPlan(workspaceRoot)) {
    if (!entry.relativePath.endsWith('.md')) {
      continue;
    }

    const contentLines = entry.content.split(/\r?\n/u);
    for (const [index, contentLine] of contentLines.entries()) {
      assert.equal(/[ \t]+$/u.test(contentLine), false, `${entry.relativePath}:${index + 1}`);
    }
  }
});

test('executable language runtime baselines point at reserved transport provider plugin packages', () => {
  const assembly = readJson(assemblyPath);
  const executableLanguages = assembly.languages.filter(
    (languageEntry) => languageEntry.runtimeBridge === true && languageEntry.runtimeBaseline,
  );

  for (const languageEntry of executableLanguages) {
    if (languageEntry.language === 'typescript') {
      continue;
    }

    const providerPackage = languageEntry.runtimeBaseline.vendorSdkPackage;
    const providerPackageDir = path.join(
      workspaceRoot,
      languageEntry.workspace,
      'providers',
      providerPackage,
    );
    const providerManifestPath = path.join(
      providerPackageDir,
      languageEntry.providerPackageScaffold.manifestFileName,
    );
    const providerSourcePath = path.join(
      providerPackageDir,
      languageEntry.providerPackageScaffold.sourceFilePattern
        .replace('{providerKey}', assembly.defaults.providerKey)
        .replace('{providerPascal}', 'Smtp'),
    );
    const providerRootEntrypointPath = path.join(
      providerPackageDir,
      'lib',
      `${providerPackage}.dart`,
    );

    assert.equal(existsSync(providerManifestPath), true, providerManifestPath);
    assert.equal(existsSync(providerSourcePath), true, providerSourcePath);
    assert.equal(existsSync(providerRootEntrypointPath), true, providerRootEntrypointPath);

    const providerManifest = readFileSync(providerManifestPath, 'utf8');
    const providerSource = readFileSync(providerSourcePath, 'utf8');
    const providerRootEntrypoint = readFileSync(providerRootEntrypointPath, 'utf8');

    assert.match(
      providerManifest,
      /runtimeBridgeStatus:\s*reserved/,
      `${languageEntry.language} transport provider plugin must declare a reserved runtime bridge boundary`,
    );
    assert.match(
      providerManifest,
      /status:\s*future-runtime-bridge-only/,
      `${languageEntry.language} transport provider plugin must remain a package boundary scaffold until bridge lands`,
    );
    assert.doesNotMatch(
      providerManifest,
      /volc_engine_Mail:/,
      `${languageEntry.language} transport provider plugin must not declare retired vendor SDK dependencies`,
    );
    assert.match(
      providerSource,
      /MailProviderSmtpPackageContract|providerKey = 'smtp'/,
      `${languageEntry.language} SMTP provider plugin must expose transport package contract metadata`,
    );
    assert.match(
      providerRootEntrypoint,
      new RegExp(`export 'src/mail_provider_${assembly.defaults.providerKey}_package_contract\\.dart';`, 'u'),
      `${languageEntry.language} SMTP provider plugin must expose a package root import`,
    );
  }
});

test('Flutter provider package loader exposes executable module installation without vendor dependencies', () => {
  const rootPubspec = readFileSync(
    path.join(workspaceRoot, 'sdkwork-mail-sdk-flutter', 'pubspec.yaml'),
    'utf8',
  );
  const rootPubspecOverridesPath = path.join(
    workspaceRoot,
    'sdkwork-mail-sdk-flutter',
    'pubspec_overrides.yaml',
  );
  const loaderSource = readFileSync(
    path.join(workspaceRoot, 'sdkwork-mail-sdk-flutter', 'lib', 'src', 'mail_provider_package_loader.dart'),
    'utf8',
  );

  assert.equal(
    existsSync(rootPubspecOverridesPath),
    false,
    'root Flutter Mail SDK must not carry local dependency overrides; provider/vendor packages belong only to plugins',
  );
  assert.doesNotMatch(
    rootPubspec,
    /volc_engine_Mail:/,
    'root Flutter Mail SDK must remain vendor-free; vendor packages belong only to provider plugins',
  );
  assert.match(loaderSource, /final class MailProviderModule<TNativeClient>/);
  assert.match(loaderSource, /Future<void> installMailProviderPackage<TNativeClient>/);
  assert.match(loaderSource, /manager\.registerAll\(drivers\)/);
  assert.match(loaderSource, /namespace\[packageEntry\.sourceSymbol\]/);
  assert.doesNotMatch(loaderSource, /moduleSymbol/);
  assert.doesNotMatch(loaderSource, /Reserved provider package installer scaffold cannot register/);
});

test('Flutter root analysis stays vendor-free and excludes provider plugin packages', () => {
  const rootAnalysisOptionsPath = path.join(
    workspaceRoot,
    'sdkwork-mail-sdk-flutter',
    'analysis_options.yaml',
  );
  const rootPubspec = readFileSync(
    path.join(workspaceRoot, 'sdkwork-mail-sdk-flutter', 'pubspec.yaml'),
    'utf8',
  );
  const providerPubspec = readFileSync(
    path.join(
      workspaceRoot,
      'sdkwork-mail-sdk-flutter',
      'providers',
      'mail_sdk_provider_smtp',
      'pubspec.yaml',
    ),
    'utf8',
  );

  assert.equal(
    existsSync(rootAnalysisOptionsPath),
    true,
    'root Flutter Mail SDK must exclude provider plugin packages from root analysis',
  );

  const rootAnalysisOptions = readFileSync(rootAnalysisOptionsPath, 'utf8');

  assert.doesNotMatch(rootPubspec, /volc_engine_Mail:/);
  assert.doesNotMatch(providerPubspec, /volc_engine_Mail:/);
  assert.match(rootAnalysisOptions, /exclude:/);
  assert.match(rootAnalysisOptions, /providers\/\*\*/);
});

test('Flutter root public contract is mail transport runtime and provider plugin only', () => {
  const assembly = readJson(assemblyPath);
  const flutterEntry = assembly.languages.find(
    (languageEntry) => languageEntry.language === 'flutter',
  );
  assert.ok(flutterEntry);

  const rootPublicContract = getReservedLanguageRootPublicContract(flutterEntry);
  assert.ok(rootPublicContract);
  assert.equal(rootPublicContract.relativePath, 'lib/mail_sdk.dart');

  const rootPublicSource = readFileSync(
    path.join(workspaceRoot, flutterEntry.workspace, rootPublicContract.relativePath),
    'utf8',
  );
  const actualExportPaths = [...rootPublicSource.matchAll(/^export '([^']+)';$/gmu)].map(
    (match) => match[1],
  );
  const expectedExportPaths = [
    'src/mail_standard_contract.dart',
    'src/mail_errors.dart',
    'src/mail_types.dart',
    'src/mail_provider_metadata.dart',
    'src/mail_client.dart',
    'src/mail_driver.dart',
    'src/mail_runtime_surface.dart',
    'src/mail_runtime_immutability.dart',
    'src/mail_provider_catalog.dart',
    'src/mail_provider_package_catalog.dart',
    'src/mail_provider_activation_catalog.dart',
    'src/mail_capability_catalog.dart',
    'src/mail_provider_extension_catalog.dart',
    'src/mail_language_workspace_catalog.dart',
    'src/mail_provider_selection.dart',
    'src/mail_provider_package_loader.dart',
    'src/mail_provider_support.dart',
    'src/mail_driver_manager.dart',
    'src/mail_data_source.dart',
  ];

  assert.deepEqual(actualExportPaths, expectedExportPaths);
  for (const pattern of rootPublicContract.patterns) {
    assert.doesNotMatch(pattern.source, /call_controller|signaling/u);
    assert.match(rootPublicSource, pattern);
  }
  for (const exportPath of expectedExportPaths) {
    const exportLine = `export '${exportPath}';`;
    assert.equal(
      rootPublicContract.patterns.some((pattern) => pattern.test(exportLine)),
      true,
      `Flutter root public contract must cover ${exportLine}`,
    );
  }
});

test('Flutter runtime surface mirrors mail transport methods', () => {
  const standardContractSource = readFileSync(
    path.join(
      workspaceRoot,
      'sdkwork-mail-sdk-flutter',
      'lib',
      'src',
      'mail_standard_contract.dart',
    ),
    'utf8',
  );
  const clientSource = readFileSync(
    path.join(workspaceRoot, 'sdkwork-mail-sdk-flutter', 'lib', 'src', 'mail_client.dart'),
    'utf8',
  );
  const runtimeSurfaceSource = readFileSync(
    path.join(
      workspaceRoot,
      'sdkwork-mail-sdk-flutter',
      'lib',
      'src',
      'mail_runtime_surface.dart',
    ),
    'utf8',
  );

  for (const methodName of mail_RUNTIME_SURFACE_METHODS) {
    assert.match(standardContractSource, new RegExp(`'${methodName}'`, 'u'));
    assert.match(clientSource, new RegExp(`\\b${methodName}\\s*\\(`, 'u'));
    assert.match(runtimeSurfaceSource, new RegExp(`'${methodName}'`, 'u'));
  }

  assert.doesNotMatch(standardContractSource, /\bjoin\b|\bpublish\b|\bstartScreenShare\b/u);
  assert.match(clientSource, /requireCapability\('transport\.connect'\)/u);
});

test('Flutter language workspace catalog preserves reference provider plugin metadata', () => {
  const languageWorkspaceCatalogSource = readFileSync(
    path.join(
      workspaceRoot,
      'sdkwork-mail-sdk-flutter',
      'lib',
      'src',
      'mail_language_workspace_catalog.dart',
    ),
    'utf8',
  );

  assert.match(languageWorkspaceCatalogSource, /referenceProviderKey:\s*"smtp"/);
  assert.match(languageWorkspaceCatalogSource, /referenceStatus:\s*"package_reference_boundary"/);
  assert.match(languageWorkspaceCatalogSource, /referenceRuntimeBridgeStatus:\s*"reserved"/);
  assert.match(languageWorkspaceCatalogSource, /referenceVendorSdkPackage:\s*"mail_sdk_provider_smtp"/);
  assert.doesNotMatch(languageWorkspaceCatalogSource, /volcengine|volc_engine_Mail/u);
});

test('reserved language workspace catalogs preserve provider scaffold reference fields', () => {
  const assembly = readJson(assemblyPath);
  const languageEntries = assembly.languages.filter(
    (languageEntry) =>
      languageEntry.providerPackageScaffold &&
      languageEntry.language !== 'typescript' &&
      languageEntry.language !== 'flutter' &&
      languageEntry.language !== 'rust',
  );

  const expectedFields = [
    'referenceProviderKey',
    'referenceStatus',
    'referenceRuntimeBridgeStatus',
    'referenceVendorSdkPackage',
    'referenceVendorSdkVersion',
  ];
  const fieldPatternsByLanguage = {
    java: (fieldName) => new RegExp(`\\bString\\s+${fieldName}\\b`, 'u'),
    csharp: (fieldName) => new RegExp(`\\bstring\\?\\s+${fieldName}\\b`, 'u'),
    swift: (fieldName) => new RegExp(`\\blet\\s+${fieldName}:\\s+String\\?`, 'u'),
    kotlin: (fieldName) => new RegExp(`\\bval\\s+${fieldName}:\\s+String\\?`, 'u'),
    go: (fieldName) =>
      new RegExp(`\\b${fieldName[0].toUpperCase()}${fieldName.slice(1)}\\s+\\*string\\b`, 'u'),
    python: (fieldName) => new RegExp(`\\b${fieldName}:\\s+Optional\\[str\\]`, 'u'),
  };

  for (const languageEntry of languageEntries) {
    const languageWorkspaceCatalogSource = readFileSync(
      path.join(workspaceRoot, languageEntry.workspace, languageEntry.workspaceCatalogRelativePath),
      'utf8',
    );
    const fieldPattern = fieldPatternsByLanguage[languageEntry.language];
    assert.equal(typeof fieldPattern, 'function', languageEntry.language);
    for (const expectedField of expectedFields) {
      assert.match(
        languageWorkspaceCatalogSource,
        fieldPattern(expectedField),
        `${languageEntry.language} catalog must expose ${expectedField}`,
      );
    }
  }
});

test('documentation describes mail transport ownership and current runtime guides', () => {
  const rootReadme = readFileSync(path.join(workspaceRoot, 'README.md'), 'utf8');
  const usageGuide = readFileSync(path.join(workspaceRoot, 'docs', 'usage-guide.md'), 'utf8');
  const typescriptGuide = readFileSync(
    path.join(workspaceRoot, 'docs', 'typescript-smtp-runtime-usage.md'),
    'utf8',
  );
  const flutterGuide = readFileSync(
    path.join(workspaceRoot, 'docs', 'flutter-smtp-runtime-usage.md'),
    'utf8',
  );

  assert.match(rootReadme, /provider-standard Mail transport/i);
  assert.match(rootReadme, /Business conversation delivery/i);
  assert.match(usageGuide, /IM owns business lifecycle and realtime business delivery/i);
  assert.match(usageGuide, /typescript-smtp-runtime-usage\.md/);
  assert.match(usageGuide, /flutter-smtp-runtime-usage\.md/);
  assert.match(typescriptGuide, /installMailProviderPackage/);
  assert.match(typescriptGuide, /MailDataSource/);
  assert.match(flutterGuide, /MailDataSource/);

  for (const content of [rootReadme, usageGuide, typescriptGuide, flutterGuide]) {
    for (const term of retiredTerms()) {
      assert.equal(content.includes(term), false, term);
    }
    assert.doesNotMatch(content, /volcengine|join\(\)|publish\(/iu);
  }
});

test('TypeScript public export graph follows the assembly root-public surface', () => {
  const assembly = readJson(assemblyPath);
  const indexContent = readFileSync(
    path.join(workspaceRoot, 'sdkwork-mail-sdk-typescript', 'src', 'index.ts'),
    'utf8',
  );
  const expectedExports = [
    ...assembly.rootPublicSurfaceStandard.typescriptProviderNeutralExportPaths,
    ...assembly.rootPublicSurfaceStandard.typescriptBuiltinProviderExportPaths,
  ];
  const actualExports = [...indexContent.matchAll(/export \* from '([^']+)';/gu)].map(
    (match) => match[1],
  );

  assert.deepEqual(actualExports, expectedExports);
  for (const helperName of assembly.rootPublicSurfaceStandard.typescriptInlineHelperNames) {
    assert.match(indexContent, new RegExp(`export function ${helperName}\\s*\\(`, 'u'));
  }
  assert.equal(indexContent.includes('createBuiltinMailDriverManager'), false);
  assert.equal(indexContent.includes('./providers/'), false);
});

test('root verifier accepts the current mail transport SDK boundary', () => {
  assert.doesNotThrow(() => verifyMailSdkWorkspace(workspaceRoot));
});

test('root verifier module can be imported as an ESM boundary', async () => {
  const module = await import(pathToFileURL(path.join(workspaceRoot, 'bin', 'verify-sdk.mjs')).href);
  assert.equal(typeof module.verifyMailSdkWorkspace, 'function');
});
