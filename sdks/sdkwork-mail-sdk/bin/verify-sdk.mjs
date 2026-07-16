#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildMailSdkMaterializationPlan } from './materialize-sdk.mjs';
import { assertMailAssemblyWorkspaceBaseline } from './Mail-standard-assembly-baseline.mjs';
import { readJsonFile, resolveMailSdkWorkspaceRoot } from './Mail-standard-file-helpers.mjs';
import {
  mail_FLUTTER_REQUIRED_STANDARD_FILES,
  mail_ROOT_REQUIRED_CONTRACT_FILES,
  mail_TYPESCRIPT_REQUIRED_STANDARD_FILES,
  mail_TYPESCRIPT_REQUIRED_TEST_FILES,
} from './Mail-standard-workspace-file-contracts.mjs';

function fail(message) {
  throw new Error(message);
}

function joined(parts, separator = '') {
  return parts.join(separator);
}

function buildRetiredTerms() {
  const transportWord = joined(['sign', 'aling']);
  const upperTransportWord = joined(['SIGN', 'ALING']);
  const callController = joined(['call', 'controller'], '-');
  const callSession = joined(['call', 'session'], '-');

  return [
    joined(['sdk', 'call', 'smoke'], '-'),
    callController,
    callSession,
    joined(['app', 'http', 'client'], '-'),
    joined([transportWord, 'Sdk', 'Package']),
    joined([transportWord, 'Sdk', 'ImportPath']),
    joined([transportWord, 'TransportStandard']),
    joined(['mail_', upperTransportWord]),
    joined(['createStandardMail', 'CallControllerStack']),
    joined(['StandardMail', 'CallController']),
    joined(['Mail', 'Call', transportWord[0].toUpperCase(), transportWord.slice(1), 'Adapter']),
    joined(['Mail', transportWord[0].toUpperCase(), transportWord.slice(1), 'TransportLike']),
    joined(['createMail', 'App', 'Http', 'Client']),
  ];
}

function buildRetiredFiles() {
  const transportWord = joined(['sign', 'aling']);
  const underscoreTransport = joined(['Mail', transportWord], '_');
  const callController = joined(['call', 'controller'], '-');
  const callSession = joined(['call', 'session'], '-');
  const callSmoke = joined(['sdk', 'call', 'smoke'], '-');

  return [
    `bin/${callSmoke}.mjs`,
    `bin/${callSmoke}.ps1`,
    `bin/${callSmoke}.sh`,
    `bin/Mail-${callSmoke}-standard.mjs`,
    `bin/verify-flutter-Mail-${transportWord}-boundary.mjs`,
    'bin/verify-flutter-typescript-parity.mjs',
    'docs/typescript-volcengine-runtime-usage.md',
    'docs/flutter-volcengine-runtime-usage.md',
    `docs/typescript-volcengine-${transportWord}-usage.md`,
    `docs/flutter-volcengine-${transportWord}-usage.md`,
    `sdkwork-mail-sdk-typescript/bin/${callSmoke}.mjs`,
    `sdkwork-mail-sdk-typescript/bin/${callSmoke}.ps1`,
    `sdkwork-mail-sdk-typescript/bin/${callSmoke}.sh`,
    `sdkwork-mail-sdk-typescript/src/${callController}.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-contract.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-core.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-emission.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-lifecycle.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-message.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-models.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-state.ts`,
    `sdkwork-mail-sdk-typescript/src/${callController}-subscription.ts`,
    `sdkwork-mail-sdk-typescript/src/${callSession}.ts`,
    'sdkwork-mail-sdk-typescript/src/call-types.ts',
    'sdkwork-mail-sdk-typescript/src/builtin-driver-manager.ts',
    'sdkwork-mail-sdk-typescript/src/volcengine-official-web.ts',
    'sdkwork-mail-sdk-typescript/src/providers/agora.ts',
    'sdkwork-mail-sdk-typescript/src/providers/aliyun.ts',
    'sdkwork-mail-sdk-typescript/src/providers/index.ts',
    'sdkwork-mail-sdk-typescript/src/providers/janus.ts',
    'sdkwork-mail-sdk-typescript/src/providers/jitsi.ts',
    'sdkwork-mail-sdk-typescript/src/providers/livekit.ts',
    'sdkwork-mail-sdk-typescript/src/providers/mediasoup.ts',
    'sdkwork-mail-sdk-typescript/src/providers/tencent.ts',
    'sdkwork-mail-sdk-typescript/src/providers/twilio.ts',
    'sdkwork-mail-sdk-typescript/src/providers/volcengine.ts',
    'sdkwork-mail-sdk-typescript/src/providers/zego.ts',
    `sdkwork-mail-sdk-typescript/src/${joined(['app', 'http', 'client'], '-')}.ts`,
    `sdkwork-mail-sdk-typescript/src/${transportWord}-adapter.ts`,
    `sdkwork-mail-sdk-typescript/src/${transportWord}-transport.ts`,
    'sdkwork-mail-sdk-typescript/src/standard-call-stack.ts',
    `sdkwork-mail-sdk-typescript/test/${callController}.test.mjs`,
    `sdkwork-mail-sdk-typescript/test/Mail-call-smoke-cli.test.mjs`,
    `sdkwork-mail-sdk-typescript/test/Mail-${transportWord}-${callSession}.test.mjs`,
    `sdkwork-mail-sdk-typescript/test/${transportWord}-adapter.test.mjs`,
    `sdkwork-mail-sdk-typescript/test/${transportWord}-transport.test.mjs`,
    'sdkwork-mail-sdk-typescript/test/standard-call-stack.test.mjs',
    `sdkwork-mail-sdk-flutter/bin/${callSmoke}.mjs`,
    `sdkwork-mail-sdk-flutter/bin/${callSmoke}.dart`,
    `sdkwork-mail-sdk-flutter/bin/${callSmoke}.ps1`,
    `sdkwork-mail-sdk-flutter/bin/${callSmoke}.sh`,
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller_contract.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller_emission.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller_lifecycle.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller_message.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller_models.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller_state.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_controller_subscription.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_session.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_call_types.dart',
    'sdkwork-mail-sdk-flutter/lib/src/mail_builtin_driver_manager.dart',
    'sdkwork-mail-sdk-flutter/lib/src/volcengine_official_flutter.dart',
    'sdkwork-mail-sdk-flutter/lib/src/providers/volcengine.dart',
    'sdkwork-mail-sdk-flutter/lib/mail_sdk_extensions.dart',
    'sdkwork-mail-sdk-flutter/pubspec_overrides.yaml',
    `sdkwork-mail-sdk-flutter/lib/src/${underscoreTransport}_adapter.dart`,
    `sdkwork-mail-sdk-flutter/lib/src/${underscoreTransport}_codec.dart`,
    `sdkwork-mail-sdk-flutter/lib/src/${underscoreTransport}_message.dart`,
    `sdkwork-mail-sdk-flutter/lib/src/${underscoreTransport}_protocol.dart`,
    `sdkwork-mail-sdk-flutter/lib/src/${underscoreTransport}_transport.dart`,
    'sdkwork-mail-sdk-flutter/lib/src/mail_standard_call_stack.dart',
    `sdkwork-mail-sdk-flutter/test/${underscoreTransport}_transport_test.dart`,
    `sdkwork-mail-sdk-flutter/test/${underscoreTransport}_adapter_test.dart`,
    'sdkwork-mail-sdk-flutter/test/mail_call_smoke_cli_test.dart',
    'sdkwork-mail-sdk-flutter/test/mail_call_smoke_test.dart',
  ];
}

function assertFilesExist(workspaceRoot, relativePaths, label) {
  for (const relativePath of relativePaths) {
    if (!existsSync(path.join(workspaceRoot, relativePath))) {
      fail(`Missing required ${label} file: ${relativePath}`);
    }
  }
}

function assertFilesAbsent(workspaceRoot, relativePaths) {
  for (const relativePath of relativePaths) {
    if (existsSync(path.join(workspaceRoot, relativePath))) {
      fail(`Retired Mail SDK boundary file must not exist: ${relativePath}`);
    }
  }
}

function shouldSkipDirectory(entryPath) {
  const normalized = entryPath.replace(/\\/gu, '/');
  return [
    '/node_modules',
    '/dist',
    '/target',
    '/.dart_tool',
    '/build',
    '/.build',
    '/bin/',
    '/obj/',
    '/__pycache__',
  ].some((segment) => normalized.includes(segment));
}

function collectFiles(directory, bucket) {
  if (!existsSync(directory)) {
    return;
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!shouldSkipDirectory(entryPath)) {
        collectFiles(entryPath, bucket);
      }
      continue;
    }

    bucket.push(entryPath);
  }
}

function assertNoRetiredTerms(workspaceRoot) {
  const terms = buildRetiredTerms();
  const files = [];
  for (const relativeRoot of [
    'test',
    'docs',
    'README.md',
    'sdkwork-mail-sdk-typescript',
    'sdkwork-mail-sdk-flutter',
  ]) {
    const rootPath = path.join(workspaceRoot, relativeRoot);
    if (existsSync(rootPath) && !readdirSync(workspaceRoot, { withFileTypes: true }).length) {
      continue;
    }
    if (relativeRoot.endsWith('.md')) {
      files.push(rootPath);
      continue;
    }
    collectFiles(rootPath, files);
  }

  for (const filePath of files) {
    if (!existsSync(filePath)) {
      continue;
    }
    const relativePath = path.relative(workspaceRoot, filePath).replace(/\\/gu, '/');
    if (
      relativePath === 'test/verify-sdk-automation.test.mjs' ||
      relativePath === 'sdkwork-mail-sdk-typescript/test/public-api-boundary.test.mjs'
    ) {
      continue;
    }
    const content = readFileSync(filePath, 'utf8');
    for (const term of terms) {
      if (content.includes(term)) {
        fail(`Retired Mail SDK boundary term "${term}" found in ${relativePath}`);
      }
    }
  }
}

function assertAssembly(assembly) {
  assertMailAssemblyWorkspaceBaseline(assembly);

  const retiredTopLevelKeys = [
    joined([joined(['sign', 'aling']), 'TransportStandard']),
  ];
  for (const key of retiredTopLevelKeys) {
    if (Object.hasOwn(assembly, key)) {
      fail(`Assembly must not declare retired Mail SDK field: ${key}`);
    }
  }

  for (const languageEntry of assembly.languages ?? []) {
    const runtimeBaseline = languageEntry.runtimeBaseline;
    if (!runtimeBaseline) {
      continue;
    }

    for (const key of [
      joined([joined(['sign', 'aling']), 'Sdk', 'Package']),
      joined([joined(['sign', 'aling']), 'Sdk', 'ImportPath']),
    ]) {
      if (Object.hasOwn(runtimeBaseline, key)) {
        fail(`runtimeBaseline for ${languageEntry.language} must not declare retired field: ${key}`);
      }
    }
  }
}

function assertMaterializedFilesCurrent(workspaceRoot) {
  for (const entry of buildMailSdkMaterializationPlan(workspaceRoot)) {
    const filePath = path.join(workspaceRoot, entry.relativePath);
    if (!existsSync(filePath)) {
      fail(`Materialized asset is missing: ${entry.relativePath}`);
    }

    const actualContent = readFileSync(filePath, 'utf8');
    if (actualContent !== entry.content) {
      fail(`Materialized asset drift detected: ${entry.relativePath}`);
    }
  }
}

function assertTypeScriptPublicSurface(workspaceRoot, assembly) {
  const indexPath = path.join(workspaceRoot, 'sdkwork-mail-sdk-typescript', 'src', 'index.ts');
  const indexContent = readFileSync(indexPath, 'utf8');
  const expectedExports = [
    ...assembly.rootPublicSurfaceStandard.typescriptProviderNeutralExportPaths,
    ...assembly.rootPublicSurfaceStandard.typescriptBuiltinProviderExportPaths,
  ];
  const actualExports = [...indexContent.matchAll(/export \* from '([^']+)';/gu)].map(
    (match) => match[1],
  );

  if (JSON.stringify(actualExports) !== JSON.stringify(expectedExports)) {
    fail('TypeScript root export graph must exactly match rootPublicSurfaceStandard');
  }

  for (const helperName of assembly.rootPublicSurfaceStandard.typescriptInlineHelperNames) {
    const helperPattern = new RegExp(`export function ${helperName}\\s*\\(`, 'u');
    if (!helperPattern.test(indexContent)) {
      fail(`TypeScript root inline helper missing: ${helperName}`);
    }
  }
}

function assertRuntimeDocs(workspaceRoot) {
  const usageGuide = readFileSync(path.join(workspaceRoot, 'docs', 'usage-guide.md'), 'utf8');
  const typescriptGuide = readFileSync(
    path.join(workspaceRoot, 'docs', 'typescript-smtp-runtime-usage.md'),
    'utf8',
  );
  const flutterGuide = readFileSync(
    path.join(workspaceRoot, 'docs', 'flutter-smtp-runtime-usage.md'),
    'utf8',
  );

  for (const [label, content] of [
    ['usage guide', usageGuide],
    ['TypeScript runtime guide', typescriptGuide],
    ['Flutter runtime guide', flutterGuide],
  ]) {
    for (const term of ['mail transport', 'provider', 'smtp']) {
      if (!content.toLowerCase().includes(term)) {
        fail(`${label} must describe ${term}`);
      }
    }
  }

  if (!typescriptGuide.includes('installMailProviderPackage')) {
    fail('TypeScript runtime guide must use the provider package installer entrypoint');
  }

  if (!flutterGuide.includes('MailDataSource')) {
    fail('Flutter runtime guide must use the mail transport data source entrypoint');
  }
}

export function verifyMailSdkWorkspace(workspaceRoot) {
  const assembly = readJsonFile(path.join(workspaceRoot, 'sdk-manifest.json'));
  assertAssembly(assembly);
  assertFilesExist(workspaceRoot, mail_ROOT_REQUIRED_CONTRACT_FILES, 'root contract');
  assertFilesExist(workspaceRoot, mail_TYPESCRIPT_REQUIRED_STANDARD_FILES, 'TypeScript standard');
  assertFilesExist(workspaceRoot, mail_TYPESCRIPT_REQUIRED_TEST_FILES, 'TypeScript test');
  assertFilesExist(workspaceRoot, mail_FLUTTER_REQUIRED_STANDARD_FILES, 'Flutter standard');
  assertFilesAbsent(workspaceRoot, buildRetiredFiles());
  assertRuntimeDocs(workspaceRoot);
  assertTypeScriptPublicSurface(workspaceRoot, assembly);
  assertMaterializedFilesCurrent(workspaceRoot);
  assertNoRetiredTerms(workspaceRoot);
}

const workspaceRoot = resolveMailSdkWorkspaceRoot(import.meta.url);
const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
const isCliEntry = invokedPath === import.meta.url;

if (isCliEntry) {
  try {
    verifyMailSdkWorkspace(workspaceRoot);
    console.log('[sdkwork-mail-sdk] verification passed');
  } catch (error) {
    console.error(`[sdkwork-mail-sdk] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
