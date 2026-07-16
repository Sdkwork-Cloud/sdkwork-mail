#!/usr/bin/env node
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  assertMailAssemblyWorkspaceBaseline,
  getMailExecutableLanguageEntries,
  getMailExecutableLanguageEntriesBySmokeMode,
} from './Mail-standard-assembly-baseline.mjs';
import {
  readJsonFile,
  readUtf8File,
  resolveMailSdkWorkspaceRoot,
  writeUtf8File,
} from './Mail-standard-file-helpers.mjs';
import {
  buildReservedLanguageMaterializationPlan,
} from './materialize-sdk-reserved-scaffolds.mjs';
import { mail_TEMPLATE_MATERIALIZATION_ASSETS } from './materialize-sdk-template-assets.mjs';
import {
  DEFAULT_mail_PROVIDER_KEY,
  DEFAULT_TYPESCRIPT_ADAPTER_CONTRACT,
  mail_PROVIDER_ACTIVATION_STATUSES as PROVIDER_ACTIVATION_STATUSES,
} from './Mail-standard-contract-constants.mjs';
import {
  buildLanguageProviderActivationCatalogEntries,
  describeProviderActivationStatus,
  materializeProviderPackagePattern,
  toPascalCase,
  toUpperSnakeCase,
} from './Mail-standard-shared-helpers.mjs';
import { REQUIRED_TYPESCRIPT_PROVIDER_PACKAGE_BOUNDARY_STATUS_TERMS } from './verify-sdk-standard-constants.mjs';

export const mail_SDK_STALE_MATERIALIZED_FILES = [
  'docs/typescript-volcengine-runtime-usage.md',
  'docs/flutter-volcengine-runtime-usage.md',
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
  'sdkwork-mail-sdk-flutter/lib/src/mail_builtin_driver_manager.dart',
  'sdkwork-mail-sdk-flutter/lib/src/volcengine_official_flutter.dart',
  'sdkwork-mail-sdk-flutter/lib/src/providers/volcengine.dart',
  'sdkwork-mail-sdk-flutter/lib/mail_sdk_extensions.dart',
  'sdkwork-mail-sdk-flutter/pubspec_overrides.yaml',
];

function readMaterializedTemplate(workspaceRoot, relativePath) {
  return readUtf8File(path.join(workspaceRoot, 'bin', 'templates', relativePath));
}

function lines(value) {
  return `${value.trim()}\n`;
}

function renderStringLiteral(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function renderReadonlyStringArray(values) {
  return `[${values.map((value) => renderStringLiteral(value)).join(', ')}] as const`;
}

function renderReadonlyStringRecord(entries) {
  return `{
${Object.entries(entries ?? {})
    .map(([key, value]) => `  ${JSON.stringify(key)}: ${renderStringLiteral(value)},`)
    .join('\n')}
}`;
}

function renderMarkdownCodeList(values) {
  const items = (values ?? []).map((value) => `\`${value}\``);
  if (items.length === 0) {
    return '`none`';
  }

  return items.join(', ');
}

function renderMarkdownCodeNaturalList(values) {
  const items = (values ?? []).filter(Boolean).map((value) => `\`${value}\``);
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function renderNaturalLanguageList(values) {
  const items = (values ?? []).filter(Boolean);
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function getExecutableRuntimeLanguageEntries(assembly) {
  return getMailExecutableLanguageEntries(assembly).filter((languageEntry) => languageEntry.runtimeBaseline);
}

function getExecutableLanguageRuntimeDocumentation(languageEntry) {
  if (!languageEntry.runtimeDocumentation) {
    throw new Error(
      `Executable language ${languageEntry.language} must declare runtimeDocumentation metadata`,
    );
  }

  return languageEntry.runtimeDocumentation;
}

function renderExecutableLandingSummary(assembly) {
  const executableDisplayNames = getExecutableRuntimeLanguageEntries(assembly).map(
    (languageEntry) => languageEntry.displayName,
  );

  if (executableDisplayNames.length === 0) {
    return 'No executable reference baselines are declared in the current landing.';
  }

  if (executableDisplayNames.length === 1) {
    return `${executableDisplayNames[0]} is the executable reference baseline in the current landing.`;
  }

  return `${renderNaturalLanguageList(executableDisplayNames)} are the executable reference baselines in the current landing.`;
}

function renderTemplateExecutableTargetsSummary(assembly) {
  const executableLanguages = getExecutableRuntimeLanguageEntries(assembly).map(
    (languageEntry) => languageEntry.language,
  );

  if (executableLanguages.length === 0) {
    return 'Current implemented targets are assembly-governed and no executable language baseline is declared yet.';
  }

  const languageSummary = renderMarkdownCodeNaturalList(executableLanguages);
  if (executableLanguages.length === 1) {
    return `Current implemented target is ${languageSummary}. Runtime smoke is executed from that workspace-owned command.`;
  }

  return `Current implemented targets are ${languageSummary}. Runtime smoke is executed from each workspace-owned command.`;
}

function renderRootRuntimeSmokeCommand(languageEntry) {
  const command = String(languageEntry.runtimeBaseline?.smokeCommand ?? '').trim();
  if (!command) {
    return '';
  }

  return `cd .\\${languageEntry.workspace.replace(/\//gu, '\\')} && ${command}`;
}

function renderTemplateFastRuntimeSmokeCommands(assembly) {
  return getExecutableRuntimeLanguageEntries(assembly)
    .map(renderRootRuntimeSmokeCommand)
    .filter(Boolean)
    .join('\n');
}

function renderTemplateRequiredRuntimeSmokeSteps(assembly) {
  const requiredEntries = getMailExecutableLanguageEntriesBySmokeMode(assembly, 'runtime-backed');
  if (requiredEntries.length === 0) {
    return '- none currently declared in assembly';
  }

  return requiredEntries
    .map((languageEntry) => `- \`${renderRootRuntimeSmokeCommand(languageEntry)}\``)
    .join('\n');
}

function renderTemplateOptionalRuntimeSmokeSteps(assembly) {
  const optionalEntries = getMailExecutableLanguageEntriesBySmokeMode(assembly, 'analysis-backed');
  if (optionalEntries.length === 0) {
    return '- none currently declared in assembly';
  }

  return optionalEntries
    .map((languageEntry) => `- \`${renderRootRuntimeSmokeCommand(languageEntry)}\``)
    .join('\n');
}

function renderUsageGuideLocalVerificationCommands(assembly) {
  const commandLines = [
    'node .\\bin\\materialize-sdk.mjs',
    'node .\\test\\verify-sdk-automation.test.mjs',
    'node .\\bin\\verify-sdk.mjs',
    ...getExecutableRuntimeLanguageEntries(assembly).map(renderRootRuntimeSmokeCommand),
    'node .\\bin\\smoke-sdk.mjs',
  ];

  return commandLines.filter(Boolean).join('\n');
}

function renderUsageGuideAdoptionGuidance(assembly) {
  const guideBullets = getExecutableRuntimeLanguageEntries(assembly)
    .map((languageEntry) => {
      const guide = renderUsageGuideDetailedGuide(languageEntry);
      if (!guide) {
        return null;
      }

      return `- if you need the ${guide.runtimeLabel} baseline, start from
  [\`${guide.label}\`](${guide.path})`;
    })
    .filter(Boolean)
    .join('\n');

  return `${guideBullets}
- if you need to understand the cross-language standard and provider package boundary model, read
  [\`docs/package-standards.md\`](./package-standards.md) and
  [\`docs/provider-adapter-standard.md\`](./provider-adapter-standard.md)`;
}

function renderMaterializedTemplateContent(workspaceRoot, templateRelativePath, assembly) {
  const templateContent = readMaterializedTemplate(workspaceRoot, templateRelativePath);
  const replacements = new Map([
    ['{{mail_EXECUTABLE_TARGETS_SUMMARY}}', renderTemplateExecutableTargetsSummary(assembly)],
    ['{{mail_FAST_RUNTIME_SMOKE_COMMANDS}}', renderTemplateFastRuntimeSmokeCommands(assembly)],
    ['{{mail_REQUIRED_RUNTIME_SMOKE_STEPS}}', renderTemplateRequiredRuntimeSmokeSteps(assembly)],
    ['{{mail_OPTIONAL_RUNTIME_SMOKE_STEPS}}', renderTemplateOptionalRuntimeSmokeSteps(assembly)],
  ]);

  let materializedContent = templateContent;
  for (const [token, value] of replacements.entries()) {
    materializedContent = materializedContent.split(token).join(value);
  }

  return materializedContent;
}

function renderUsageGuideSelectionSourceLabel(source) {
  switch (source) {
    case 'provider_url':
      return 'providerUrl';
    case 'provider_key':
      return 'providerKey';
    case 'tenant_override':
      return 'tenantOverrideProviderKey';
    case 'deployment_profile':
      return 'deploymentProfileProviderKey';
    case 'default_provider':
      return 'defaultProvider';
    default:
      return source;
  }
}

function renderUsageGuideProviderRole(provider, assembly) {
  const defaultProviderKey = assembly.defaults?.providerKey ?? DEFAULT_mail_PROVIDER_KEY;
  const executableLanguageDisplays = getExecutableRuntimeLanguageEntries(assembly).map(
    (languageEntry) => languageEntry.displayName,
  );

  if (provider.providerKey === defaultProviderKey) {
    return `default provider and current runnable baseline across ${renderMarkdownCodeNaturalList(executableLanguageDisplays)} executable workspaces`;
  }

  if (provider.builtin) {
    return 'official builtin catalog entry; runtime activation remains language-matrix driven';
  }

  if (provider.tier === 'tier-b') {
    return 'official package-boundary target';
  }

  return 'future SPI target';
}

function renderUsageGuideProviderRows(assembly) {
  return (assembly.providers ?? [])
    .map(
      (provider) =>
        `| \`${provider.providerKey}\` | ${provider.displayName} | \`${provider.tier}\` | \`${provider.builtin}\` | ${renderUsageGuideProviderRole(provider, assembly)} |`,
    )
    .join('\n');
}

function renderUsageGuideLanguageRows(assembly) {
  return (assembly.languages ?? [])
    .map(
      (languageEntry) =>
        `| ${languageEntry.displayName} | \`${languageEntry.workspace}\` | \`${languageEntry.publicPackage}\` | \`${languageEntry.maturityTier}\` | ${languageEntry.runtimeBridge ? 'yes' : 'no'} | ${languageEntry.currentRole} |`,
    )
    .join('\n');
}

function renderUsageGuideExecutableLanguageConclusion(languageEntry) {
  return getExecutableLanguageRuntimeDocumentation(languageEntry).baselineConclusion;
}

function renderUsageGuideDetailedGuide(languageEntry) {
  const runtimeDocumentation = getExecutableLanguageRuntimeDocumentation(languageEntry);

  return {
    title: runtimeDocumentation.guideTitle,
    path: runtimeDocumentation.detailedGuidePath,
    label: runtimeDocumentation.detailedGuideLabel,
    runtimeLabel: runtimeDocumentation.runtimeLabel,
  };
}

function renderUsageGuideExecutableRuntimeLabels(assembly) {
  return getExecutableRuntimeLanguageEntries(assembly).map(
    (languageEntry) => renderUsageGuideDetailedGuide(languageEntry).runtimeLabel,
  );
}

function renderUsageGuideExecutableBaselineSection(languageEntry, assembly) {
  if (!languageEntry.runtimeBaseline) {
    return '';
  }

  const guide = renderUsageGuideDetailedGuide(languageEntry);
  const defaultProviderKey =
    languageEntry.defaultProviderContract?.providerKey ??
    assembly.defaults?.providerKey ??
    DEFAULT_mail_PROVIDER_KEY;

  return lines(`
### ${guide.title}

${renderUsageGuideExecutableLanguageConclusion(languageEntry)}

The current ${guide.runtimeLabel} runtime path is:

- standard package: \`${languageEntry.publicPackage}\`
- default provider: \`${defaultProviderKey}\`
- vendor SDK package: \`${languageEntry.runtimeBaseline.vendorSdkPackage}\`
- vendor SDK import path: \`${languageEntry.runtimeBaseline.vendorSdkImportPath}\`
- recommended media runtime entrypoint: \`${languageEntry.runtimeBaseline.recommendedEntrypoint}\`
- smoke command: \`${languageEntry.runtimeBaseline.smokeCommand}\`
- smoke mode: \`${languageEntry.runtimeBaseline.smokeMode}\`
- smoke variants: ${renderMarkdownCodeNaturalList(languageEntry.runtimeBaseline.smokeVariants)}

Use the detailed guide here:

- [\`${guide.label}\`](${guide.path})
`);
}

function renderUsageGuideDefaultProviderFallbackNarrative(assembly, defaultProviderKey) {
  const runtimeLabels = renderUsageGuideExecutableRuntimeLabels(assembly);

  if (runtimeLabels.length === 0) {
    return `That means the current runnable landing falls back to \`${defaultProviderKey}\` when the caller does not explicitly override provider selection.`;
  }

  if (runtimeLabels.length === 1) {
    return `That means the ${runtimeLabels[0]} baseline falls back to \`${defaultProviderKey}\` when the caller does not explicitly override provider selection.`;
  }

  return `That means the ${renderNaturalLanguageList(runtimeLabels)} baselines fall back to \`${defaultProviderKey}\` when the caller does not explicitly override provider selection.`;
}

function renderUsageGuideExecutableSmokeNotes(assembly) {
  return getExecutableRuntimeLanguageEntries(assembly)
    .map((languageEntry) => {
      const runtimeDocumentation = getExecutableLanguageRuntimeDocumentation(languageEntry);

      return `- ${languageEntry.displayName} smoke mode is \`${languageEntry.runtimeBaseline.smokeMode}\`: \`${languageEntry.runtimeBaseline.smokeCommand}\` ${runtimeDocumentation.smokeNarrative}`;
    })
    .join('\n');
}

function renderUsageGuideExecutableIntegrationBindings(assembly) {
  return getExecutableRuntimeLanguageEntries(assembly)
    .map(
      (languageEntry) =>
        `- ${languageEntry.displayName} binds the standard surface to the official \`${languageEntry.runtimeBaseline.vendorSdkImportPath}\` runtime bridge`,
    )
    .join('\n');
}

function renderUsageGuide(assembly) {
  const executableLanguageEntries = getExecutableRuntimeLanguageEntries(assembly);
  const executableLanguageSections = executableLanguageEntries
    .map((languageEntry) => renderUsageGuideExecutableBaselineSection(languageEntry, assembly))
    .join('\n');
  const executableLanguageConclusions = executableLanguageEntries
    .map((languageEntry) => `- ${renderUsageGuideExecutableLanguageConclusion(languageEntry).replace(/\.$/u, '')}`)
    .join('\n');
  const providerSelectionPrecedence = (assembly.providerSelectionStandard?.precedence ?? [])
    .map(
      (source, index) =>
        `${index + 1}. \`${renderUsageGuideSelectionSourceLabel(source)}\``,
    )
    .join('\n');
  const defaultProviderKey = assembly.defaults?.providerKey ?? DEFAULT_mail_PROVIDER_KEY;
  const nonBuiltinProviderKeys = (assembly.providers ?? [])
    .filter((provider) => !provider.builtin)
    .map((provider) => provider.providerKey);
  const executableLanguageLabels = renderMarkdownCodeNaturalList(
    executableLanguageEntries.map((languageEntry) => languageEntry.language),
  );

  return lines(`
# SDKWork Mail SDK Usage Guide

This document is the entrypoint for adopting \`sdkwork-mail-sdk\`.

It focuses on provider-neutral Mail transport runtime contracts, current runnable baselines, default
\`${defaultProviderKey}\` selection, and runtime-specific guides. IM owns user lifecycle,
invite delivery, conversation discovery, and business orchestration.

## 1. Positioning

\`sdkwork-mail-sdk\` is not a reimplementation of vendor mail transport engines.

Its responsibility is to provide one provider-neutral Mail transport runtime standard:

- JDBC-style \`DriverManager\` / \`DataSource\` / \`Client\` contracts
- standardized provider selection and default-provider resolution
- standardized capability negotiation, error semantics, and extension metadata
- pluggable provider integration through official catalogs and package boundaries
- one consistent mail transport runtime surface across web, mobile, and future language workspaces

The standard intentionally keeps vendor SDK ownership on the application side:

- official vendor SDKs remain consumer-supplied
- \`sdkwork-mail-sdk\` provides the standard contracts and adapter boundaries
- runtime bridges map vendor behavior into the standard surface instead of hiding vendor engines
- application and service layers provide SMTP/IMAP credentials before transport operations

## 2. Official Providers

The current official provider catalog is:

| Provider key | Display name | Tier | Builtin | Current role |
| --- | --- | --- | --- | --- |
${renderUsageGuideProviderRows(assembly)}

Notes:

- \`builtin = true\` means the provider is part of the official assembly-driven builtin catalog
- builtin does not mean the vendor runtime is bundled into every language workspace
- non-default providers still follow the same provider metadata, capability, and activation rules

## 3. Language Status

Current language workspace status:

| Language | Workspace | Public package | Maturity | Runtime bridge | Current role |
| --- | --- | --- | --- | --- | --- |
${renderUsageGuideLanguageRows(assembly)}

Current conclusion:

${executableLanguageConclusions}
- current runnable baselines default to \`${defaultProviderKey}\`
- remaining languages preserve standardized metadata, provider selection, lookup helpers, and
  package-boundary scaffolds for future runtime-bridge landings

## 4. Default Provider Contract

The default provider remains \`${defaultProviderKey}\`.

Canonical defaults:

- \`DEFAULT_mail_PROVIDER_KEY = '${assembly.defaults?.providerKey ?? DEFAULT_mail_PROVIDER_KEY}'\`
- \`DEFAULT_mail_PROVIDER_PLUGIN_ID = '${assembly.defaults?.pluginId ?? ''}'\`
- \`DEFAULT_mail_PROVIDER_DRIVER_ID = '${assembly.defaults?.driverId ?? ''}'\`

Provider selection precedence remains:

${providerSelectionPrecedence}

${renderUsageGuideDefaultProviderFallbackNarrative(assembly, defaultProviderKey)}

## 5. Runnable Baselines

${executableLanguageSections}
## 6. Standard Integration Boundary

The correct vendor integration boundary is still the same:

- \`sdkwork-mail-sdk\` owns the standard contracts and provider-neutral runtime surface
- the vendor SDK or native transport plugin owns real mail transport behavior
- the application wires transport credentials into the standard driver/runtime-controller boundary
- IM or backend services resolve provider credentials before send, probe, or sync operations
- Mail runtime code accepts transport credentials and message payloads; it does not discover invites
  or manage conversation delivery

For the current runnable baselines, this boundary is already materialized:

${renderUsageGuideExecutableIntegrationBindings(assembly)}

## 7. Non-Builtin Provider Packages

For providers such as ${renderMarkdownCodeList(nonBuiltinProviderKeys)},
the standard path is package-boundary integration instead of deep root-entrypoint coupling.

That contract stays:

- official provider metadata remains assembly-driven
- package identity, manifest path, README path, and source symbol stay standardized
- runtime code is loaded through the provider-package loader SPI
- runtime bridge ownership stays with the integrating application or provider package

## 8. Error Semantics

Important standardized error codes include:

- \`invalid_provider_url\`
- \`driver_not_found\`
- \`provider_not_supported\`
- \`provider_package_not_found\`
- \`provider_package_identity_mismatch\`
- \`provider_package_load_failed\`
- \`provider_module_export_missing\`
- \`provider_module_contract_mismatch\`
- \`provider_metadata_mismatch\`
- \`native_sdk_not_available\`
- \`vendor_error\`

The two most important runtime distinctions are:

- \`provider_not_supported\`: the provider exists in the official catalog but no runnable driver is
  registered in the current runtime
- \`native_sdk_not_available\`: the standard surface exists but the actual vendor runtime bridge is
  missing or misconfigured

## 9. Local Verification

Use the following commands in the workspace root:

\`\`\`powershell
${renderUsageGuideLocalVerificationCommands(assembly)}
\`\`\`

Verification intent:

- \`materialize-sdk.mjs\` keeps generated catalogs, READMEs, matrices, and this usage guide aligned to the assembly
- \`verify-sdk-automation.test.mjs\` protects standard assets and materialization behavior
- \`verify-sdk.mjs\` validates assembly contracts and generated output
${renderUsageGuideExecutableSmokeNotes(assembly)}
- \`smoke-sdk.mjs\` runs the repository regression entrypoint, including TypeScript package tests
  and optional language checks when toolchains are available

## 10. Practical Adoption Guidance

Use this rule of thumb:

${renderUsageGuideAdoptionGuidance(assembly)}

Current reality is straightforward:

- \`${defaultProviderKey}\` is the default provider
- executable language baselines are ${executableLanguageLabels}
- IM owns business lifecycle and realtime business delivery
- Mail owns transport provider selection, connect, send, probe, sync, and health-check operations
- the remaining language workspaces stay standardized and extensible without pretending they are
  already executable runtimes
`);
}

function renderTypeScriptRuntimeUsageDoc(assembly) {
  const { languageEntry, runtimeBaseline } = getExecutableLanguageRuntimeBaseline(
    assembly,
    'typescript',
  );
  const defaultProviderKey =
    languageEntry.defaultProviderContract?.providerKey ??
    assembly.defaults?.providerKey ??
    DEFAULT_mail_PROVIDER_KEY;

  return lines(`
# SDKWork Mail SDK TypeScript Runtime Usage

This guide describes the executable TypeScript/web mail transport runtime baseline of \`sdkwork-mail-sdk\`.
Backend services and application layers resolve SMTP/IMAP provider credentials. The Mail SDK consumes
those credentials and drives provider transport behavior through the standard runtime surface.

## Current Runnable Baseline

- Default transport provider: \`${defaultProviderKey}\`
- Default web provider plugin package: \`${runtimeBaseline.vendorSdkPackage}\`
- Default web provider plugin import path: \`${runtimeBaseline.vendorSdkImportPath}\`
- Standard transport entrypoint: \`MailDataSource\`
- Recommended runtime entrypoint: \`${runtimeBaseline.recommendedEntrypoint}\`
- Smoke command: \`${runtimeBaseline.smokeCommand}\`
- Smoke mode: \`${runtimeBaseline.smokeMode}\`
- Smoke variants: ${renderMarkdownCodeNaturalList(runtimeBaseline.smokeVariants)}

## Install

\`\`\`bash
npm install ${languageEntry.publicPackage} ${runtimeBaseline.vendorSdkPackage}
\`\`\`

## Fast Runtime Verification

Run the public TypeScript smoke command inside \`${languageEntry.workspace}\` when you want to validate
the default provider runtime bridge without depending on live credentials:

\`\`\`bash
${runtimeBaseline.smokeCommand}
\`\`\`

The smoke command builds the TypeScript package and verifies the root public API boundary. It guards
against retired RTC exports reappearing in the Mail SDK surface.

## Mail Transport Runtime Flow

\`\`\`ts
import {
  createMailProviderPackageLoader,
  installMailProviderPackage,
  MailDriverManager,
  MailDataSource,
} from '${languageEntry.publicPackage}';
import * as smtpProvider from '${runtimeBaseline.vendorSdkImportPath}';

const driverManager = await installMailProviderPackage(
  new MailDriverManager(),
  {
    providerKey: '${defaultProviderKey}',
  },
  createMailProviderPackageLoader(async () => smtpProvider),
);

const dataSource = new MailDataSource({
  driverManager,
  nativeConfig: {
    host: 'smtp.example.com',
    port: 587,
    useTls: true,
    username: 'noreply@example.com',
    password: 'secret',
    fromEmail: 'noreply@example.com',
  },
});

const mailClient = await dataSource.createClient();

await mailClient.connectTransport({
  host: 'smtp.example.com',
  port: 587,
  useTls: true,
});

await mailClient.sendMail({
  toEmail: 'user@example.com',
  subject: 'Verification code',
  bodyText: 'Your code is 123456',
});

await mailClient.healthCheck();
\`\`\`

## Required Native Config

For the default SMTP transport runtime, \`nativeConfig.host\`, \`nativeConfig.port\`, and
\`nativeConfig.fromEmail\` are mandatory before \`connectTransport()\`.

Supported SMTP native config shape:

\`\`\`ts
type MailSmtpNativeConfig = {
  host?: string;
  port?: number;
  useTls?: boolean;
  username?: string;
  password?: string;
  fromEmail?: string;
};
\`\`\`

## Runtime Guarantees

- \`MailDataSource\` is the standard provider-neutral mail transport client factory
- \`installMailProviderPackage(...)\` registers provider drivers through explicit plugin packages
- \`MailDriverManager\` and \`MailDataSource\` default to \`${defaultProviderKey}\` only after the
  matching provider package is installed into the manager
- official provider plugin packages and vendor SDKs are not bundled into the Mail standard root package
- provider plugin packages own any vendor SDK peer dependencies
- provider credentials are supplied by the application or backend service before \`connectTransport()\`
- Mail runtime code does not own user invitation, conversation delivery, or business lifecycle
`);
}
function renderFlutterRuntimeUsageInstallDependencies(languageEntry) {
  if (!languageEntry.runtimeBaseline) {
    throw new Error('Flutter usage guide requires runtimeBaseline metadata');
  }

  return [
    '  flutter:',
    '    sdk: flutter',
    `  ${languageEntry.publicPackage}:`,
    '    path: ../sdkwork-mail-sdk/sdkwork-mail-sdk-flutter',
  ].join('\n');
}

function renderFlutterRuntimeUsageDoc(assembly) {
  const { languageEntry, runtimeBaseline } = getExecutableLanguageRuntimeBaseline(
    assembly,
    'flutter',
  );
  const defaultProviderKey =
    languageEntry.defaultProviderContract?.providerKey ??
    assembly.defaults?.providerKey ??
    DEFAULT_mail_PROVIDER_KEY;

  return lines(`
# SDKWork Mail SDK Flutter Runtime Usage

This guide describes the executable Flutter/mobile mail transport runtime baseline of \`sdkwork-mail-sdk\`.
Backend services and application layers resolve SMTP/IMAP provider credentials. The Mail SDK consumes
those credentials and drives provider transport behavior through the standard runtime surface.

## Current Runnable Baseline

- Default transport provider: \`${defaultProviderKey}\`
- Default mobile provider plugin package: \`${runtimeBaseline.vendorSdkPackage}\`
- Default mobile provider plugin import path: \`${runtimeBaseline.vendorSdkImportPath}\`
- Standard transport entrypoint: \`MailDataSource\`
- Recommended runtime entrypoint: \`${runtimeBaseline.recommendedEntrypoint}\`
- Smoke command: \`${runtimeBaseline.smokeCommand}\`
- Smoke mode: \`${runtimeBaseline.smokeMode}\`
- Smoke variants: ${renderMarkdownCodeNaturalList(runtimeBaseline.smokeVariants)}

## Install

Add the standard Mail package. Provider plugin packages such as
\`${runtimeBaseline.vendorSdkPackage}\` are installed by the application only when that provider is
selected. The root package has no provider or vendor SDK dependency.

\`\`\`yaml
dependencies:
${renderFlutterRuntimeUsageInstallDependencies(languageEntry)}
\`\`\`

## Fast Runtime Verification

Run the public Flutter analysis command inside \`${languageEntry.workspace}\` when you need to verify
the provider-neutral mail transport runtime contracts:

\`\`\`powershell
${runtimeBaseline.smokeCommand}
\`\`\`

## Mail Transport Runtime Flow

\`\`\`dart
import 'package:mail_sdk/mail_sdk.dart';

void inspectMailProviderBoundary() {
  final packageEntry = getMailProviderPackageByProviderKey('${defaultProviderKey}');
  final target = resolveMailProviderPackageLoadTarget(
    const MailProviderPackageLoadRequest(providerKey: '${defaultProviderKey}'),
  );

  assert(packageEntry?.packageIdentity == '${runtimeBaseline.vendorSdkPackage}');
  assert(target.packageEntry.packageIdentity == '${runtimeBaseline.vendorSdkPackage}');
}
\`\`\`

## Provider Native Config

The Flutter root package is provider-neutral. Provider-specific native config types belong to the
selected provider plugin package and are imported only by applications that install that plugin.

## Runtime Guarantees

- \`MailDataSource\` is the standard provider-neutral mail transport client factory
- \`MailDriverManager\` accepts provider drivers registered by explicit provider plugin packages
- \`MailDataSource\` defaults to \`${defaultProviderKey}\` only after the matching provider driver is
  registered
- provider plugin packages own concrete native bridge implementations and vendor dependencies
- provider credentials are supplied by the application or backend service before \`connectTransport()\`
- Mail runtime code does not own user invitation, conversation delivery, or business lifecycle
- send, probe, and sync operations stay standardized through \`sendMail\`, \`probeMailbox\`, and
  \`syncMailbox\`
`);
}
function renderTypeScriptAdapterContract(contract) {
  return `{
    sdkProvisioning: ${renderStringLiteral(contract.sdkProvisioning)},
    bindingStrategy: ${renderStringLiteral(contract.bindingStrategy)},
    bundlePolicy: ${renderStringLiteral(contract.bundlePolicy)},
    runtimeBridgeStatus: ${renderStringLiteral(contract.runtimeBridgeStatus)},
    officialVendorSdkRequirement: ${renderStringLiteral(contract.officialVendorSdkRequirement)},
  }`;
}

function renderTypeScriptRuntimeSurface(assembly) {
  return `import type { MailSdkErrorCode } from './errors.js';
import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_RUNTIME_SURFACE_METHODS = freezeMailRuntimeValue(${renderReadonlyStringArray(
    assembly.runtimeSurfaceStandard?.methodTerms ?? [],
  )});

export type MailRuntimeSurfaceMethodName = (typeof mail_RUNTIME_SURFACE_METHODS)[number];

export type MailRuntimeSurfaceFailureCode = Extract<MailSdkErrorCode, ${renderStringLiteral(
    assembly.runtimeSurfaceStandard?.failureCode ?? '',
  )}>;

export const mail_RUNTIME_SURFACE_FAILURE_CODE: MailRuntimeSurfaceFailureCode = ${renderStringLiteral(
    assembly.runtimeSurfaceStandard?.failureCode ?? '',
  )};

export const mail_RUNTIME_SURFACE_STANDARD = freezeMailRuntimeValue({
  methodTerms: mail_RUNTIME_SURFACE_METHODS,
  failureCode: mail_RUNTIME_SURFACE_FAILURE_CODE,
} as const);
`;
}

function renderTypeScriptRuntimeImmutability(assembly) {
  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_RUNTIME_IMMUTABILITY_FROZEN_TERM = ${renderStringLiteral(
    assembly.runtimeImmutabilityStandard?.frozenTerm ?? '',
  )};

export const mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM = ${renderStringLiteral(
    assembly.runtimeImmutabilityStandard?.snapshotTerm ?? '',
  )};

export const mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM = ${renderStringLiteral(
    assembly.runtimeImmutabilityStandard?.controllerContextTerm ?? '',
  )};

export const mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM = ${renderStringLiteral(
    assembly.runtimeImmutabilityStandard?.nativeClientTerm ?? '',
  )};

export const mail_RUNTIME_IMMUTABILITY_STANDARD = freezeMailRuntimeValue({
  frozenTerm: mail_RUNTIME_IMMUTABILITY_FROZEN_TERM,
  snapshotTerm: mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM,
  controllerContextTerm: mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM,
  nativeClientTerm: mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM,
} as const);
`;
}

function renderTypeScriptRootPublicSurface(assembly) {
  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS = freezeMailRuntimeValue(${renderReadonlyStringArray(
    assembly.rootPublicSurfaceStandard?.typescriptProviderNeutralExportPaths ?? [],
  )});

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS = freezeMailRuntimeValue(${renderReadonlyStringArray(
    assembly.rootPublicSurfaceStandard?.typescriptBuiltinProviderExportPaths ?? [],
  )});

export const mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES = freezeMailRuntimeValue(${renderReadonlyStringArray(
    assembly.rootPublicSurfaceStandard?.typescriptInlineHelperNames ?? [],
  )});

export const mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES = freezeMailRuntimeValue(${renderReadonlyStringArray(
    assembly.rootPublicSurfaceStandard?.reservedSurfaceFamilies ?? [],
  )});

export const mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS = freezeMailRuntimeValue(${renderReadonlyStringRecord(
    assembly.rootPublicSurfaceStandard?.reservedEntryPointKinds ?? {},
  )} as const);

export const mail_ROOT_PUBLIC_SURFACE_BUILTIN_PROVIDER_EXPOSURE_TERM = ${renderStringLiteral(
    assembly.rootPublicSurfaceStandard?.builtinProviderExposureTerm ?? '',
  )};

export const mail_ROOT_PUBLIC_SURFACE_NON_BUILTIN_PROVIDER_EXPOSURE_TERM = ${renderStringLiteral(
    assembly.rootPublicSurfaceStandard?.nonBuiltinProviderExposureTerm ?? '',
  )};

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
`;
}

function renderTypeScriptLookupHelperNaming(assembly) {
  const profiles = Object.entries(assembly.lookupHelperNamingStandard?.profiles ?? {})
    .map(
      ([profileKey, profile]) => `  ${JSON.stringify(profileKey)}: freezeMailRuntimeValue({
    languages: freezeMailRuntimeValue(${renderReadonlyStringArray(profile.languages ?? [])}),
    helpers: freezeMailRuntimeValue(${renderReadonlyStringRecord(profile.helpers ?? {})} as const),
  } as const),`,
    )
    .join('\n');

  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';

export const mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS = freezeMailRuntimeValue(${renderReadonlyStringArray(
    assembly.lookupHelperNamingStandard?.profileTerms ?? [],
  )});

export const mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS = freezeMailRuntimeValue(${renderReadonlyStringArray(
    assembly.lookupHelperNamingStandard?.familyTerms ?? [],
  )});

export const mail_LOOKUP_HELPER_NAMING_STANDARD = freezeMailRuntimeValue({
  profileTerms: mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS,
  familyTerms: mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS,
  profiles: freezeMailRuntimeValue({
${profiles}
  } as const),
} as const);
`;
}

function renderTypeScriptPackageContract(contract) {
  return `{
    packageName: ${renderStringLiteral(contract.packageName)},
    sourceModule: ${renderStringLiteral(contract.sourceModule)},
    driverFactory: ${renderStringLiteral(contract.driverFactory)},
    metadataSymbol: ${renderStringLiteral(contract.metadataSymbol)},
    moduleSymbol: ${renderStringLiteral(contract.moduleSymbol)},
    rootPublic: ${contract.rootPublic ? 'true' : 'false'},
  }`;
}

function getReferenceTypeScriptAdapterContract(assembly) {
  return (
    assembly.typescriptAdapterStandard?.referenceContract ??
    (assembly.providers ?? []).find((provider) => provider.providerKey === assembly.defaults?.providerKey)
      ?.typescriptAdapter ??
    (assembly.providers ?? [])[0]?.typescriptAdapter ??
    DEFAULT_TYPESCRIPT_ADAPTER_CONTRACT
  );
}

function getExecutableLanguageRuntimeBaseline(assembly, language) {
  const languageEntry = (assembly.languages ?? []).find((entry) => entry.language === language);

  if (!languageEntry) {
    throw new Error(`Missing executable language workspace definition for ${language}`);
  }

  if (!languageEntry.runtimeBaseline) {
    throw new Error(`Language workspace ${language} must declare runtimeBaseline metadata`);
  }

  return {
    languageEntry,
    runtimeBaseline: languageEntry.runtimeBaseline,
  };
}

function renderTypeScriptWorkspaceManifest(assembly) {
  const { languageEntry } = getExecutableLanguageRuntimeBaseline(
    assembly,
    'typescript',
  );

  const packageJson = {
    name: languageEntry.publicPackage,
    version: '0.1.1',
    description:
      'Provider-neutral Mail media SDK with JDBC-style provider package loading',
    type: 'module',
    main: './dist/index.js',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
        default: './dist/index.js',
      },
    },
    sideEffects: false,
    files: ['dist'],
    scripts: {
      clean:
        'call "%npm_node_execpath%" ./bin/package-task.mjs clean || "$npm_node_execpath" ./bin/package-task.mjs clean || node ./bin/package-task.mjs clean',
      build:
        'call "%npm_node_execpath%" ./bin/package-task.mjs build || "$npm_node_execpath" ./bin/package-task.mjs build || node ./bin/package-task.mjs build',
      test:
        'call "%npm_node_execpath%" ./bin/package-task.mjs test || "$npm_node_execpath" ./bin/package-task.mjs test || node ./bin/package-task.mjs test',
      smoke:
        'call "%npm_node_execpath%" ./bin/package-task.mjs smoke || "$npm_node_execpath" ./bin/package-task.mjs smoke || node ./bin/package-task.mjs smoke',
    },
  };

  return `${JSON.stringify(packageJson, null, 2)}\n`;
}

function renderTypeScriptBuildTsconfig() {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        rootDir: './src',
        outDir: './dist',
        declaration: true,
        strict: true,
        skipLibCheck: true,
        verbatimModuleSyntax: true,
      },
      include: ['src/**/*.ts'],
    },
    null,
    2,
  )}\n`;
}

function renderTypeScriptRootEntrypoint(assembly) {
  const exportPaths = [
    ...(assembly.rootPublicSurfaceStandard?.typescriptProviderNeutralExportPaths ?? []),
    ...(assembly.rootPublicSurfaceStandard?.typescriptBuiltinProviderExportPaths ?? []),
  ];
  const helperNames = assembly.rootPublicSurfaceStandard?.typescriptInlineHelperNames ?? [];

  if (helperNames.length > 0) {
    throw new Error(
      `TypeScript root inline helpers are not supported by the plugin-only Mail root: ${helperNames.join(', ')}`,
    );
  }

  return `${exportPaths.map((exportPath) => `export * from '${exportPath}';`).join('\n')}\n`;
}

function writeIfChanged(workspaceRoot, filePath, nextContent, changedFiles) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const currentContent = existsSync(filePath) ? readUtf8File(filePath) : null;
  if (currentContent !== nextContent) {
    writeUtf8File(filePath, nextContent);
    changedFiles.push(path.relative(workspaceRoot, filePath).replace(/\\/g, '/'));
  }
}

function removeIfExists(workspaceRoot, filePath, changedFiles) {
  if (existsSync(filePath)) {
    rmSync(filePath, { force: true });
    changedFiles.push(path.relative(workspaceRoot, filePath).replace(/\\/g, '/'));
  }
}

function renderRoleHighlights(roleHighlights) {
  return (roleHighlights ?? []).map((item) => `- ${item}`).join('\n');
}

function renderReservedLanguagePackageScaffold(languageEntry) {
  if (!languageEntry.packageScaffold || !languageEntry.contractScaffold) {
    return '';
  }

  return `
Package scaffold:

- build system: ${languageEntry.packageScaffold.buildSystem}
- manifest: \`${languageEntry.packageScaffold.manifestRelativePath}\`
- contract scaffold: \`${languageEntry.contractScaffold.relativePath}\`
`;
}

function renderReservedLanguageMetadataScaffold(languageEntry) {
  if (!languageEntry.metadataScaffold) {
    return '';
  }

  return `
Metadata scaffold:

- provider catalog: \`${languageEntry.metadataScaffold.providerCatalogRelativePath}\`
- provider package catalog: \`${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}\`
- provider activation catalog: \`${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}\`
- capability catalog: \`${languageEntry.metadataScaffold.capabilityCatalogRelativePath}\`
- provider extension catalog: \`${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}\`
- provider selection: \`${languageEntry.metadataScaffold.providerSelectionRelativePath}\`
- lookup helper naming contract: \`lookupHelperNamingStandard\`
- lookup helper naming profiles: \`lower-camel-Mail\`, \`upper-camel-Mail\`, \`snake-case-Mail\`
- explicit lookup helpers stay mandatory for metadata catalogs:
  provider catalog by provider key, provider package by provider key,
  provider activation by provider key, capability descriptor by capability key,
  provider extension catalog by extension key and provider key, provider URL parsing,
  provider selection resolution, provider support resolution, provider package loading, and
  language workspace by language
- helper naming stays language-idiomatic while preserving the same semantics:
  \`getMail...\` for Flutter/Java/Swift/Kotlin, \`GetMail...\` for C#/Go, and \`get_Mail...\` for Rust/Python
`;
}

function renderReservedLanguageResolutionScaffold(languageEntry) {
  if (!languageEntry.resolutionScaffold) {
    return '';
  }

  return `
Resolution scaffold:

- driver manager: \`${languageEntry.resolutionScaffold.driverManagerRelativePath}\`
- data source: \`${languageEntry.resolutionScaffold.dataSourceRelativePath}\`
- provider support: \`${languageEntry.resolutionScaffold.providerSupportRelativePath}\`
- provider package loader: \`${languageEntry.resolutionScaffold.providerPackageLoaderRelativePath}\`
`;
}

function renderReservedLanguageProviderPackageScaffold(languageEntry) {
  if (!languageEntry.providerPackageScaffold) {
    return '';
  }

  const providerPackageScaffoldNote =
    languageEntry.runtimeBridge
      ? '- this scaffold remains reserved for future extracted provider packages; the current executable runtime stays in the root workspace baseline\n'
      : '';

  return `
Provider package scaffold:

- scaffold: \`${languageEntry.providerPackageScaffold.relativePath}\`
- directory pattern: \`${languageEntry.providerPackageScaffold.directoryPattern}\`
- package pattern: \`${languageEntry.providerPackageScaffold.packagePattern}\`
- manifest file name: \`${languageEntry.providerPackageScaffold.manifestFileName}\`
- readme file name: \`${languageEntry.providerPackageScaffold.readmeFileName}\`
- source file pattern: \`${languageEntry.providerPackageScaffold.sourceFilePattern}\`
- source symbol pattern: \`${languageEntry.providerPackageScaffold.sourceSymbolPattern}\`
- template tokens: ${renderMarkdownCodeList(languageEntry.providerPackageScaffold.templateTokens)}
- source template tokens: ${renderMarkdownCodeList(languageEntry.providerPackageScaffold.sourceTemplateTokens)}
- status: \`${languageEntry.providerPackageScaffold.status}\`
- runtime bridge status: \`${languageEntry.providerPackageScaffold.runtimeBridgeStatus}\`
- root public exposure: \`${languageEntry.providerPackageScaffold.rootPublic}\`
${providerPackageScaffoldNote}`;
}

function renderLanguageWorkspaceProviderPackageBoundary(languageEntry) {
  if (!languageEntry.providerPackageBoundary) {
    return '';
  }

  const providerPackageBoundaryNote =
    languageEntry.runtimeBridge && languageEntry.providerPackageScaffold
      ? '- these terms describe future extracted provider packages, not the runnable root workspace baseline\n'
      : '';

  return `
Provider package boundary:

- mode: \`${languageEntry.providerPackageBoundary.mode}\`
- root public policy: \`${languageEntry.providerPackageBoundary.rootPublicPolicy}\`
- lifecycle status terms: ${renderMarkdownCodeList(
    languageEntry.providerPackageBoundary.lifecycleStatusTerms,
  )}
- runtime bridge status terms: ${renderMarkdownCodeList(
    languageEntry.providerPackageBoundary.runtimeBridgeStatusTerms,
  )}
${providerPackageBoundaryNote}`;
}

function renderLanguageWorkspaceDefaultProviderContract(languageEntry, assembly) {
  const defaults = assembly.defaults ?? {};
  if (
    typeof defaults.providerKey !== 'string' ||
    typeof defaults.pluginId !== 'string' ||
    typeof defaults.driverId !== 'string'
  ) {
    return '';
  }

  if (languageEntry.language === 'typescript') {
    return `
Default provider contract:

- Web/browser default provider key: \`${defaults.providerKey}\`
- Web/browser default plugin id: \`${defaults.pluginId}\`
- Web/browser default driver id: \`${defaults.driverId}\`
- the TypeScript provider catalog must keep \`DEFAULT_mail_PROVIDER_KEY\`,
  \`DEFAULT_mail_PROVIDER_PLUGIN_ID\`, and \`DEFAULT_mail_PROVIDER_DRIVER_ID\`
  aligned to that assembly default
- \`resolveMailProviderSelection()\` falls back to \`DEFAULT_mail_PROVIDER_KEY\`
  when web callers do not override providerUrl, providerKey, tenant override, or deployment profile
- \`MailDataSource\` and \`MailDriverManager\` therefore resolve the web default provider to
  \`${defaults.providerKey}\` unless the caller explicitly selects a different provider
`;
  }

  if (languageEntry.language === 'flutter') {
    return `
Default provider contract:

- Flutter/mobile default provider key: \`${defaults.providerKey}\`
- Flutter/mobile default plugin id: \`${defaults.pluginId}\`
- Flutter/mobile default driver id: \`${defaults.driverId}\`
- \`MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY\` must stay aligned to that assembly default
- \`resolveMailProviderSelection()\` in \`${languageEntry.metadataScaffold.providerSelectionRelativePath}\`
  falls back to \`MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY\` when Flutter callers do not
  provide providerUrl, providerKey, tenant override, or deployment profile values
- \`MailDataSourceOptions.defaultProviderKey\` and \`MailDataSource.describeSelection()\`
  therefore keep the Flutter/mobile default provider on \`${defaults.providerKey}\`
  until a caller explicitly overrides it
`;
  }

  return `
Default provider contract:

- default provider key: \`${defaults.providerKey}\`
- default plugin id: \`${defaults.pluginId}\`
- default driver id: \`${defaults.driverId}\`
- language metadata and selection scaffolds must preserve that assembly-driven default
  provider identity for future runtime bridge landings
`;
}

function buildTypeScriptProviderActivationCatalogEntries(assembly) {
  const typescriptLanguage = (assembly.languages ?? []).find(
    (languageEntry) => languageEntry.language === 'typescript',
  );
  if (!typescriptLanguage) {
    return [];
  }

  return buildLanguageProviderActivationCatalogEntries(typescriptLanguage, assembly.providers);
}

function buildTypeScriptProviderPackageCatalogEntries(assembly) {
  return (assembly.providers ?? []).map((provider) => ({
    providerKey: provider.providerKey,
    pluginId: provider.pluginId,
    driverId: provider.driverId,
    packageIdentity: provider.typescriptPackage.packageName,
    manifestPath: `providers/Mail-sdk-provider-${provider.providerKey}/package.json`,
    readmePath: `providers/Mail-sdk-provider-${provider.providerKey}/README.md`,
    sourcePath: `providers/Mail-sdk-provider-${provider.providerKey}/index.js`,
    declarationPath: `providers/Mail-sdk-provider-${provider.providerKey}/index.d.ts`,
    sourceSymbol: provider.typescriptPackage.moduleSymbol,
    sourceModule: provider.typescriptPackage.sourceModule,
    driverFactory: provider.typescriptPackage.driverFactory,
    metadataSymbol: provider.typescriptPackage.metadataSymbol,
    moduleSymbol: provider.typescriptPackage.moduleSymbol,
    builtin: provider.builtin === true,
    rootPublic: provider.typescriptPackage.rootPublic === true,
    status: 'package_reference_boundary',
    runtimeBridgeStatus: provider.typescriptAdapter.runtimeBridgeStatus,
    requiredCapabilities: [...(provider.requiredCapabilities ?? [])],
    optionalCapabilities: [...(provider.optionalCapabilities ?? [])],
    extensionKeys: [...(provider.extensionKeys ?? [])],
  }));
}

function buildLanguageWorkspaceCatalogEntries(assembly) {
  const defaultProviderContract =
    typeof assembly.defaults?.providerKey === 'string' &&
    typeof assembly.defaults?.pluginId === 'string' &&
    typeof assembly.defaults?.driverId === 'string'
      ? {
          providerKey: assembly.defaults.providerKey,
          pluginId: assembly.defaults.pluginId,
          driverId: assembly.defaults.driverId,
        }
      : undefined;
  const providerSelectionContract =
    Array.isArray(assembly.providerSelectionStandard?.sourceTerms) &&
    Array.isArray(assembly.providerSelectionStandard?.precedence) &&
    typeof assembly.providerSelectionStandard?.defaultSource === 'string'
      ? {
          sourceTerms: [...assembly.providerSelectionStandard.sourceTerms],
          precedence: [...assembly.providerSelectionStandard.precedence],
          defaultSource: assembly.providerSelectionStandard.defaultSource,
        }
      : undefined;
  const providerSuppoMailontract = Array.isArray(assembly.providerSupportStandard?.statusTerms)
    ? {
        statusTerms: [...assembly.providerSupportStandard.statusTerms],
      }
    : undefined;
  const providerActivationContract = Array.isArray(assembly.providerActivationStandard?.statusTerms)
    ? {
        statusTerms: [...assembly.providerActivationStandard.statusTerms],
      }
    : undefined;
  const providerPackageBoundaryContract =
    Array.isArray(assembly.providerPackageBoundaryStandard?.modeTerms) &&
    Array.isArray(assembly.providerPackageBoundaryStandard?.rootPublicPolicyTerms) &&
    Array.isArray(assembly.providerPackageBoundaryStandard?.lifecycleStatusTerms) &&
    Array.isArray(assembly.providerPackageBoundaryStandard?.runtimeBridgeStatusTerms)
      ? {
          modeTerms: [...assembly.providerPackageBoundaryStandard.modeTerms],
          rootPublicPolicyTerms: [...assembly.providerPackageBoundaryStandard.rootPublicPolicyTerms],
          lifecycleStatusTerms: [...assembly.providerPackageBoundaryStandard.lifecycleStatusTerms],
          runtimeBridgeStatusTerms: [
            ...assembly.providerPackageBoundaryStandard.runtimeBridgeStatusTerms,
          ],
        }
      : undefined;

  return (assembly.languages ?? []).map((languageEntry) => ({
    language: languageEntry.language,
    workspace: languageEntry.workspace,
    workspaceCatalogRelativePath: languageEntry.workspaceCatalogRelativePath,
    displayName: languageEntry.displayName,
    publicPackage: languageEntry.publicPackage,
    maturityTier: languageEntry.maturityTier,
    controlSdk: languageEntry.controlSdk === true,
    runtimeBridge: languageEntry.runtimeBridge === true,
    currentRole: languageEntry.currentRole,
    workspaceSummary: languageEntry.workspaceSummary,
    roleHighlights: [...(languageEntry.roleHighlights ?? [])],
    defaultProviderContract,
    providerSelectionContract,
    providerSuppoMailontract,
    providerActivationContract,
    runtimeBaseline: languageEntry.runtimeBaseline
      ? {
          vendorSdkPackage: languageEntry.runtimeBaseline.vendorSdkPackage,
          vendorSdkImportPath: languageEntry.runtimeBaseline.vendorSdkImportPath,
          recommendedEntrypoint: languageEntry.runtimeBaseline.recommendedEntrypoint,
          smokeCommand: languageEntry.runtimeBaseline.smokeCommand,
          smokeMode: languageEntry.runtimeBaseline.smokeMode,
          smokeVariants: [...languageEntry.runtimeBaseline.smokeVariants],
        }
      : undefined,
    metadataScaffold: languageEntry.metadataScaffold
      ? {
          providerCatalogRelativePath: languageEntry.metadataScaffold.providerCatalogRelativePath,
          capabilityCatalogRelativePath: languageEntry.metadataScaffold.capabilityCatalogRelativePath,
          providerExtensionCatalogRelativePath:
            languageEntry.metadataScaffold.providerExtensionCatalogRelativePath,
          providerPackageCatalogRelativePath:
            languageEntry.metadataScaffold.providerPackageCatalogRelativePath,
          providerActivationCatalogRelativePath:
            languageEntry.metadataScaffold.providerActivationCatalogRelativePath,
          providerSelectionRelativePath:
            languageEntry.metadataScaffold.providerSelectionRelativePath,
        }
      : undefined,
    resolutionScaffold: languageEntry.resolutionScaffold
      ? {
          driverManagerRelativePath: languageEntry.resolutionScaffold.driverManagerRelativePath,
          dataSourceRelativePath: languageEntry.resolutionScaffold.dataSourceRelativePath,
          providerSupportRelativePath: languageEntry.resolutionScaffold.providerSupportRelativePath,
          providerPackageLoaderRelativePath:
            languageEntry.resolutionScaffold.providerPackageLoaderRelativePath,
        }
      : undefined,
    providerPackageBoundaryContract,
    providerPackageBoundary: languageEntry.providerPackageBoundary
      ? {
          mode: languageEntry.providerPackageBoundary.mode,
          rootPublicPolicy: languageEntry.providerPackageBoundary.rootPublicPolicy,
          lifecycleStatusTerms: [...(languageEntry.providerPackageBoundary.lifecycleStatusTerms ?? [])],
          runtimeBridgeStatusTerms: [
            ...(languageEntry.providerPackageBoundary.runtimeBridgeStatusTerms ?? []),
          ],
        }
      : undefined,
    providerPackageScaffold: languageEntry.providerPackageScaffold
      ? {
          relativePath: languageEntry.providerPackageScaffold.relativePath,
          directoryPattern: languageEntry.providerPackageScaffold.directoryPattern,
          packagePattern: languageEntry.providerPackageScaffold.packagePattern,
          manifestFileName: languageEntry.providerPackageScaffold.manifestFileName,
          readmeFileName: languageEntry.providerPackageScaffold.readmeFileName,
          sourceFilePattern: languageEntry.providerPackageScaffold.sourceFilePattern,
          sourceSymbolPattern: languageEntry.providerPackageScaffold.sourceSymbolPattern,
          templateTokens: [...(languageEntry.providerPackageScaffold.templateTokens ?? [])],
          sourceTemplateTokens: [
            ...(languageEntry.providerPackageScaffold.sourceTemplateTokens ?? []),
          ],
          referenceProviderKey: languageEntry.providerPackageScaffold.referenceProviderKey,
          referenceStatus: languageEntry.providerPackageScaffold.referenceStatus,
          referenceRuntimeBridgeStatus:
            languageEntry.providerPackageScaffold.referenceRuntimeBridgeStatus,
          referenceVendorSdkPackage:
            languageEntry.providerPackageScaffold.referenceVendorSdkPackage,
          referenceVendorSdkVersion:
            languageEntry.providerPackageScaffold.referenceVendorSdkVersion,
          runtimeBridgeStatus: languageEntry.providerPackageScaffold.runtimeBridgeStatus,
          rootPublic: languageEntry.providerPackageScaffold.rootPublic === true,
          status: languageEntry.providerPackageScaffold.status,
        }
      : undefined,
  }));
}

function renderLanguageWorkspaceCatalogSection(languageEntry) {
  if (typeof languageEntry.workspaceCatalogRelativePath !== 'string') {
    return '';
  }

  return `
Language workspace catalog:

- workspace catalog: \`${languageEntry.workspaceCatalogRelativePath}\`
- workspace catalog entries also keep \`workspaceCatalogRelativePath\`,
  \`defaultProviderContract\`, \`providerSelectionContract\`, \`providerSuppoMailontract\`,
  \`providerActivationContract\`, any declared \`runtimeBaseline\`,
  \`providerPackageBoundaryContract\`, and any declared
  \`metadataScaffold\`, \`resolutionScaffold\`, \`providerPackageBoundary\`, and
  \`providerPackageScaffold\` boundaries so consumers can inspect official assembly-driven module
  locations, workspace-wide default provider identity, selection precedence, support-status
  vocabulary, activation-status vocabulary, runtime-baseline integration details, and
  package-boundary vocabulary without rereading the
  assembly.
`;
}

function renderLanguageWorkspaceRuntimeBaselineSection(languageEntry) {
  if (!languageEntry.runtimeBaseline) {
    return '';
  }

  return `
Runtime baseline contract:

- vendor SDK package: \`${languageEntry.runtimeBaseline.vendorSdkPackage}\`
- vendor SDK import path: \`${languageEntry.runtimeBaseline.vendorSdkImportPath}\`
- recommended entrypoint: \`${languageEntry.runtimeBaseline.recommendedEntrypoint}\`
- smoke command: \`${languageEntry.runtimeBaseline.smokeCommand}\`
- smoke mode: \`${languageEntry.runtimeBaseline.smokeMode}\`
- smoke variants: ${renderMarkdownCodeNaturalList(languageEntry.runtimeBaseline.smokeVariants)}
`;
}

function renderTypeScriptLanguageWorkspaceMetadataScaffold(metadataScaffold) {
  if (!metadataScaffold) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    providerCatalogRelativePath: ${renderStringLiteral(metadataScaffold.providerCatalogRelativePath)},
    capabilityCatalogRelativePath: ${renderStringLiteral(metadataScaffold.capabilityCatalogRelativePath)},
    providerExtensionCatalogRelativePath: ${renderStringLiteral(metadataScaffold.providerExtensionCatalogRelativePath)},
    providerPackageCatalogRelativePath: ${renderStringLiteral(metadataScaffold.providerPackageCatalogRelativePath)},
    providerActivationCatalogRelativePath: ${renderStringLiteral(metadataScaffold.providerActivationCatalogRelativePath)},
    providerSelectionRelativePath: ${renderStringLiteral(metadataScaffold.providerSelectionRelativePath)},
  })`;
}

function renderTypeScriptLanguageWorkspaceResolutionScaffold(resolutionScaffold) {
  if (!resolutionScaffold) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    driverManagerRelativePath: ${renderStringLiteral(resolutionScaffold.driverManagerRelativePath)},
    dataSourceRelativePath: ${renderStringLiteral(resolutionScaffold.dataSourceRelativePath)},
    providerSupportRelativePath: ${renderStringLiteral(resolutionScaffold.providerSupportRelativePath)},
    providerPackageLoaderRelativePath: ${renderStringLiteral(resolutionScaffold.providerPackageLoaderRelativePath)},
  })`;
}

function renderTypeScriptLanguageWorkspaceProviderPackageBoundary(providerPackageBoundary) {
  if (!providerPackageBoundary) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    mode: ${renderStringLiteral(providerPackageBoundary.mode)},
    rootPublicPolicy: ${renderStringLiteral(providerPackageBoundary.rootPublicPolicy)},
    lifecycleStatusTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageBoundary.lifecycleStatusTerms)}),
    runtimeBridgeStatusTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageBoundary.runtimeBridgeStatusTerms)}),
  })`;
}

function renderTypeScriptLanguageWorkspaceProviderPackageScaffold(providerPackageScaffold) {
  if (!providerPackageScaffold) {
    return 'undefined';
  }

  const referenceFields = [
    ['referenceProviderKey', providerPackageScaffold.referenceProviderKey],
    ['referenceStatus', providerPackageScaffold.referenceStatus],
    ['referenceRuntimeBridgeStatus', providerPackageScaffold.referenceRuntimeBridgeStatus],
    ['referenceVendorSdkPackage', providerPackageScaffold.referenceVendorSdkPackage],
    ['referenceVendorSdkVersion', providerPackageScaffold.referenceVendorSdkVersion],
  ]
    .filter(([, value]) => typeof value === 'string')
    .map(([key, value]) => `    ${key}: ${renderStringLiteral(value)},`)
    .join('\n');

  return `freezeMailRuntimeValue({
    relativePath: ${renderStringLiteral(providerPackageScaffold.relativePath)},
    directoryPattern: ${renderStringLiteral(providerPackageScaffold.directoryPattern)},
    packagePattern: ${renderStringLiteral(providerPackageScaffold.packagePattern)},
    manifestFileName: ${renderStringLiteral(providerPackageScaffold.manifestFileName)},
    readmeFileName: ${renderStringLiteral(providerPackageScaffold.readmeFileName)},
    sourceFilePattern: ${renderStringLiteral(providerPackageScaffold.sourceFilePattern)},
    sourceSymbolPattern: ${renderStringLiteral(providerPackageScaffold.sourceSymbolPattern)},
    templateTokens: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageScaffold.templateTokens)}),
    sourceTemplateTokens: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageScaffold.sourceTemplateTokens)}),
${referenceFields ? `${referenceFields}\n` : ''}    runtimeBridgeStatus: ${renderStringLiteral(providerPackageScaffold.runtimeBridgeStatus)},
    rootPublic: ${providerPackageScaffold.rootPublic ? 'true' : 'false'},
    status: ${renderStringLiteral(providerPackageScaffold.status)},
  })`;
}

function renderTypeScriptLanguageWorkspaceDefaultProviderContract(defaultProviderContract) {
  if (!defaultProviderContract) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    providerKey: ${renderStringLiteral(defaultProviderContract.providerKey)},
    pluginId: ${renderStringLiteral(defaultProviderContract.pluginId)},
    driverId: ${renderStringLiteral(defaultProviderContract.driverId)},
  })`;
}

function renderTypeScriptLanguageWorkspaceProviderSelectionContract(
  providerSelectionContract,
) {
  if (!providerSelectionContract) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    sourceTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerSelectionContract.sourceTerms)}),
    precedence: freezeMailRuntimeValue(${renderReadonlyStringArray(providerSelectionContract.precedence)}),
    defaultSource: ${renderStringLiteral(providerSelectionContract.defaultSource)},
  })`;
}

function renderTypeScriptLanguageWorkspaceProviderSuppoMailontract(
  providerSuppoMailontract,
) {
  if (!providerSuppoMailontract) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    statusTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerSuppoMailontract.statusTerms)}),
  })`;
}

function renderTypeScriptLanguageWorkspaceProviderActivationContract(
  providerActivationContract,
) {
  if (!providerActivationContract) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    statusTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerActivationContract.statusTerms)}),
  })`;
}

function renderTypeScriptLanguageWorkspaceRuntimeBaseline(runtimeBaseline) {
  if (!runtimeBaseline) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    vendorSdkPackage: ${renderStringLiteral(runtimeBaseline.vendorSdkPackage)},
    vendorSdkImportPath: ${renderStringLiteral(runtimeBaseline.vendorSdkImportPath)},
    recommendedEntrypoint: ${renderStringLiteral(runtimeBaseline.recommendedEntrypoint)},
    smokeCommand: ${renderStringLiteral(runtimeBaseline.smokeCommand)},
    smokeMode: ${renderStringLiteral(runtimeBaseline.smokeMode)},
    smokeVariants: freezeMailRuntimeValue(${renderReadonlyStringArray(runtimeBaseline.smokeVariants)}),
  })`;
}

function renderTypeScriptLanguageWorkspaceProviderPackageBoundaryContract(
  providerPackageBoundaryContract,
) {
  if (!providerPackageBoundaryContract) {
    return 'undefined';
  }

  return `freezeMailRuntimeValue({
    modeTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageBoundaryContract.modeTerms)}),
    rootPublicPolicyTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageBoundaryContract.rootPublicPolicyTerms)}),
    lifecycleStatusTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageBoundaryContract.lifecycleStatusTerms)}),
    runtimeBridgeStatusTerms: freezeMailRuntimeValue(${renderReadonlyStringArray(providerPackageBoundaryContract.runtimeBridgeStatusTerms)}),
  })`;
}

function renderTypeScriptLanguageWorkspaceCatalog(assembly) {
  const entries = buildLanguageWorkspaceCatalogEntries(assembly);

  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailLanguageWorkspaceCatalogEntry } from './types.js';

export const OFFICIAL_mail_LANGUAGE_WORKSPACE_KEYS = freezeMailRuntimeValue(${renderReadonlyStringArray(
    entries.map((entry) => entry.language),
  )});

${entries
  .map((entry) => {
    const constantName = `${toUpperSnakeCase(entry.language)}_mail_LANGUAGE_WORKSPACE_ENTRY`;

    return `export const ${constantName}: MailLanguageWorkspaceCatalogEntry = freezeMailRuntimeValue({
  language: ${renderStringLiteral(entry.language)},
  workspace: ${renderStringLiteral(entry.workspace)},
  workspaceCatalogRelativePath: ${renderStringLiteral(entry.workspaceCatalogRelativePath)},
  displayName: ${renderStringLiteral(entry.displayName)},
  publicPackage: ${renderStringLiteral(entry.publicPackage)},
  maturityTier: ${renderStringLiteral(entry.maturityTier)},
  controlSdk: ${entry.controlSdk ? 'true' : 'false'},
  runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'},
  currentRole: ${renderStringLiteral(entry.currentRole)},
  workspaceSummary: ${renderStringLiteral(entry.workspaceSummary)},
  roleHighlights: freezeMailRuntimeValue(${renderReadonlyStringArray(entry.roleHighlights)}),
  defaultProviderContract: ${renderTypeScriptLanguageWorkspaceDefaultProviderContract(entry.defaultProviderContract)},
  providerSelectionContract: ${renderTypeScriptLanguageWorkspaceProviderSelectionContract(entry.providerSelectionContract)},
  providerSuppoMailontract: ${renderTypeScriptLanguageWorkspaceProviderSuppoMailontract(entry.providerSuppoMailontract)},
  providerActivationContract: ${renderTypeScriptLanguageWorkspaceProviderActivationContract(entry.providerActivationContract)},
  runtimeBaseline: ${renderTypeScriptLanguageWorkspaceRuntimeBaseline(entry.runtimeBaseline)},
  metadataScaffold: ${renderTypeScriptLanguageWorkspaceMetadataScaffold(entry.metadataScaffold)},
  resolutionScaffold: ${renderTypeScriptLanguageWorkspaceResolutionScaffold(entry.resolutionScaffold)},
  providerPackageBoundaryContract: ${renderTypeScriptLanguageWorkspaceProviderPackageBoundaryContract(entry.providerPackageBoundaryContract)},
  providerPackageBoundary: ${renderTypeScriptLanguageWorkspaceProviderPackageBoundary(entry.providerPackageBoundary)},
  providerPackageScaffold: ${renderTypeScriptLanguageWorkspaceProviderPackageScaffold(entry.providerPackageScaffold)},
});`;
  })
  .join('\n\n')}

export const mail_LANGUAGE_WORKSPACE_CATALOG: readonly MailLanguageWorkspaceCatalogEntry[] = freezeMailRuntimeValue([
  ${entries
    .map((entry) => `${toUpperSnakeCase(entry.language)}_mail_LANGUAGE_WORKSPACE_ENTRY`)
    .join(',\n  ')}
]);

const mail_LANGUAGE_WORKSPACE_BY_KEY = new Map<string, MailLanguageWorkspaceCatalogEntry>(
  mail_LANGUAGE_WORKSPACE_CATALOG.map((entry) => [entry.language, entry]),
);

export function getMailLanguageWorkspaceCatalog(): readonly MailLanguageWorkspaceCatalogEntry[] {
  return mail_LANGUAGE_WORKSPACE_CATALOG;
}

export function getMailLanguageWorkspaceByLanguage(
  language: string,
): MailLanguageWorkspaceCatalogEntry | undefined {
  return mail_LANGUAGE_WORKSPACE_BY_KEY.get(language);
}

export function getMailLanguageWorkspace(
  language: string,
): MailLanguageWorkspaceCatalogEntry | undefined {
  return getMailLanguageWorkspaceByLanguage(language);
}
`;
}

function renderTypeScriptWorkspaceReadme(languageEntry, assembly) {
  const typeScriptAdapter = getReferenceTypeScriptAdapterContract(assembly);
  const roleHighlights = [
    languageEntry.currentRole,
    ...(languageEntry.roleHighlights ?? []),
    'assembly-driven language workspace catalog at src/language-workspace-catalog.ts',
    'standard provider selection helpers at src/provider-selection.ts',
    'standard capability negotiation helpers at src/capability-negotiation.ts',
    'standard provider support helpers at src/provider-support.ts',
    'standard mail transport runtime helpers for provider-neutral connectTransport, sendMail, probeMailbox, and syncMailbox flows',
    'assembly-driven provider package catalog at src/provider-package-catalog.ts',
    'standard provider package loader and installer SPI at src/provider-package-loader.ts',
    'assembly-driven provider activation catalog at src/provider-activation-catalog.ts',
    `TypeScript runtime bridge baseline: ${typeScriptAdapter.runtimeBridgeStatus}`,
    `TypeScript runtime bridge requires an official vendor SDK: ${typeScriptAdapter.officialVendorSdkRequirement}`,
    `TypeScript provider adapters remain ${typeScriptAdapter.sdkProvisioning}, bind through ${typeScriptAdapter.bindingStrategy}, and ${typeScriptAdapter.bundlePolicy} vendor SDKs`,
  ];

  return `# SDKWork Mail SDK ${languageEntry.displayName} Workspace

Language: \`${languageEntry.language}\`

Planned public package:

- \`${languageEntry.publicPackage}\`

Current boundary:

- control SDK support: ${languageEntry.controlSdk ? 'yes' : 'no'}
- runtime bridge support: ${languageEntry.runtimeBridge ? 'yes' : 'reserved'}
- maturity tier: ${languageEntry.maturityTier}

Current role:

${renderRoleHighlights(roleHighlights)}

${languageEntry.workspaceSummary}
This workspace does not bundle vendor SDK implementations. Provider adapters wrap caller-supplied
native client factories and expose vendor escape hatches through \`unwrap()\`.
The shared runtime-surface module at \`src/runtime-surface.ts\` materializes
\`runtimeSurfaceStandard\` into \`mail_RUNTIME_SURFACE_METHODS\`,
\`mail_RUNTIME_SURFACE_FAILURE_CODE\`, and \`mail_RUNTIME_SURFACE_STANDARD\` so the provider-neutral
runtime method vocabulary and missing-runtime failure semantics stay assembly-governed.
The shared runtime-immutability module at \`src/runtime-immutability.ts\` materializes
\`runtimeImmutabilityStandard\` into \`mail_RUNTIME_IMMUTABILITY_FROZEN_TERM\`,
\`mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM\`,
\`mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM\`,
\`mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM\`, and
\`mail_RUNTIME_IMMUTABILITY_STANDARD\` so runtime-frozen metadata, immutable snapshot contracts,
shallow-immutable runtime-controller contexts, and mutable native-client preservation stay
assembly-governed.
The shared root-public-surface module at \`src/root-public-surface.ts\` materializes
\`rootPublicSurfaceStandard\` into
\`mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS\`,
\`mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS\`,
\`mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES\`,
\`mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES\`,
\`mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS\`, and
\`mail_ROOT_PUBLIC_SURFACE_STANDARD\` so the TypeScript root export graph, builtin-provider
root exposure, and reserved single-entrypoint families stay assembly-governed.
The shared lookup-helper-naming module at \`src/lookup-helper-naming.ts\` materializes
\`lookupHelperNamingStandard\` into \`mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS\`,
\`mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS\`, and \`mail_LOOKUP_HELPER_NAMING_STANDARD\` so the
\`lower-camel-Mail\`, \`upper-camel-Mail\`, and \`snake-case-Mail\` helper profiles stay
assembly-governed across the web/browser baseline and the reserved mobile/server language
workspaces.
${renderLanguageWorkspaceDefaultProviderContract(languageEntry, assembly)}
${renderLanguageWorkspaceCatalogSection(languageEntry)}
${renderLanguageWorkspaceRuntimeBaselineSection(languageEntry)}
${renderLanguageWorkspaceProviderPackageBoundary(languageEntry)}

Local runtime verification:

- \`npm run smoke\`
- \`npm run test\`
- \`npm run build\`
- Mail remains a provider/media runtime bridge; IM-owned packages handle business conversation
  delivery, invitations, and lifecycle state

Standards references:

- \`../docs/provider-adapter-standard.md\`
- \`../docs/multilanguage-capability-matrix.md\`
`;
}

function renderLanguageWorkspaceReadme(languageEntry, assembly) {
  if (languageEntry.language === 'typescript') {
    return renderTypeScriptWorkspaceReadme(languageEntry, assembly);
  }

  return `# SDKWork Mail SDK ${languageEntry.displayName} Workspace

Language: \`${languageEntry.language}\`

Planned public package:

- \`${languageEntry.publicPackage}\`

Current boundary:

- control SDK support: ${languageEntry.controlSdk ? 'yes' : 'no'}
- runtime bridge support: ${languageEntry.runtimeBridge ? 'yes' : 'reserved'}
- maturity tier: ${languageEntry.maturityTier}

Current role:

${renderRoleHighlights([languageEntry.currentRole, ...(languageEntry.roleHighlights ?? [])])}

${languageEntry.workspaceSummary}
${renderLanguageWorkspaceDefaultProviderContract(languageEntry, assembly)}
${renderLanguageWorkspaceCatalogSection(languageEntry)}
${renderLanguageWorkspaceRuntimeBaselineSection(languageEntry)}
${renderLanguageWorkspaceProviderPackageBoundary(languageEntry)}
${renderReservedLanguagePackageScaffold(languageEntry)}
${renderReservedLanguageMetadataScaffold(languageEntry)}
${renderReservedLanguageResolutionScaffold(languageEntry)}
${renderReservedLanguageProviderPackageScaffold(languageEntry)}${languageEntry.language === 'flutter'
  ? `\n${renderReservedLanguageRuntimeUsage(languageEntry)}`
  : ''}

Standards references:

- \`../docs/provider-adapter-standard.md\`
- \`../docs/multilanguage-capability-matrix.md\`
`;
}

function renderReservedLanguageRuntimeUsage(languageEntry) {
  if (languageEntry.language !== 'flutter') {
    return '';
  }

  return `Provider plugin boundary:

- Flutter/mobile root stays provider-neutral and ships no concrete provider adapter
- provider plugins such as \`mail_sdk_provider_volcengine\` are installed only by applications that select them
- \`MailDriverManager\` does not auto-register provider drivers from the root package
- \`MailDataSource()\` resolves metadata but requires an explicitly registered provider driver before connecting
- business invitations, lifecycle state, and conversation delivery are supplied by IM-owned SDKs

Quick start:

\`\`\`dart
import 'package:mail_sdk/mail_sdk.dart';

void inspectProviderPluginPackage() {
  final target = resolveMailProviderPackageLoadTarget(
    const MailProviderPackageLoadRequest(providerKey: 'volcengine'),
  );

  assert(target.packageEntry.packageIdentity == 'mail_sdk_provider_volcengine');
}
\`\`\`

Runtime notes:

- provider-specific native config types belong to the selected provider plugin package
- \`MailJoinOptions.token\` is supplied by the application or IM layer, not hardcoded in Mail callers
- \`MailPublishOptions\` remains provider-neutral and supports standard audio and video publishing
- \`MailDataSource\` keeps the provider-neutral runtime boundary stable across native SDK adapters
- IM-owned services decide who should join, which provider room to use, and when the media runtime
  should leave`;
}

function renderCapabilityMatrix(assembly) {
  const capabilityCatalogRows = (assembly.capabilityCatalog ?? [])
    .map(
      (descriptor) =>
        `| \`${descriptor.capabilityKey}\` | \`${descriptor.category}\` | \`${descriptor.surface}\` |`,
    )
    .join('\n');
  const providerExtensionRows = (assembly.providerExtensionCatalog ?? [])
    .map(
      (descriptor) =>
        `| \`${descriptor.extensionKey}\` | \`${descriptor.providerKey}\` | ${descriptor.displayName} | \`${descriptor.surface}\` | \`${descriptor.access}\` | \`${descriptor.status}\` |`,
    )
    .join('\n');
  const typeScriptRuntimeRows = (assembly.providers ?? [])
    .map(
      (provider) =>
        `| \`${provider.providerKey}\` | \`${provider.typescriptAdapter.runtimeBridgeStatus}\` | \`${provider.typescriptAdapter.officialVendorSdkRequirement}\` | \`${provider.typescriptAdapter.sdkProvisioning}\` | \`${provider.typescriptAdapter.bindingStrategy}\` | \`${provider.typescriptAdapter.bundlePolicy}\` |`,
    )
    .join('\n');
  const providerRows = (assembly.providers ?? [])
    .map(
      (provider) =>
        `| \`${provider.providerKey}\` | \`${provider.tier}\` | ${provider.builtin ? 'Yes' : 'No'} | ${provider.defaultSelected ? 'Yes' : 'No'} | ${provider.displayName} |`,
    )
    .join('\n');
  const providerCapabilityRows = (assembly.providers ?? [])
    .map(
      (provider) =>
        `| \`${provider.providerKey}\` | ${renderMarkdownCodeList(provider.requiredCapabilities ?? [])} | ${renderMarkdownCodeList(provider.optionalCapabilities ?? [])} |`,
    )
    .join('\n');
  const languageRows = (assembly.languages ?? [])
    .map(
      (languageEntry) =>
        `| ${languageEntry.displayName} | \`${languageEntry.publicPackage}\` | ${languageEntry.controlSdk ? 'Yes' : 'No'} | ${languageEntry.runtimeBridge ? 'Yes' : 'No'} | \`${languageEntry.maturityTier}\` | ${languageEntry.currentRole} |`,
    )
    .join('\n');
  const languageWorkspaceCatalogRows = (assembly.languages ?? [])
    .map(
      (languageEntry) =>
        `| ${languageEntry.displayName} | \`${languageEntry.workspaceCatalogRelativePath}\` | \`${languageEntry.publicPackage}\` | ${languageEntry.controlSdk ? 'Yes' : 'No'} | ${languageEntry.runtimeBridge ? 'Yes' : 'No'} | \`${languageEntry.maturityTier}\` |`,
    )
    .join('\n');
  const languageProviderPackageBoundaryRows = (assembly.languages ?? [])
    .map((languageEntry) => {
      const scaffoldPath = languageEntry.providerPackageScaffold?.relativePath ?? '<none>';

      return `| ${languageEntry.displayName} | \`${languageEntry.providerPackageBoundary.mode}\` | \`${languageEntry.providerPackageBoundary.rootPublicPolicy}\` | ${renderMarkdownCodeList(languageEntry.providerPackageBoundary.lifecycleStatusTerms)} | ${renderMarkdownCodeList(languageEntry.providerPackageBoundary.runtimeBridgeStatusTerms)} | \`${scaffoldPath}\` |`;
    })
    .join('\n');
  const languageProviderActivationRows = (assembly.languages ?? [])
    .flatMap((languageEntry) =>
      (languageEntry.providerActivations ?? []).map((providerActivation) => {
        const activationDetails = describeProviderActivationStatus(providerActivation.activationStatus);
        return `| ${languageEntry.displayName} | \`${providerActivation.providerKey}\` | \`${providerActivation.activationStatus}\` | ${activationDetails.runtimeBridge ? 'Yes' : 'No'} | ${activationDetails.rootPublic ? 'Yes' : 'No'} | ${activationDetails.packageBoundary ? 'Yes' : 'No'} |`;
      }),
    )
    .join('\n');
  const reservedLanguagePackageScaffoldRows = (assembly.languages ?? [])
    .filter((languageEntry) => languageEntry.language !== 'typescript')
    .map(
      (languageEntry) =>
        `| ${languageEntry.displayName} | \`${languageEntry.packageScaffold.buildSystem}\` | \`${languageEntry.packageScaffold.manifestRelativePath}\` | \`${languageEntry.contractScaffold.relativePath}\` |`,
    )
    .join('\n');
  const reservedLanguageMetadataScaffoldRows = (assembly.languages ?? [])
    .filter((languageEntry) => languageEntry.language !== 'typescript')
    .map(
      (languageEntry) =>
        `| ${languageEntry.displayName} | \`${languageEntry.metadataScaffold.providerCatalogRelativePath}\` | \`${languageEntry.metadataScaffold.providerPackageCatalogRelativePath}\` | \`${languageEntry.metadataScaffold.providerActivationCatalogRelativePath}\` | \`${languageEntry.metadataScaffold.capabilityCatalogRelativePath}\` | \`${languageEntry.metadataScaffold.providerExtensionCatalogRelativePath}\` | \`${languageEntry.metadataScaffold.providerSelectionRelativePath}\` |`,
    )
    .join('\n');
  const reservedLanguageResolutionScaffoldRows = (assembly.languages ?? [])
    .filter((languageEntry) => languageEntry.language !== 'typescript')
    .map(
      (languageEntry) =>
        `| ${languageEntry.displayName} | \`${languageEntry.resolutionScaffold.driverManagerRelativePath}\` | \`${languageEntry.resolutionScaffold.dataSourceRelativePath}\` | \`${languageEntry.resolutionScaffold.providerSupportRelativePath}\` | \`${languageEntry.resolutionScaffold.providerPackageLoaderRelativePath}\` |`,
    )
    .join('\n');
  const reservedLanguageProviderPackageScaffoldRows = (assembly.languages ?? [])
    .filter((languageEntry) => languageEntry.language !== 'typescript')
    .map(
      (languageEntry) => {
        const defaultProviderKey = assembly.defaults?.providerKey ?? DEFAULT_mail_PROVIDER_KEY;
        const defaultExample = materializeProviderPackagePattern(
          languageEntry.providerPackageScaffold.packagePattern,
          defaultProviderKey,
        );
        const defaultDirectory = materializeProviderPackagePattern(
          languageEntry.providerPackageScaffold.directoryPattern,
          defaultProviderKey,
        );
        const defaultManifestPath = `${defaultDirectory}/${materializeProviderPackagePattern(
          languageEntry.providerPackageScaffold.manifestFileName,
          defaultProviderKey,
        )}`;
        const defaultReadmePath = `${defaultDirectory}/${languageEntry.providerPackageScaffold.readmeFileName}`;
        const defaultSourcePath = `${defaultDirectory}/${materializeProviderPackagePattern(
          languageEntry.providerPackageScaffold.sourceFilePattern,
          defaultProviderKey,
        )}`;
        const defaultSourceSymbol = materializeProviderPackagePattern(
          languageEntry.providerPackageScaffold.sourceSymbolPattern,
          defaultProviderKey,
        );

        return `| ${languageEntry.displayName} | \`${languageEntry.providerPackageScaffold.relativePath}\` | \`${languageEntry.providerPackageScaffold.directoryPattern}\` | \`${languageEntry.providerPackageScaffold.packagePattern}\` | \`${languageEntry.providerPackageScaffold.manifestFileName}\` | \`${languageEntry.providerPackageScaffold.readmeFileName}\` | \`${languageEntry.providerPackageScaffold.sourceFilePattern}\` | \`${languageEntry.providerPackageScaffold.sourceSymbolPattern}\` | ${renderMarkdownCodeList(languageEntry.providerPackageScaffold.templateTokens)} | ${renderMarkdownCodeList(languageEntry.providerPackageScaffold.sourceTemplateTokens)} | \`${languageEntry.providerPackageScaffold.status}\` | \`${languageEntry.providerPackageScaffold.runtimeBridgeStatus}\` | \`${languageEntry.providerPackageScaffold.rootPublic}\` | \`${defaultExample}\` | \`${defaultManifestPath}\` | \`${defaultReadmePath}\` | \`${defaultSourcePath}\` | \`${defaultSourceSymbol}\` |`;
      },
    )
    .join('\n');
  const tierSummaryLines = Object.entries(assembly.providerTierStandard?.tierSummaries ?? {})
    .map(([tier, summary]) => `- \`${tier}\`: ${summary}`)
    .join('\n');
  const languageMaturitySummaryLines = Object.entries(
    assembly.languageMaturityStandard?.tierSummaries ?? {},
  )
    .map(([tier, summary]) => `- \`${tier}\`: ${summary}`)
    .join('\n');
  const capabilityStandardLines = [
    `- \`capabilityStandard.categoryTerms\`: ${renderMarkdownCodeList(
      assembly.capabilityStandard?.categoryTerms ?? [],
    )}`,
    `- \`capabilityStandard.surfaceTerms\`: ${renderMarkdownCodeList(
      assembly.capabilityStandard?.surfaceTerms ?? [],
    )}`,
  ].join('\n');
  const capabilityNegotiationStandardLines = [
    `- \`capabilityNegotiationStandard.statusTerms\`: ${renderMarkdownCodeList(
      assembly.capabilityNegotiationStandard?.statusTerms ?? [],
    )}`,
    `- \`capabilityNegotiationStandard.statusRules.supported\`: \`${assembly.capabilityNegotiationStandard?.statusRules?.supported ?? ''}\``,
    `- \`capabilityNegotiationStandard.statusRules.degraded\`: \`${assembly.capabilityNegotiationStandard?.statusRules?.degraded ?? ''}\``,
    `- \`capabilityNegotiationStandard.statusRules.unsupported\`: \`${assembly.capabilityNegotiationStandard?.statusRules?.unsupported ?? ''}\``,
  ].join('\n');
  const runtimeSurfaceStandardLines = [
    `- \`runtimeSurfaceStandard.methodTerms\`: ${renderMarkdownCodeList(
      assembly.runtimeSurfaceStandard?.methodTerms ?? [],
    )}`,
    `- \`runtimeSurfaceStandard.failureCode\`: \`${assembly.runtimeSurfaceStandard?.failureCode ?? ''}\``,
    '- TypeScript root public constants: `mail_RUNTIME_SURFACE_METHODS`, `mail_RUNTIME_SURFACE_FAILURE_CODE`',
  ].join('\n');
  const runtimeImmutabilityStandardLines = [
    `- \`runtimeImmutabilityStandard.frozenTerm\`: \`${assembly.runtimeImmutabilityStandard?.frozenTerm ?? ''}\``,
    `- \`runtimeImmutabilityStandard.snapshotTerm\`: \`${assembly.runtimeImmutabilityStandard?.snapshotTerm ?? ''}\``,
    `- \`runtimeImmutabilityStandard.controllerContextTerm\`: \`${assembly.runtimeImmutabilityStandard?.controllerContextTerm ?? ''}\``,
    `- \`runtimeImmutabilityStandard.nativeClientTerm\`: \`${assembly.runtimeImmutabilityStandard?.nativeClientTerm ?? ''}\``,
    '- TypeScript root public constants: `mail_RUNTIME_IMMUTABILITY_FROZEN_TERM`, `mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM`, `mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM`, `mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM`, `mail_RUNTIME_IMMUTABILITY_STANDARD`',
  ].join('\n');
  const rootPublicSurfaceStandardLines = [
    `- \`rootPublicSurfaceStandard.typescriptProviderNeutralExportPaths\`: ${renderMarkdownCodeList(
      assembly.rootPublicSurfaceStandard?.typescriptProviderNeutralExportPaths ?? [],
    )}`,
    `- \`rootPublicSurfaceStandard.typescriptBuiltinProviderExportPaths\`: ${renderMarkdownCodeList(
      assembly.rootPublicSurfaceStandard?.typescriptBuiltinProviderExportPaths ?? [],
    )}`,
    `- \`rootPublicSurfaceStandard.typescriptInlineHelperNames\`: ${renderMarkdownCodeList(
      assembly.rootPublicSurfaceStandard?.typescriptInlineHelperNames ?? [],
    )}`,
    `- \`rootPublicSurfaceStandard.reservedSurfaceFamilies\`: ${renderMarkdownCodeList(
      assembly.rootPublicSurfaceStandard?.reservedSurfaceFamilies ?? [],
    )}`,
    `- \`rootPublicSurfaceStandard.reservedEntryPointKinds.flutter\`: \`${assembly.rootPublicSurfaceStandard?.reservedEntryPointKinds?.flutter ?? ''}\``,
    `- \`rootPublicSurfaceStandard.reservedEntryPointKinds.python\`: \`${assembly.rootPublicSurfaceStandard?.reservedEntryPointKinds?.python ?? ''}\``,
    `- \`rootPublicSurfaceStandard.builtinProviderExposureTerm\`: \`${assembly.rootPublicSurfaceStandard?.builtinProviderExposureTerm ?? ''}\``,
    `- \`rootPublicSurfaceStandard.nonBuiltinProviderExposureTerm\`: \`${assembly.rootPublicSurfaceStandard?.nonBuiltinProviderExposureTerm ?? ''}\``,
    '- TypeScript root public module: `sdkwork-mail-sdk-typescript/src/root-public-surface.ts`',
    '- TypeScript root public constants: `mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS`, `mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS`, `mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES`, `mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES`, `mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS`, `mail_ROOT_PUBLIC_SURFACE_STANDARD`',
  ].join('\n');
  const lookupHelperNamingStandardLines = [
    `- \`lookupHelperNamingStandard.profileTerms\`: ${renderMarkdownCodeList(
      assembly.lookupHelperNamingStandard?.profileTerms ?? [],
    )}`,
    `- \`lookupHelperNamingStandard.familyTerms\`: ${renderMarkdownCodeList(
      assembly.lookupHelperNamingStandard?.familyTerms ?? [],
    )}`,
    '- TypeScript root public module: `sdkwork-mail-sdk-typescript/src/lookup-helper-naming.ts`',
    '- TypeScript root public constants: `mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS`, `mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS`, `mail_LOOKUP_HELPER_NAMING_STANDARD`',
  ].join('\n');
  const errorCodeStandardLines = [
    `- \`errorCodeStandard.codeTerms\`: ${renderMarkdownCodeList(
      assembly.errorCodeStandard?.codeTerms ?? [],
    )}`,
    `- \`errorCodeStandard.fallbackCode\`: \`${assembly.errorCodeStandard?.fallbackCode ?? ''}\``,
  ].join('\n');
  const providerExtensionStandardLines = [
    `- \`providerExtensionStandard.accessTerms\`: ${renderMarkdownCodeList(
      assembly.providerExtensionStandard?.accessTerms ?? [],
    )}`,
    `- \`providerExtensionStandard.statusTerms\`: ${renderMarkdownCodeList(
      assembly.providerExtensionStandard?.statusTerms ?? [],
    )}`,
  ].join('\n');
  const typeScriptAdapterStandardLines = [
    `- \`typescriptAdapterStandard.sdkProvisioningTerms\`: ${renderMarkdownCodeList(
      assembly.typescriptAdapterStandard?.sdkProvisioningTerms ?? [],
    )}`,
    `- \`typescriptAdapterStandard.bindingStrategyTerms\`: ${renderMarkdownCodeList(
      assembly.typescriptAdapterStandard?.bindingStrategyTerms ?? [],
    )}`,
    `- \`typescriptAdapterStandard.bundlePolicyTerms\`: ${renderMarkdownCodeList(
      assembly.typescriptAdapterStandard?.bundlePolicyTerms ?? [],
    )}`,
    `- \`typescriptAdapterStandard.runtimeBridgeStatusTerms\`: ${renderMarkdownCodeList(
      assembly.typescriptAdapterStandard?.runtimeBridgeStatusTerms ?? [],
    )}`,
    `- \`typescriptAdapterStandard.officialVendorSdkRequirementTerms\`: ${renderMarkdownCodeList(
      assembly.typescriptAdapterStandard?.officialVendorSdkRequirementTerms ?? [],
    )}`,
    `- \`typescriptAdapterStandard.referenceContract.sdkProvisioning\`: \`${assembly.typescriptAdapterStandard?.referenceContract?.sdkProvisioning ?? ''}\``,
    `- \`typescriptAdapterStandard.referenceContract.bindingStrategy\`: \`${assembly.typescriptAdapterStandard?.referenceContract?.bindingStrategy ?? ''}\``,
    `- \`typescriptAdapterStandard.referenceContract.bundlePolicy\`: \`${assembly.typescriptAdapterStandard?.referenceContract?.bundlePolicy ?? ''}\``,
    `- \`typescriptAdapterStandard.referenceContract.runtimeBridgeStatus\`: \`${assembly.typescriptAdapterStandard?.referenceContract?.runtimeBridgeStatus ?? ''}\``,
    `- \`typescriptAdapterStandard.referenceContract.officialVendorSdkRequirement\`: \`${assembly.typescriptAdapterStandard?.referenceContract?.officialVendorSdkRequirement ?? ''}\``,
  ].join('\n');
  const typeScriptPackageStandardLines = [
    `- \`typescriptPackageStandard.packageNamePattern\`: \`${assembly.typescriptPackageStandard?.packageNamePattern ?? ''}\``,
    `- \`typescriptPackageStandard.sourceModulePattern\`: \`${assembly.typescriptPackageStandard?.sourceModulePattern ?? ''}\``,
    `- \`typescriptPackageStandard.driverFactoryPattern\`: \`${assembly.typescriptPackageStandard?.driverFactoryPattern ?? ''}\``,
    `- \`typescriptPackageStandard.metadataSymbolPattern\`: \`${assembly.typescriptPackageStandard?.metadataSymbolPattern ?? ''}\``,
    `- \`typescriptPackageStandard.moduleSymbolPattern\`: \`${assembly.typescriptPackageStandard?.moduleSymbolPattern ?? ''}\``,
    `- \`typescriptPackageStandard.rootPublicRule\`: \`${assembly.typescriptPackageStandard?.rootPublicRule ?? ''}\``,
  ].join('\n');

  return `# Mail SDK Multilanguage Capability Matrix

This matrix is materialized from \`sdk-manifest.json\` so the official provider tiers, language
support boundaries, and maturity tiers stay exact and verifiable.

## Provider Tier Semantics

${tierSummaryLines}

## Language Maturity Semantics

${languageMaturitySummaryLines}

## Capability Standard

${capabilityStandardLines}

## Capability Negotiation Standard

${capabilityNegotiationStandardLines}

## Runtime Surface Standard

${runtimeSurfaceStandardLines}

## Runtime Immutability Standard

${runtimeImmutabilityStandardLines}

## Root Public Surface Standard

${rootPublicSurfaceStandardLines}

## Lookup Helper Naming Standard

${lookupHelperNamingStandardLines}

## Error Code Standard

${errorCodeStandardLines}

## Provider Extension Standard

${providerExtensionStandardLines}

## TypeScript Adapter Standard

${typeScriptAdapterStandardLines}

## TypeScript Package Standard

${typeScriptPackageStandardLines}

## Capability Catalog

| Capability key | Category | Surface |
| --- | --- | --- |
${capabilityCatalogRows}

## Provider Extension Catalog

| Extension key | Provider key | Display name | Surface | Access | Status |
| --- | --- | --- | --- | --- | --- |
${providerExtensionRows}

## Provider Matrix

| Provider key | Tier | Builtin | Default selected | Display name |
| --- | --- | --- | --- | --- |
${providerRows}

## Provider Capability Matrix

| Provider key | Required capabilities | Optional capabilities |
| --- | --- | --- |
${providerCapabilityRows}

## TypeScript Provider Runtime Baseline

| Provider key | Runtime bridge status | Vendor SDK requirement | SDK provisioning | Binding strategy | Bundle policy |
| --- | --- | --- | --- | --- | --- |
${typeScriptRuntimeRows}

## Language Matrix

| Language | Public package | Control SDK | Runtime bridge | Maturity tier | Current role |
| --- | --- | --- | --- | --- | --- |
${languageRows}

## Language Workspace Catalog Matrix

| Language | Workspace catalog | Public package | Control SDK | Runtime bridge | Maturity tier |
| --- | --- | --- | --- | --- | --- |
${languageWorkspaceCatalogRows}

## Language Provider Package Boundary Matrix

| Language | Mode | Root public policy | Lifecycle status terms | Runtime bridge status terms | Concrete scaffold path |
| --- | --- | --- | --- | --- | --- |
${languageProviderPackageBoundaryRows}

## Reserved Language Package Scaffold Matrix

| Language | Build system | Manifest path | Contract scaffold |
| --- | --- | --- | --- |
${reservedLanguagePackageScaffoldRows}

## Reserved Language Metadata Scaffold Matrix

| Language | Provider catalog | Provider package catalog | Provider activation catalog | Capability catalog | Provider extension catalog | Provider selection |
| --- | --- | --- | --- | --- | --- | --- |
${reservedLanguageMetadataScaffoldRows}

## Reserved Language Resolution Scaffold Matrix

| Language | Driver manager | Data source | Provider support | Provider package loader |
| --- | --- | --- | --- | --- |
${reservedLanguageResolutionScaffoldRows}

## Reserved Language Provider Package Scaffold Matrix

| Language | Scaffold path | Directory pattern | Package pattern | Manifest file name | Readme file name | Source file pattern | Source symbol pattern | Template tokens | Source template tokens | Status | Runtime bridge status | Root public | Default provider package identity | Default provider manifest path | Default provider README path | Default provider source path | Default provider source symbol |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${reservedLanguageProviderPackageScaffoldRows}

## Language Provider Activation Matrix

| Language | Provider key | Activation status | Runtime bridge | Root public | Package boundary |
| --- | --- | --- | --- | --- | --- |
${languageProviderActivationRows}

## Reading Rules

- ${renderExecutableLandingSummary(assembly)}
- The remaining official language workspaces are materialized reserved boundaries so the standard stays explicit.
- A provider package boundary may stay reserved even when the root workspace already has a verified runtime bridge.
- A workspace or provider package must not advertise runtime bridge support until it has a verified native bridge.
`;
}

function renderProviderPackageManifest(provider) {
  const packageContract = provider.typescriptPackage;
  const hasReferenceRuntimeBridge =
    provider.typescriptAdapter.runtimeBridgeStatus === 'reference-baseline';
  const peerDependencies = {
    '@sdkwork/Mail-sdk': '^0.1.1',
  };
  const peerDependenciesMeta = {};
  if (provider.providerKey === 'volcengine' && hasReferenceRuntimeBridge) {
    peerDependencies['@volcengine/Mail'] = '^4.68.3';
    peerDependenciesMeta['@volcengine/Mail'] = {
      optional: true,
    };
  }
  if (provider.providerKey === 'tencent' && hasReferenceRuntimeBridge) {
    peerDependencies['tMail-sdk-v5'] = '^5.18.0';
    peerDependenciesMeta['tMail-sdk-v5'] = {
      optional: true,
    };
  }
  const boundaryDescription = hasReferenceRuntimeBridge
    ? `Reference TypeScript provider boundary for ${provider.displayName} within sdkwork-mail-sdk`
    : `Reserved TypeScript provider boundary for ${provider.displayName} within sdkwork-mail-sdk`;

  const packageJson = {
    name: packageContract.packageName,
    version: '0.1.0',
    private: true,
    description: boundaryDescription,
    type: 'module',
    main: './index.js',
    types: './index.d.ts',
    exports: {
      '.': {
        types: './index.d.ts',
        import: './index.js',
        default: './index.js',
      },
    },
    sideEffects: false,
    files: ['index.js', 'index.d.ts', 'README.md'],
    peerDependencies,
    peerDependenciesMeta,
    devDependencies: {
      '@sdkwork/Mail-sdk': 'workspace:*',
    },
    sdkworkMailProvider: {
      providerKey: provider.providerKey,
      displayName: provider.displayName,
      tier: provider.tier,
      builtin: provider.builtin,
      status: 'package_reference_boundary',
      registrationContract: 'MailProviderModule',
      sourceModule: packageContract.sourceModule,
      driverFactory: packageContract.driverFactory,
      metadataSymbol: packageContract.metadataSymbol,
      moduleSymbol: packageContract.moduleSymbol,
      rootPublic: packageContract.rootPublic,
      requiredCapabilities: provider.requiredCapabilities ?? [],
      optionalCapabilities: provider.optionalCapabilities ?? [],
      extensionKeys: provider.extensionKeys ?? [],
      typescriptAdapter: {
        sdkProvisioning: provider.typescriptAdapter.sdkProvisioning,
        bindingStrategy: provider.typescriptAdapter.bindingStrategy,
        bundlePolicy: provider.typescriptAdapter.bundlePolicy,
        runtimeBridgeStatus: provider.typescriptAdapter.runtimeBridgeStatus,
        officialVendorSdkRequirement: provider.typescriptAdapter.officialVendorSdkRequirement,
      },
    },
  };

  return `${JSON.stringify(packageJson, null, 2)}\n`;
}

function renderProviderPackageImportPrelude(symbols) {
  return `import {
  ${symbols.join(',\n  ')},
} from '@sdkwork/Mail-sdk';
`;
}

function renderGenericProviderPackageEntrypoint(provider) {
  const packageContract = provider.typescriptPackage;
  const catalogSymbol = `${toUpperSnakeCase(provider.providerKey)}_mail_PROVIDER_CATALOG_ENTRY`;

  return `${renderProviderPackageImportPrelude([
    catalogSymbol,
    'createMailProviderDriver',
    'createMailProviderModule',
  ])}

export const ${packageContract.metadataSymbol} = ${catalogSymbol};

export function ${packageContract.driverFactory}(options = {}) {
  return createMailProviderDriver({
    metadata: ${packageContract.metadataSymbol},
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const ${packageContract.moduleSymbol} = createMailProviderModule({
  packageName: ${packageContract.metadataSymbol}.typescriptPackage.packageName,
  metadata: ${packageContract.metadataSymbol},
  builtin: ${catalogSymbol}.builtin,
  createDriver: ${packageContract.driverFactory},
});
`;
}

function renderVolcengineProviderPackageEntrypoint(provider) {
  const packageContract = provider.typescriptPackage;
  const catalogSymbol = 'VOLCENGINE_mail_PROVIDER_CATALOG_ENTRY';

  return `${renderProviderPackageImportPrelude([
    catalogSymbol,
    'MailSdkException',
    'createMailProviderDriver',
    'createMailProviderModule',
  ])}

export const ${packageContract.metadataSymbol} = ${catalogSymbol};

async function defaultLoadVolcengineWebSdk() {
  try {
    return await import('@volcengine/Mail');
  } catch (error) {
    throw new MailSdkException({
      code: 'native_sdk_not_available',
      message: 'Official Volcengine Web Mail SDK package "@volcengine/Mail" is not available.',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      pluginId: ${packageContract.metadataSymbol}.pluginId,
      details: {
        packageName: '@volcengine/Mail',
      },
      cause: error,
    });
  }
}

function resolveNativeConfig(config) {
  const nativeConfig = config.nativeConfig ?? {};

  if (
    nativeConfig === null ||
    typeof nativeConfig !== 'object' ||
    Array.isArray(nativeConfig)
  ) {
    throw new MailSdkException({
      code: 'invalid_native_config',
      message: 'Mail nativeConfig must be an object for the official Volcengine Web bridge.',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      pluginId: ${packageContract.metadataSymbol}.pluginId,
    });
  }

  return nativeConfig;
}

function assertRequiredVolcengineConfig(nativeConfig) {
  if (nativeConfig.appId) {
    return;
  }

  throw new MailSdkException({
    code: 'invalid_native_config',
    message: 'Official Volcengine Web Mail runtime requires nativeConfig.appId.',
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      missingConfigKeys: ['appId'],
    },
  });
}

function resolveVolcengineWebSdkModule(sdkModule) {
  const candidate =
    sdkModule &&
    typeof sdkModule === 'object' &&
    typeof sdkModule.createEngine !== 'function'
      ? sdkModule.default
      : sdkModule;

  if (
    !candidate ||
    typeof candidate.createEngine !== 'function' ||
    typeof candidate.destroyEngine !== 'function'
  ) {
    throw new MailSdkException({
      code: 'native_sdk_not_available',
      message: 'Official Volcengine Web Mail SDK package "@volcengine/Mail" did not expose createEngine and destroyEngine.',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      pluginId: ${packageContract.metadataSymbol}.pluginId,
      details: {
        packageName: '@volcengine/Mail',
        expectedExports: ['createEngine', 'destroyEngine'],
      },
    });
  }

  return candidate;
}

async function ensureEngine(context) {
  const nativeConfig = resolveNativeConfig(context.nativeClient.resolvedConfig);
  assertRequiredVolcengineConfig(nativeConfig);

  if (!context.nativeClient.sdkModule) {
    context.nativeClient.sdkModule = resolveVolcengineWebSdkModule(
      await context.nativeClient.loadSdk(),
    );
  }

  if (!context.nativeClient.engine) {
    context.nativeClient.engine = context.nativeClient.sdkModule.createEngine(
      nativeConfig.appId,
      nativeConfig.engineConfig,
    );
  }

  return {
    nativeConfig,
    sdkModule: context.nativeClient.sdkModule,
    engine: context.nativeClient.engine,
  };
}

function buildMailSessionDescriptor(options) {
  return {
    sessionId: options.sessionId,
    roomId: options.roomId,
    participantId: options.participantId,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    connectionState: 'joined',
  };
}

function buildUserInfo(options, nativeConfig) {
  const mergedExtraInfo = {
    ...(nativeConfig.userExtraInfo ?? {}),
    ...(options.metadata ?? {}),
  };

  return {
    userId: options.participantId,
    extraInfo:
      Object.keys(mergedExtraInfo).length > 0
        ? JSON.stringify(mergedExtraInfo)
        : undefined,
  };
}

async function publishMediaKind(engine, nativeConfig, kind) {
  if (kind === 'audio') {
    await engine.startAudioCapture(nativeConfig.capture?.audioDeviceId);
    await engine.publishStream('audio');
    return;
  }

  if (kind === 'screen-share') {
    await engine.startScreenCapture(nativeConfig.capture?.screen);
    await engine.publishScreen();
    return;
  }

  await engine.startVideoCapture(nativeConfig.capture?.videoDeviceId);
  await engine.publishStream('video');
}

async function unpublishMediaKind(engine, kind) {
  if (kind === 'screen-share') {
    await engine.unpublishScreen();
    await engine.stopScreenCapture();
    return;
  }

  await engine.unpublishStream(kind);
  if (kind === 'audio') {
    await engine.stopAudioCapture();
    return;
  }

  await engine.stopVideoCapture();
}

async function muteMediaKind(engine, nativeConfig, kind, muted) {
  if (kind === 'audio') {
    if (muted) {
      await engine.stopAudioCapture();
      await engine.unpublishStream('audio');
    } else {
      await engine.startAudioCapture(nativeConfig.capture?.audioDeviceId);
      await engine.publishStream('audio');
    }

    return {
      kind: 'audio',
      muted,
    };
  }

  if (muted) {
    await engine.stopVideoCapture();
    await engine.unpublishStream('video');
  } else {
    await engine.startVideoCapture(nativeConfig.capture?.videoDeviceId);
    await engine.publishStream('video');
  }

  return {
    kind: 'video',
    muted,
  };
}

function isLocalMediaKind(kind) {
  return kind === 'audio' || kind === 'video';
}

function hasPublishedMediaKind(nativeClient, kind) {
  for (const publishedKind of nativeClient.publishedTracks.values()) {
    if (publishedKind === kind) {
      return true;
    }
  }

  return false;
}

function hasOtherPublishedMediaKind(nativeClient, trackId, kind) {
  for (const [publishedTrackId, publishedKind] of nativeClient.publishedTracks.entries()) {
    if (publishedTrackId !== trackId && publishedKind === kind) {
      return true;
    }
  }

  return false;
}

function markMediaKindActive(nativeClient, kind) {
  if (isLocalMediaKind(kind)) {
    nativeClient.mutedMediaKinds.delete(kind);
  }
}

function markMediaKindMuted(nativeClient, kind, muted) {
  if (!isLocalMediaKind(kind)) {
    return;
  }

  if (muted) {
    nativeClient.mutedMediaKinds.add(kind);
    return;
  }

  nativeClient.mutedMediaKinds.delete(kind);
}

function forgetPublishedTrack(nativeClient, trackId, kind) {
  nativeClient.publishedTracks.delete(trackId);
  if (isLocalMediaKind(kind) && !hasPublishedMediaKind(nativeClient, kind)) {
    nativeClient.mutedMediaKinds.delete(kind);
  }
}

function shouldApplyMute(nativeClient, kind, muted) {
  if (!hasPublishedMediaKind(nativeClient, kind)) {
    return false;
  }

  return nativeClient.mutedMediaKinds.has(kind) !== muted;
}

function resolveTrackPublicationMuted(nativeClient, kind) {
  return isLocalMediaKind(kind) && nativeClient.mutedMediaKinds.has(kind);
}

function shouldPublishNativeMedia(nativeClient, kind) {
  return !hasPublishedMediaKind(nativeClient, kind);
}

function shouldUnpublishNativeMedia(nativeClient, trackId, kind) {
  if (kind === 'screen-share') {
    return true;
  }

  return (
    !nativeClient.mutedMediaKinds.has(kind) &&
    !hasOtherPublishedMediaKind(nativeClient, trackId, kind)
  );
}

function assertTrackKindReusable(nativeClient, trackId, kind) {
  const existingKind = nativeClient.publishedTracks.get(trackId);
  if (!existingKind || existingKind === kind) {
    return;
  }

  throw new MailSdkException({
    code: 'vendor_error',
    message: \`Mail track id "\${trackId}" is already published as "\${existingKind}" and cannot be republished as "\${kind}".\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      trackId,
      existingKind,
      requestedKind: kind,
    },
  });
}

function getActiveScreenShareTrackId(nativeClient) {
  for (const [publishedTrackId, publishedKind] of nativeClient.publishedTracks.entries()) {
    if (publishedKind === 'screen-share') {
      return publishedTrackId;
    }
  }

  return undefined;
}

function assertScreenShareTrackAvailable(nativeClient, trackId) {
  const activeTrackId = getActiveScreenShareTrackId(nativeClient);
  if (!activeTrackId || activeTrackId === trackId) {
    return;
  }

  throw new MailSdkException({
    code: 'vendor_error',
    message: \`Mail screen share is already active on track "\${activeTrackId}" and cannot be started as "\${trackId}".\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      activeTrackId,
      requestedTrackId: trackId,
      kind: 'screen-share',
    },
  });
}

function assertTrackPublishable(nativeClient, trackId, kind) {
  assertTrackKindReusable(nativeClient, trackId, kind);
  if (kind === 'screen-share') {
    assertScreenShareTrackAvailable(nativeClient, trackId);
  }
}

function assertJoined(nativeClient, operation) {
  const currentState = nativeClient.joinedSession?.connectionState ?? 'left';
  if (currentState === 'joined') {
    return;
  }

  throw new MailSdkException({
    code: 'vendor_error',
    message: \`Mail operation "\${operation}" requires a joined room before local media can be controlled.\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      operation,
      requiredState: 'joined',
      currentState,
    },
  });
}

async function drainPublishedMedia(engine, nativeClient) {
  for (const [trackId, mediaKind] of Array.from(nativeClient.publishedTracks.entries())) {
    if (!nativeClient.publishedTracks.has(trackId)) {
      continue;
    }

    if (shouldUnpublishNativeMedia(nativeClient, trackId, mediaKind)) {
      await unpublishMediaKind(engine, mediaKind);
    }
    forgetPublishedTrack(nativeClient, trackId, mediaKind);
  }

  nativeClient.publishedTracks.clear();
  nativeClient.mutedMediaKinds.clear();
}

function resolvePublishedMediaKind(options) {
  if (
    options.kind === 'audio' ||
    options.kind === 'video' ||
    options.kind === 'screen-share'
  ) {
    return options.kind;
  }

  throw new MailSdkException({
    code: 'capability_not_supported',
    message: \`Official Volcengine Web bridge does not support publishing track kind "\${options.kind}" through the standard runtime surface.\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      kind: options.kind,
    },
  });
}

const OFFICIAL_VOLCENGINE_WEB_RUNTIME_CONTROLLER = {
  async join(options, context) {
    const { nativeConfig, engine } = await ensureEngine(context);
    await engine.joinRoom(
      options.token ?? null,
      options.roomId,
      buildUserInfo(options, nativeConfig),
      nativeConfig.roomConfig,
    );

    const sessionDescriptor = buildMailSessionDescriptor(options);
    context.nativeClient.joinedSession = sessionDescriptor;
    return sessionDescriptor;
  },
  async leave(context) {
    if (!context.nativeClient.engine) {
      return (
        context.nativeClient.joinedSession ?? {
          sessionId: '',
          roomId: '',
          participantId: '',
          providerKey: ${packageContract.metadataSymbol}.providerKey,
          connectionState: 'left',
        }
      );
    }

    const engine = context.nativeClient.engine;
    await drainPublishedMedia(engine, context.nativeClient);
    await engine.leaveRoom();
    context.nativeClient.sdkModule?.destroyEngine(engine);
    const joinedSession = context.nativeClient.joinedSession;
    context.nativeClient.engine = undefined;
    context.nativeClient.joinedSession = undefined;
    context.nativeClient.publishedTracks.clear();
    context.nativeClient.mutedMediaKinds.clear();

    return {
      sessionId: joinedSession?.sessionId ?? '',
      roomId: joinedSession?.roomId ?? '',
      participantId: joinedSession?.participantId ?? '',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      connectionState: 'left',
    };
  },
  async publish(options, context) {
    assertJoined(context.nativeClient, 'publish');
    const mediaKind = resolvePublishedMediaKind(options);
    assertTrackPublishable(context.nativeClient, options.trackId, mediaKind);
    const { nativeConfig, engine } = await ensureEngine(context);
    const shouldPublish = shouldPublishNativeMedia(context.nativeClient, mediaKind);
    if (shouldPublish) {
      await publishMediaKind(engine, nativeConfig, mediaKind);
    }
    context.nativeClient.publishedTracks.set(options.trackId, mediaKind);
    if (shouldPublish) {
      markMediaKindActive(context.nativeClient, mediaKind);
    }
    return {
      trackId: options.trackId,
      kind: options.kind,
      muted: resolveTrackPublicationMuted(context.nativeClient, mediaKind),
    };
  },
  async unpublish(trackId, context) {
    const mediaKind = context.nativeClient.publishedTracks.get(trackId);
    if (!mediaKind) {
      return;
    }

    if (shouldUnpublishNativeMedia(context.nativeClient, trackId, mediaKind)) {
      const { engine } = await ensureEngine(context);
      await unpublishMediaKind(engine, mediaKind);
    }
    forgetPublishedTrack(context.nativeClient, trackId, mediaKind);
  },
  async startScreenShare(options, context) {
    assertJoined(context.nativeClient, 'startScreenShare');
    assertTrackPublishable(context.nativeClient, options.trackId, 'screen-share');
    const { nativeConfig, engine } = await ensureEngine(context);
    const shouldPublish = shouldPublishNativeMedia(context.nativeClient, 'screen-share');
    if (shouldPublish) {
      await publishMediaKind(engine, nativeConfig, 'screen-share');
    }
    context.nativeClient.publishedTracks.set(options.trackId, 'screen-share');
    return {
      trackId: options.trackId,
      kind: 'screen-share',
      muted: false,
    };
  },
  async stopScreenShare(trackId, context) {
    const mediaKind = context.nativeClient.publishedTracks.get(trackId);
    if (mediaKind !== 'screen-share') {
      return;
    }

    const { engine } = await ensureEngine(context);
    await unpublishMediaKind(engine, 'screen-share');
    context.nativeClient.publishedTracks.delete(trackId);
  },
  async muteAudio(muted, context) {
    assertJoined(context.nativeClient, 'muteAudio');
    if (!shouldApplyMute(context.nativeClient, 'audio', muted)) {
      return {
        kind: 'audio',
        muted,
      };
    }

    const { nativeConfig, engine } = await ensureEngine(context);
    const muteState = await muteMediaKind(engine, nativeConfig, 'audio', muted);
    markMediaKindMuted(context.nativeClient, 'audio', muted);
    return muteState;
  },
  async muteVideo(muted, context) {
    assertJoined(context.nativeClient, 'muteVideo');
    if (!shouldApplyMute(context.nativeClient, 'video', muted)) {
      return {
        kind: 'video',
        muted,
      };
    }

    const { nativeConfig, engine } = await ensureEngine(context);
    const muteState = await muteMediaKind(engine, nativeConfig, 'video', muted);
    markMediaKindMuted(context.nativeClient, 'video', muted);
    return muteState;
  },
};

export function createOfficialVolcengineWebMailDriver(options = {}) {
  const loadSdk = options.loadSdk ?? defaultLoadVolcengineWebSdk;

  return createMailProviderDriver({
    metadata: ${packageContract.metadataSymbol},
    nativeFactory(config) {
      return {
        resolvedConfig: config,
        loadSdk,
        publishedTracks: new Map(),
        mutedMediaKinds: new Set(),
      };
    },
    runtimeController: OFFICIAL_VOLCENGINE_WEB_RUNTIME_CONTROLLER,
  });
}

export function ${packageContract.driverFactory}(options = {}) {
  if (!options.nativeFactory && !options.runtimeController) {
    return createOfficialVolcengineWebMailDriver({
      loadSdk: options.loadSdk,
    });
  }

  return createMailProviderDriver({
    metadata: ${packageContract.metadataSymbol},
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const ${packageContract.moduleSymbol} = createMailProviderModule({
  packageName: ${packageContract.metadataSymbol}.typescriptPackage.packageName,
  metadata: ${packageContract.metadataSymbol},
  builtin: ${catalogSymbol}.builtin,
  createDriver: ${packageContract.driverFactory},
});
`;
}

function renderTencentProviderPackageEntrypoint(provider) {
  const packageContract = provider.typescriptPackage;
  const catalogSymbol = 'TENCENT_mail_PROVIDER_CATALOG_ENTRY';

  return `${renderProviderPackageImportPrelude([
    catalogSymbol,
    'MailSdkException',
    'createMailProviderDriver',
    'createMailProviderModule',
  ])}

export const ${packageContract.metadataSymbol} = ${catalogSymbol};

async function defaultLoadTencentWebSdk() {
  try {
    return await import('tMail-sdk-v5');
  } catch (error) {
    throw new MailSdkException({
      code: 'native_sdk_not_available',
      message: 'Official Tencent TMail Web SDK package "tMail-sdk-v5" is not available.',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      pluginId: ${packageContract.metadataSymbol}.pluginId,
      details: {
        packageName: 'tMail-sdk-v5',
      },
      cause: error,
    });
  }
}

function resolveNativeConfig(config) {
  const nativeConfig = config.nativeConfig ?? {};

  if (
    nativeConfig === null ||
    typeof nativeConfig !== 'object' ||
    Array.isArray(nativeConfig)
  ) {
    throw new MailSdkException({
      code: 'invalid_native_config',
      message: 'Mail nativeConfig must be an object for the official Tencent Web bridge.',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      pluginId: ${packageContract.metadataSymbol}.pluginId,
    });
  }

  return nativeConfig;
}

function assertRequiredTencentConfig(nativeConfig) {
  const missingConfigKeys = [];
  if (!nativeConfig.sdkAppId) {
    missingConfigKeys.push('sdkAppId');
  }
  if (!nativeConfig.userSig) {
    missingConfigKeys.push('userSig');
  }

  if (missingConfigKeys.length === 0) {
    return;
  }

  throw new MailSdkException({
    code: 'invalid_native_config',
    message: 'Official Tencent Web Mail runtime requires nativeConfig.sdkAppId and nativeConfig.userSig.',
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      missingConfigKeys,
    },
  });
}

function resolveTencentWebSdkModule(sdkModule) {
  const candidate =
    sdkModule &&
    typeof sdkModule === 'object' &&
    typeof sdkModule.create !== 'function'
      ? sdkModule.default
      : sdkModule;

  if (!candidate || typeof candidate.create !== 'function') {
    throw new MailSdkException({
      code: 'native_sdk_not_available',
      message: 'Official Tencent TMail Web SDK package "tMail-sdk-v5" did not expose create.',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      pluginId: ${packageContract.metadataSymbol}.pluginId,
      details: {
        packageName: 'tMail-sdk-v5',
        expectedExports: ['create'],
      },
    });
  }

  return candidate;
}

async function ensureTMail(context) {
  const nativeConfig = resolveNativeConfig(context.nativeClient.resolvedConfig);
  assertRequiredTencentConfig(nativeConfig);

  if (!context.nativeClient.sdkModule) {
    context.nativeClient.sdkModule = resolveTencentWebSdkModule(
      await context.nativeClient.loadSdk(),
    );
  }

  if (!context.nativeClient.tMail) {
    context.nativeClient.tMail = context.nativeClient.sdkModule.create();
  }

  return {
    nativeConfig,
    sdkModule: context.nativeClient.sdkModule,
    tMail: context.nativeClient.tMail,
  };
}

function buildMailSessionDescriptor(options) {
  return {
    sessionId: options.sessionId,
    roomId: options.roomId,
    participantId: options.participantId,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    connectionState: 'joined',
  };
}

function resolveTencentRoomId(roomId) {
  const normalizedRoomId = String(roomId).trim();
  if (/^\\d+$/.test(normalizedRoomId)) {
    return Number(normalizedRoomId);
  }

  return roomId;
}

function buildEnterRoomOptions(options, nativeConfig) {
  return {
    sdkAppId: Number(nativeConfig.sdkAppId),
    roomId: resolveTencentRoomId(options.roomId),
    userId: options.participantId,
    userSig: nativeConfig.userSig,
    ...(nativeConfig.scene ? { scene: nativeConfig.scene } : {}),
    ...(nativeConfig.role ? { role: nativeConfig.role } : {}),
    ...(nativeConfig.privateMapKey ? { privateMapKey: nativeConfig.privateMapKey } : {}),
  };
}

async function publishMediaKind(tMail, nativeConfig, kind) {
  if (kind === 'audio') {
    await tMail.startLocalAudio(nativeConfig.audio);
    return;
  }

  if (kind === 'screen-share') {
    await tMail.startScreenShare(nativeConfig.screen);
    return;
  }

  await tMail.startLocalVideo(nativeConfig.video);
}

async function unpublishMediaKind(tMail, kind) {
  if (kind === 'audio') {
    await tMail.stopLocalAudio();
    return;
  }

  if (kind === 'screen-share') {
    await tMail.stopScreenShare();
    return;
  }

  await tMail.stopLocalVideo();
}

async function muteMediaKind(tMail, nativeConfig, kind, muted) {
  if (muted) {
    await unpublishMediaKind(tMail, kind);
  } else {
    await publishMediaKind(tMail, nativeConfig, kind);
  }

  return {
    kind,
    muted,
  };
}

function isLocalMediaKind(kind) {
  return kind === 'audio' || kind === 'video';
}

function hasPublishedMediaKind(nativeClient, kind) {
  for (const publishedKind of nativeClient.publishedTracks.values()) {
    if (publishedKind === kind) {
      return true;
    }
  }

  return false;
}

function hasOtherPublishedMediaKind(nativeClient, trackId, kind) {
  for (const [publishedTrackId, publishedKind] of nativeClient.publishedTracks.entries()) {
    if (publishedTrackId !== trackId && publishedKind === kind) {
      return true;
    }
  }

  return false;
}

function markMediaKindActive(nativeClient, kind) {
  if (isLocalMediaKind(kind)) {
    nativeClient.mutedMediaKinds.delete(kind);
  }
}

function markMediaKindMuted(nativeClient, kind, muted) {
  if (!isLocalMediaKind(kind)) {
    return;
  }

  if (muted) {
    nativeClient.mutedMediaKinds.add(kind);
    return;
  }

  nativeClient.mutedMediaKinds.delete(kind);
}

function forgetPublishedTrack(nativeClient, trackId, kind) {
  nativeClient.publishedTracks.delete(trackId);
  if (isLocalMediaKind(kind) && !hasPublishedMediaKind(nativeClient, kind)) {
    nativeClient.mutedMediaKinds.delete(kind);
  }
}

function shouldApplyMute(nativeClient, kind, muted) {
  if (!hasPublishedMediaKind(nativeClient, kind)) {
    return false;
  }

  return nativeClient.mutedMediaKinds.has(kind) !== muted;
}

function resolveTrackPublicationMuted(nativeClient, kind) {
  return isLocalMediaKind(kind) && nativeClient.mutedMediaKinds.has(kind);
}

function shouldPublishNativeMedia(nativeClient, kind) {
  return !hasPublishedMediaKind(nativeClient, kind);
}

function shouldUnpublishNativeMedia(nativeClient, trackId, kind) {
  if (kind === 'screen-share') {
    return true;
  }

  return (
    !nativeClient.mutedMediaKinds.has(kind) &&
    !hasOtherPublishedMediaKind(nativeClient, trackId, kind)
  );
}

function assertTrackKindReusable(nativeClient, trackId, kind) {
  const existingKind = nativeClient.publishedTracks.get(trackId);
  if (!existingKind || existingKind === kind) {
    return;
  }

  throw new MailSdkException({
    code: 'vendor_error',
    message: \`Mail track id "\${trackId}" is already published as "\${existingKind}" and cannot be republished as "\${kind}".\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      trackId,
      existingKind,
      requestedKind: kind,
    },
  });
}

function getActiveScreenShareTrackId(nativeClient) {
  for (const [publishedTrackId, publishedKind] of nativeClient.publishedTracks.entries()) {
    if (publishedKind === 'screen-share') {
      return publishedTrackId;
    }
  }

  return undefined;
}

function assertScreenShareTrackAvailable(nativeClient, trackId) {
  const activeTrackId = getActiveScreenShareTrackId(nativeClient);
  if (!activeTrackId || activeTrackId === trackId) {
    return;
  }

  throw new MailSdkException({
    code: 'vendor_error',
    message: \`Mail screen share is already active on track "\${activeTrackId}" and cannot be started as "\${trackId}".\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      activeTrackId,
      requestedTrackId: trackId,
      kind: 'screen-share',
    },
  });
}

function assertTrackPublishable(nativeClient, trackId, kind) {
  assertTrackKindReusable(nativeClient, trackId, kind);
  if (kind === 'screen-share') {
    assertScreenShareTrackAvailable(nativeClient, trackId);
  }
}

function assertJoined(nativeClient, operation) {
  const currentState = nativeClient.joinedSession?.connectionState ?? 'left';
  if (currentState === 'joined') {
    return;
  }

  throw new MailSdkException({
    code: 'vendor_error',
    message: \`Mail operation "\${operation}" requires a joined room before local media can be controlled.\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      operation,
      requiredState: 'joined',
      currentState,
    },
  });
}

async function drainPublishedMedia(tMail, nativeClient) {
  for (const [trackId, mediaKind] of Array.from(nativeClient.publishedTracks.entries())) {
    if (!nativeClient.publishedTracks.has(trackId)) {
      continue;
    }

    if (shouldUnpublishNativeMedia(nativeClient, trackId, mediaKind)) {
      await unpublishMediaKind(tMail, mediaKind);
    }
    forgetPublishedTrack(nativeClient, trackId, mediaKind);
  }

  nativeClient.publishedTracks.clear();
  nativeClient.mutedMediaKinds.clear();
}

function resolvePublishedMediaKind(options) {
  if (
    options.kind === 'audio' ||
    options.kind === 'video' ||
    options.kind === 'screen-share'
  ) {
    return options.kind;
  }

  throw new MailSdkException({
    code: 'capability_not_supported',
    message: \`Official Tencent Web bridge does not support publishing track kind "\${options.kind}" through the standard runtime surface.\`,
    providerKey: ${packageContract.metadataSymbol}.providerKey,
    pluginId: ${packageContract.metadataSymbol}.pluginId,
    details: {
      kind: options.kind,
    },
  });
}

const OFFICIAL_TENCENT_WEB_RUNTIME_CONTROLLER = {
  async join(options, context) {
    const { nativeConfig, tMail } = await ensureTMail(context);
    await tMail.enterRoom(buildEnterRoomOptions(options, nativeConfig));

    const sessionDescriptor = buildMailSessionDescriptor(options);
    context.nativeClient.joinedSession = sessionDescriptor;
    return sessionDescriptor;
  },
  async leave(context) {
    if (!context.nativeClient.tMail) {
      return (
        context.nativeClient.joinedSession ?? {
          sessionId: '',
          roomId: '',
          participantId: '',
          providerKey: ${packageContract.metadataSymbol}.providerKey,
          connectionState: 'left',
        }
      );
    }

    const tMail = context.nativeClient.tMail;
    await drainPublishedMedia(tMail, context.nativeClient);
    await tMail.exitRoom();
    await tMail.destroy?.();
    const joinedSession = context.nativeClient.joinedSession;
    context.nativeClient.tMail = undefined;
    context.nativeClient.joinedSession = undefined;
    context.nativeClient.publishedTracks.clear();
    context.nativeClient.mutedMediaKinds.clear();

    return {
      sessionId: joinedSession?.sessionId ?? '',
      roomId: joinedSession?.roomId ?? '',
      participantId: joinedSession?.participantId ?? '',
      providerKey: ${packageContract.metadataSymbol}.providerKey,
      connectionState: 'left',
    };
  },
  async publish(options, context) {
    assertJoined(context.nativeClient, 'publish');
    const mediaKind = resolvePublishedMediaKind(options);
    assertTrackPublishable(context.nativeClient, options.trackId, mediaKind);
    const { nativeConfig, tMail } = await ensureTMail(context);
    const shouldPublish = shouldPublishNativeMedia(context.nativeClient, mediaKind);
    if (shouldPublish) {
      await publishMediaKind(tMail, nativeConfig, mediaKind);
    }
    context.nativeClient.publishedTracks.set(options.trackId, mediaKind);
    if (shouldPublish) {
      markMediaKindActive(context.nativeClient, mediaKind);
    }
    return {
      trackId: options.trackId,
      kind: options.kind,
      muted: resolveTrackPublicationMuted(context.nativeClient, mediaKind),
    };
  },
  async unpublish(trackId, context) {
    const mediaKind = context.nativeClient.publishedTracks.get(trackId);
    if (!mediaKind) {
      return;
    }

    if (shouldUnpublishNativeMedia(context.nativeClient, trackId, mediaKind)) {
      const { tMail } = await ensureTMail(context);
      await unpublishMediaKind(tMail, mediaKind);
    }
    forgetPublishedTrack(context.nativeClient, trackId, mediaKind);
  },
  async startScreenShare(options, context) {
    assertJoined(context.nativeClient, 'startScreenShare');
    assertTrackPublishable(context.nativeClient, options.trackId, 'screen-share');
    const { nativeConfig, tMail } = await ensureTMail(context);
    const shouldPublish = shouldPublishNativeMedia(context.nativeClient, 'screen-share');
    if (shouldPublish) {
      await publishMediaKind(tMail, nativeConfig, 'screen-share');
    }
    context.nativeClient.publishedTracks.set(options.trackId, 'screen-share');
    return {
      trackId: options.trackId,
      kind: 'screen-share',
      muted: false,
    };
  },
  async stopScreenShare(trackId, context) {
    const mediaKind = context.nativeClient.publishedTracks.get(trackId);
    if (mediaKind !== 'screen-share') {
      return;
    }

    const { tMail } = await ensureTMail(context);
    await unpublishMediaKind(tMail, 'screen-share');
    context.nativeClient.publishedTracks.delete(trackId);
  },
  async muteAudio(muted, context) {
    assertJoined(context.nativeClient, 'muteAudio');
    if (!shouldApplyMute(context.nativeClient, 'audio', muted)) {
      return {
        kind: 'audio',
        muted,
      };
    }

    const { nativeConfig, tMail } = await ensureTMail(context);
    const muteState = await muteMediaKind(tMail, nativeConfig, 'audio', muted);
    markMediaKindMuted(context.nativeClient, 'audio', muted);
    return muteState;
  },
  async muteVideo(muted, context) {
    assertJoined(context.nativeClient, 'muteVideo');
    if (!shouldApplyMute(context.nativeClient, 'video', muted)) {
      return {
        kind: 'video',
        muted,
      };
    }

    const { nativeConfig, tMail } = await ensureTMail(context);
    const muteState = await muteMediaKind(tMail, nativeConfig, 'video', muted);
    markMediaKindMuted(context.nativeClient, 'video', muted);
    return muteState;
  },
};

export function createOfficialTencentWebMailDriver(options = {}) {
  const loadSdk = options.loadSdk ?? defaultLoadTencentWebSdk;

  return createMailProviderDriver({
    metadata: ${packageContract.metadataSymbol},
    nativeFactory(config) {
      return {
        resolvedConfig: config,
        loadSdk,
        publishedTracks: new Map(),
        mutedMediaKinds: new Set(),
      };
    },
    runtimeController: OFFICIAL_TENCENT_WEB_RUNTIME_CONTROLLER,
  });
}

export function ${packageContract.driverFactory}(options = {}) {
  if (!options.nativeFactory && !options.runtimeController) {
    return createOfficialTencentWebMailDriver({
      loadSdk: options.loadSdk,
    });
  }

  return createMailProviderDriver({
    metadata: ${packageContract.metadataSymbol},
    nativeFactory: options.nativeFactory,
    runtimeController: options.runtimeController,
  });
}

export const ${packageContract.moduleSymbol} = createMailProviderModule({
  packageName: ${packageContract.metadataSymbol}.typescriptPackage.packageName,
  metadata: ${packageContract.metadataSymbol},
  builtin: ${catalogSymbol}.builtin,
  createDriver: ${packageContract.driverFactory},
});
`;
}

function renderProviderPackageEntrypoint(provider) {
  if (provider.providerKey === 'volcengine') {
    return renderVolcengineProviderPackageEntrypoint(provider);
  }

  if (provider.providerKey === 'tencent') {
    return renderTencentProviderPackageEntrypoint(provider);
  }

  return renderGenericProviderPackageEntrypoint(provider);
}

function renderProviderPackageDeclarationEntrypoint(provider) {
  const packageContract = provider.typescriptPackage;

  if (provider.providerKey === 'volcengine') {
    return `import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
  MailResolvedClientConfig,
  MailSessionDescriptor,
} from '@sdkwork/Mail-sdk';

export interface MailVolcengineWebSdkModule {
  createEngine(appId: string, config?: Record<string, unknown>): MailVolcengineWebEngineLike;
  destroyEngine(engine: MailVolcengineWebEngineLike): void;
}

export interface MailVolcengineWebSdkModuleNamespace {
  default?: MailVolcengineWebSdkModule;
}

export type MailVolcengineWebSdkModuleLoadResult =
  | MailVolcengineWebSdkModule
  | MailVolcengineWebSdkModuleNamespace;

export interface MailVolcengineWebEngineLike {
  joinRoom(
    token: string | null,
    roomId: string,
    userInfo: {
      userId: string;
      extraInfo?: string;
    },
    roomConfig?: Record<string, unknown>,
  ): Promise<void>;
  leaveRoom(waitAck?: boolean): Promise<void>;
  publishStream(mediaType: 'audio' | 'video'): Promise<void>;
  unpublishStream(mediaType: 'audio' | 'video'): Promise<void>;
  startScreenCapture(config?: Record<string, unknown>): Promise<unknown>;
  stopScreenCapture(): Promise<void>;
  publishScreen(): Promise<void>;
  unpublishScreen(): Promise<void>;
  startVideoCapture(deviceId?: string): Promise<unknown>;
  stopVideoCapture(): Promise<void>;
  startAudioCapture(deviceId?: string): Promise<unknown>;
  stopAudioCapture(): Promise<void>;
}

export interface MailVolcengineWebNativeConfig {
  appId?: string;
  engineConfig?: Record<string, unknown>;
  roomConfig?: Record<string, unknown>;
  userExtraInfo?: Record<string, unknown>;
  capture?: {
    audioDeviceId?: string;
    videoDeviceId?: string;
    screen?: Record<string, unknown>;
  };
}

export interface MailVolcengineOfficialWebNativeClient {
  readonly resolvedConfig: MailResolvedClientConfig;
  readonly loadSdk: () => Promise<MailVolcengineWebSdkModuleLoadResult>;
  sdkModule?: MailVolcengineWebSdkModule;
  engine?: MailVolcengineWebEngineLike;
  joinedSession?: MailSessionDescriptor;
  publishedTracks: Map<string, 'audio' | 'video' | 'screen-share'>;
  mutedMediaKinds: Set<'audio' | 'video'>;
}

export interface CreateOfficialVolcengineWebMailDriverOptions {
  loadSdk?: () => Promise<MailVolcengineWebSdkModuleLoadResult>;
}

export const ${packageContract.metadataSymbol}: MailProviderCatalogEntry;

export function createOfficialVolcengineWebMailDriver(
  options?: CreateOfficialVolcengineWebMailDriverOptions,
): MailProviderDriver<MailVolcengineOfficialWebNativeClient>;

export type CreateVolcengineMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
> &
  CreateOfficialVolcengineWebMailDriverOptions;

export function ${packageContract.driverFactory}<TNativeClient = unknown>(
  options?: CreateVolcengineMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient | MailVolcengineOfficialWebNativeClient>;

export const ${packageContract.moduleSymbol}: MailProviderModule;
`;
  }

  if (provider.providerKey === 'tencent') {
    return `import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
  MailResolvedClientConfig,
  MailSessionDescriptor,
} from '@sdkwork/Mail-sdk';

export interface MailTencentWebSdkModule {
  create(): MailTencentWebTMailLike;
}

export interface MailTencentWebSdkModuleNamespace {
  default?: MailTencentWebSdkModule;
}

export type MailTencentWebSdkModuleLoadResult =
  | MailTencentWebSdkModule
  | MailTencentWebSdkModuleNamespace;

export interface MailTencentWebTMailLike {
  enterRoom(options: MailTencentWebEnterRoomOptions): Promise<void>;
  exitRoom(): Promise<void>;
  destroy?(): Promise<void> | void;
  startLocalAudio(options?: MailTencentWebAudioOptions): Promise<void>;
  stopLocalAudio(): Promise<void>;
  startLocalVideo(options?: MailTencentWebVideoOptions): Promise<void>;
  stopLocalVideo(): Promise<void>;
  startScreenShare(options?: MailTencentWebScreenShareOptions): Promise<void>;
  stopScreenShare(): Promise<void>;
}

export interface MailTencentWebEnterRoomOptions {
  sdkAppId: number;
  roomId: number | string;
  userId: string;
  userSig: string;
  scene?: string;
  role?: string;
  privateMapKey?: string;
}

export interface MailTencentWebAudioOptions {
  microphoneId?: string;
  profile?: string;
  [key: string]: unknown;
}

export interface MailTencentWebVideoOptions {
  cameraId?: string;
  view?: unknown;
  profile?: string;
  [key: string]: unknown;
}

export interface MailTencentWebScreenShareOptions {
  option?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MailTencentWebNativeConfig {
  sdkAppId?: number | string;
  userSig?: string;
  scene?: string;
  role?: string;
  privateMapKey?: string;
  audio?: MailTencentWebAudioOptions;
  video?: MailTencentWebVideoOptions;
  screen?: MailTencentWebScreenShareOptions;
}

export interface MailTencentOfficialWebNativeClient {
  readonly resolvedConfig: MailResolvedClientConfig;
  readonly loadSdk: () => Promise<MailTencentWebSdkModuleLoadResult>;
  sdkModule?: MailTencentWebSdkModule;
  tMail?: MailTencentWebTMailLike;
  joinedSession?: MailSessionDescriptor;
  publishedTracks: Map<string, 'audio' | 'video' | 'screen-share'>;
  mutedMediaKinds: Set<'audio' | 'video'>;
}

export interface CreateOfficialTencentWebMailDriverOptions {
  loadSdk?: () => Promise<MailTencentWebSdkModuleLoadResult>;
}

export const ${packageContract.metadataSymbol}: MailProviderCatalogEntry;

export function createOfficialTencentWebMailDriver(
  options?: CreateOfficialTencentWebMailDriverOptions,
): MailProviderDriver<MailTencentOfficialWebNativeClient>;

export type CreateTencentMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
> &
  CreateOfficialTencentWebMailDriverOptions;

export function ${packageContract.driverFactory}<TNativeClient = unknown>(
  options?: CreateTencentMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient | MailTencentOfficialWebNativeClient>;

export const ${packageContract.moduleSymbol}: MailProviderModule;
`;
  }

  return `import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
} from '@sdkwork/Mail-sdk';

export const ${packageContract.metadataSymbol}: MailProviderCatalogEntry;

export type Create${toPascalCase(provider.providerKey)}MailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export function ${packageContract.driverFactory}<TNativeClient = unknown>(
  options?: Create${toPascalCase(provider.providerKey)}MailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient>;

export const ${packageContract.moduleSymbol}: MailProviderModule;
`;
}

function renderProviderPackageReadme(provider) {
  const packageStatus = 'package_reference_boundary';
  const hasReferenceRuntimeBridge =
    provider.typescriptAdapter.runtimeBridgeStatus === 'reference-baseline';
  const boundaryLabel = hasReferenceRuntimeBridge
    ? 'Reference TypeScript provider package boundary'
    : 'Reserved TypeScript provider package boundary';
  const boundarySummary = hasReferenceRuntimeBridge
    ? `Reference TypeScript provider package boundary for ${provider.displayName}.`
    : `Reserved TypeScript provider package boundary for ${provider.displayName}.`;
  const bridgeRules = hasReferenceRuntimeBridge
    ? [
        '- wraps the official vendor SDK instead of re-implementing media runtime',
        '- declares the official vendor SDK as an optional peer dependency and loads it only when this provider package is installed',
      ]
    : [
        '- reserves the official provider plugin boundary until a verified official runtime bridge is implemented',
        '- accepts consumer-supplied `nativeFactory` and `runtimeController` hooks for application-owned bridge injection',
        '- does not declare vendor SDK peer dependencies or expose an official bridge factory until the package owns a verified bridge',
      ];
  const extensionKeys =
    (provider.extensionKeys ?? []).length === 0
      ? '`<none>`'
      : (provider.extensionKeys ?? []).map((extensionKey) => `\`${extensionKey}\``).join(', ');
  const requiredCapabilities =
    (provider.requiredCapabilities ?? []).length === 0
      ? '`<none>`'
      : (provider.requiredCapabilities ?? [])
          .map((capabilityKey) => `\`${capabilityKey}\``)
          .join(', ');
  const optionalCapabilities =
    (provider.optionalCapabilities ?? []).length === 0
      ? '`<none>`'
      : (provider.optionalCapabilities ?? [])
          .map((capabilityKey) => `\`${capabilityKey}\``)
          .join(', ');

  return `# ${provider.typescriptPackage.packageName}

${boundarySummary}

- provider key: \`${provider.providerKey}\`
- tier: \`${provider.tier}\`
- builtin: \`${provider.builtin}\`
- status: \`${packageStatus}\`
- vendor sdk provisioning: \`${provider.typescriptAdapter.sdkProvisioning}\`
- binding strategy: \`${provider.typescriptAdapter.bindingStrategy}\`
- bundle policy: \`${provider.typescriptAdapter.bundlePolicy}\`
- runtime bridge status: \`${provider.typescriptAdapter.runtimeBridgeStatus}\`
- official vendor sdk requirement: \`${provider.typescriptAdapter.officialVendorSdkRequirement}\`
- required capabilities: ${requiredCapabilities}
- optional capabilities: ${optionalCapabilities}
- provider extension keys: ${extensionKeys}

Rules:

- ${boundaryLabel}
${bridgeRules.join('\n')}
- depends on the core \`@sdkwork/Mail-sdk\` contracts
- registers through the \`MailProviderModule\` adapter contract
- ships executable \`index.js\` and \`index.d.ts\` entrypoints
- declares \`exports\` so \`import\` and \`default\` resolve to \`index.js\` and \`types\` resolve
  to \`index.d.ts\`
- driver factories and provider module symbols live only behind this provider package boundary
- the root \`@sdkwork/Mail-sdk\` package exposes provider-neutral SPI, catalogs, loader, manager, and
  data-source contracts but does not re-export this provider implementation
`;
}

function renderTypeScriptProviderCatalogEntry(provider) {
  const constantName = `${toUpperSnakeCase(provider.providerKey)}_mail_PROVIDER_CATALOG_ENTRY`;

  return `export const ${constantName}: MailProviderCatalogEntry = {
  providerKey: ${renderStringLiteral(provider.providerKey)},
  pluginId: ${renderStringLiteral(provider.pluginId)},
  driverId: ${renderStringLiteral(provider.driverId)},
  displayName: ${renderStringLiteral(provider.displayName)},
  defaultSelected: ${provider.defaultSelected ? 'true' : 'false'},
  urlSchemes: ${renderReadonlyStringArray(provider.urlSchemes ?? [])},
  requiredCapabilities: REQUIRED_mail_CAPABILITIES,
  optionalCapabilities: ${renderReadonlyStringArray(provider.optionalCapabilities ?? [])},
  extensionKeys: ${renderReadonlyStringArray(provider.extensionKeys ?? [])},
  tier: ${renderStringLiteral(provider.tier)},
  builtin: ${provider.builtin ? 'true' : 'false'},
  typescriptAdapter: ${renderTypeScriptAdapterContract(provider.typescriptAdapter)},
  typescriptPackage: ${renderTypeScriptPackageContract(provider.typescriptPackage)},
};`;
}

function renderTypeScriptProviderExtensionCatalogDescriptor(descriptor) {
  const constantName = `${toUpperSnakeCase(descriptor.extensionKey)}_mail_PROVIDER_EXTENSION_DESCRIPTOR`;

  return `export const ${constantName}: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> = {
  extensionKey: ${renderStringLiteral(descriptor.extensionKey)},
  providerKey: ${renderStringLiteral(descriptor.providerKey)},
  displayName: ${renderStringLiteral(descriptor.displayName)},
  surface: ${renderStringLiteral(descriptor.surface)},
  access: ${renderStringLiteral(descriptor.access)},
  status: ${renderStringLiteral(descriptor.status)},
};`;
}

function renderTypeScriptCapabilityCatalogDescriptor(descriptor) {
  const constantName = `${toUpperSnakeCase(descriptor.capabilityKey)}_mail_CAPABILITY_DESCRIPTOR`;

  return `export const ${constantName}: MailCapabilityDescriptor<MailCapabilityKey> = {
  capabilityKey: ${renderStringLiteral(descriptor.capabilityKey)},
  category: ${renderStringLiteral(descriptor.category)},
  surface: ${renderStringLiteral(descriptor.surface)},
};`;
}

function renderTypeScriptCapabilityCatalog(assembly) {
  const descriptors = assembly.capabilityCatalog ?? [];
  const requiredCapabilities = descriptors
    .filter((descriptor) => descriptor.category === 'required-baseline')
    .map((descriptor) => descriptor.capabilityKey);
  const optionalCapabilities = descriptors
    .filter((descriptor) => descriptor.category === 'optional-advanced')
    .map((descriptor) => descriptor.capabilityKey);

  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailCapabilityDescriptor } from './types.js';

export const REQUIRED_mail_CAPABILITIES = freezeMailRuntimeValue(${renderReadonlyStringArray(requiredCapabilities)});
export const OPTIONAL_mail_CAPABILITIES = freezeMailRuntimeValue(${renderReadonlyStringArray(optionalCapabilities)});

export type MailRequiredCapability = (typeof REQUIRED_mail_CAPABILITIES)[number];
export type MailOptionalCapability = (typeof OPTIONAL_mail_CAPABILITIES)[number];
export type MailCapabilityKey = MailRequiredCapability | MailOptionalCapability;

${descriptors
  .map((descriptor) =>
    renderTypeScriptCapabilityCatalogDescriptor(descriptor).replace(
      ' = {',
      ' = freezeMailRuntimeValue({',
    ).replace('\n};', '\n});'),
  )
  .join('\n\n')}

export const mail_CAPABILITY_CATALOG: readonly MailCapabilityDescriptor<MailCapabilityKey>[] = freezeMailRuntimeValue([
  ${descriptors
    .map((descriptor) => `${toUpperSnakeCase(descriptor.capabilityKey)}_mail_CAPABILITY_DESCRIPTOR`)
    .join(',\n  ')}
]);

const mail_CAPABILITY_DESCRIPTOR_BY_KEY = new Map<
  MailCapabilityKey,
  MailCapabilityDescriptor<MailCapabilityKey>
>(mail_CAPABILITY_CATALOG.map((descriptor) => [descriptor.capabilityKey, descriptor]));

export function getMailCapabilityCatalog(): readonly MailCapabilityDescriptor<MailCapabilityKey>[] {
  return mail_CAPABILITY_CATALOG;
}

export function getMailCapabilityDescriptor(
  capabilityKey: MailCapabilityKey,
): MailCapabilityDescriptor<MailCapabilityKey> | undefined {
  return mail_CAPABILITY_DESCRIPTOR_BY_KEY.get(capabilityKey);
}
`;
}

function renderTypeScriptProviderExtensionCatalog(assembly) {
  const descriptors = assembly.providerExtensionCatalog ?? [];
  const providerKeys = [...new Set(descriptors.map((descriptor) => descriptor.providerKey))];

  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderExtensionDescriptor } from './types.js';

export const mail_PROVIDER_EXTENSION_KEYS = freezeMailRuntimeValue(${renderReadonlyStringArray(
    descriptors.map((descriptor) => descriptor.extensionKey),
  )});
export type MailKnownProviderExtensionKey = (typeof mail_PROVIDER_EXTENSION_KEYS)[number];

${descriptors
  .map((descriptor) =>
    renderTypeScriptProviderExtensionCatalogDescriptor(descriptor).replace(
      ' = {',
      ' = freezeMailRuntimeValue({',
    ).replace('\n};', '\n});'),
  )
  .join('\n\n')}

export const mail_PROVIDER_EXTENSION_CATALOG: readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] = freezeMailRuntimeValue([
  ${descriptors
    .map(
      (descriptor) =>
        `${toUpperSnakeCase(descriptor.extensionKey)}_mail_PROVIDER_EXTENSION_DESCRIPTOR`,
    )
    .join(',\n  ')}
]);

const mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY = new Map<
  string,
  MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>
>(mail_PROVIDER_EXTENSION_CATALOG.map((descriptor) => [descriptor.extensionKey, descriptor]));

const EMPTY_mail_PROVIDER_EXTENSIONS = freezeMailRuntimeValue([] as const);

const mail_PROVIDER_EXTENSIONS_BY_PROVIDER_KEY = new Map<
  string,
  readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[]
>([
${providerKeys
  .map((providerKey) => {
    const descriptorConstants = descriptors
      .filter((descriptor) => descriptor.providerKey === providerKey)
      .map(
        (descriptor) =>
          `${toUpperSnakeCase(descriptor.extensionKey)}_mail_PROVIDER_EXTENSION_DESCRIPTOR`,
      )
      .join(',\n    ');

    return `  [${renderStringLiteral(providerKey)}, freezeMailRuntimeValue([\n    ${descriptorConstants}\n  ])],`;
  })
  .join('\n')}
]);

export function getMailProviderExtensionCatalog(): readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] {
  return mail_PROVIDER_EXTENSION_CATALOG;
}

export function getMailProviderExtensionDescriptor(
  extensionKey: string,
): MailProviderExtensionDescriptor<MailKnownProviderExtensionKey> | undefined {
  return mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY.get(extensionKey);
}

export function getMailProviderExtensionsForProvider(
  providerKey: string,
): readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] {
  return mail_PROVIDER_EXTENSIONS_BY_PROVIDER_KEY.get(providerKey) ?? EMPTY_mail_PROVIDER_EXTENSIONS;
}

export function getMailProviderExtensions(
  extensionKeys: readonly string[],
): readonly MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] {
  const descriptors: MailProviderExtensionDescriptor<MailKnownProviderExtensionKey>[] = [];

  for (const extensionKey of extensionKeys) {
    const descriptor = mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY.get(extensionKey);
    if (descriptor) {
      descriptors.push(descriptor);
    }
  }

  return freezeMailRuntimeValue(descriptors);
}

export function hasMailProviderExtension(
  extensionKeys: readonly string[],
  extensionKey: string,
): boolean {
  for (const providerExtensionKey of extensionKeys) {
    if (
      providerExtensionKey === extensionKey &&
      mail_PROVIDER_EXTENSION_DESCRIPTOR_BY_KEY.has(extensionKey)
    ) {
      return true;
    }
  }

  return false;
}
`;
}

function renderTypeScriptProviderActivationCatalog(assembly) {
  const activationEntries = buildTypeScriptProviderActivationCatalogEntries(assembly);

  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderActivationEntry } from './types.js';

export const mail_PROVIDER_ACTIVATION_STATUSES = freezeMailRuntimeValue(${renderReadonlyStringArray(
    PROVIDER_ACTIVATION_STATUSES,
  )});

${activationEntries
  .map((entry) => {
    const constantName = `${toUpperSnakeCase(entry.providerKey)}_mail_PROVIDER_ACTIVATION_ENTRY`;

    return `export const ${constantName}: MailProviderActivationEntry = freezeMailRuntimeValue({
  providerKey: ${renderStringLiteral(entry.providerKey)},
  pluginId: ${renderStringLiteral(entry.pluginId)},
  driverId: ${renderStringLiteral(entry.driverId)},
  activationStatus: ${renderStringLiteral(entry.activationStatus)},
  runtimeBridge: ${entry.runtimeBridge ? 'true' : 'false'},
  rootPublic: ${entry.rootPublic ? 'true' : 'false'},
  packageBoundary: ${entry.packageBoundary ? 'true' : 'false'},
  builtin: ${entry.builtin ? 'true' : 'false'},
  packageIdentity: ${renderStringLiteral(entry.packageIdentity)},
});`;
  })
  .join('\n\n')}

export const mail_PROVIDER_ACTIVATION_CATALOG: readonly MailProviderActivationEntry[] = freezeMailRuntimeValue([
  ${activationEntries
    .map((entry) => `${toUpperSnakeCase(entry.providerKey)}_mail_PROVIDER_ACTIVATION_ENTRY`)
    .join(',\n  ')}
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
`;
}

function renderTypeScriptProviderPackageCatalog(assembly) {
  const packageEntries = buildTypeScriptProviderPackageCatalogEntries(assembly);

  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailProviderPackageCatalogEntry } from './types.js';

export const mail_PROVIDER_PACKAGE_STATUSES = freezeMailRuntimeValue(${renderReadonlyStringArray(
    REQUIRED_TYPESCRIPT_PROVIDER_PACKAGE_BOUNDARY_STATUS_TERMS,
  )});

${packageEntries
  .map((entry) => {
    const constantName = `${toUpperSnakeCase(entry.providerKey)}_mail_PROVIDER_PACKAGE_ENTRY`;

    return `export const ${constantName}: MailProviderPackageCatalogEntry = freezeMailRuntimeValue({
  providerKey: ${renderStringLiteral(entry.providerKey)},
  pluginId: ${renderStringLiteral(entry.pluginId)},
  driverId: ${renderStringLiteral(entry.driverId)},
  packageIdentity: ${renderStringLiteral(entry.packageIdentity)},
  manifestPath: ${renderStringLiteral(entry.manifestPath)},
  readmePath: ${renderStringLiteral(entry.readmePath)},
  sourcePath: ${renderStringLiteral(entry.sourcePath)},
  declarationPath: ${renderStringLiteral(entry.declarationPath)},
  sourceSymbol: ${renderStringLiteral(entry.sourceSymbol)},
  sourceModule: ${renderStringLiteral(entry.sourceModule)},
  driverFactory: ${renderStringLiteral(entry.driverFactory)},
  metadataSymbol: ${renderStringLiteral(entry.metadataSymbol)},
  moduleSymbol: ${renderStringLiteral(entry.moduleSymbol)},
  builtin: ${entry.builtin ? 'true' : 'false'},
  rootPublic: ${entry.rootPublic ? 'true' : 'false'},
  status: ${renderStringLiteral(entry.status)},
  runtimeBridgeStatus: ${renderStringLiteral(entry.runtimeBridgeStatus)},
  requiredCapabilities: freezeMailRuntimeValue(${renderReadonlyStringArray(entry.requiredCapabilities)}),
  optionalCapabilities: freezeMailRuntimeValue(${renderReadonlyStringArray(entry.optionalCapabilities)}),
  extensionKeys: freezeMailRuntimeValue(${renderReadonlyStringArray(entry.extensionKeys)}),
});`;
  })
  .join('\n\n')}

export const mail_PROVIDER_PACKAGE_CATALOG: readonly MailProviderPackageCatalogEntry[] = freezeMailRuntimeValue([
  ${packageEntries
    .map((entry) => `${toUpperSnakeCase(entry.providerKey)}_mail_PROVIDER_PACKAGE_ENTRY`)
    .join(',\n  ')}
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
`;
}

function renderTypeScriptProviderCatalog(assembly) {
  const providers = assembly.providers ?? [];
  const builtinProviders = providers.filter((provider) => provider.builtin);
  const defaults = assembly.defaults ?? {};

  return `import { freezeMailRuntimeValue } from './runtime-freeze.js';
import { REQUIRED_mail_CAPABILITIES } from './capability-catalog.js';
import type { MailProviderCatalogEntry } from './types.js';

export const DEFAULT_mail_PROVIDER_KEY = ${renderStringLiteral(defaults.providerKey)};
export const DEFAULT_mail_PROVIDER_PLUGIN_ID = ${renderStringLiteral(defaults.pluginId)};
export const DEFAULT_mail_PROVIDER_DRIVER_ID = ${renderStringLiteral(defaults.driverId)};
export const BUILTIN_mail_PROVIDER_KEYS = freezeMailRuntimeValue(${renderReadonlyStringArray(
  builtinProviders.map((provider) => provider.providerKey),
)});
export const OFFICIAL_mail_PROVIDER_KEYS = freezeMailRuntimeValue(${renderReadonlyStringArray(
  providers.map((provider) => provider.providerKey),
)});

${providers
  .map((provider) =>
    renderTypeScriptProviderCatalogEntry(provider).replace(
      ' = {',
      ' = freezeMailRuntimeValue({',
    ).replace('\n};', '\n});'),
  )
  .join('\n\n')}

export const BUILTIN_mail_PROVIDER_CATALOG: readonly MailProviderCatalogEntry[] = freezeMailRuntimeValue([
  ${builtinProviders
    .map((provider) => `${toUpperSnakeCase(provider.providerKey)}_mail_PROVIDER_CATALOG_ENTRY`)
    .join(',\n  ')}
]);

export const OFFICIAL_mail_PROVIDER_CATALOG: readonly MailProviderCatalogEntry[] = freezeMailRuntimeValue([
  ${providers
    .map((provider) => `${toUpperSnakeCase(provider.providerKey)}_mail_PROVIDER_CATALOG_ENTRY`)
    .join(',\n  ')}
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
`;
}

export function materializeMailSdkWorkspace(workspaceRoot) {
  const changedFiles = [];

  for (const entry of buildMailSdkMaterializationPlan(workspaceRoot)) {
    writeIfChanged(
      workspaceRoot,
      path.join(workspaceRoot, entry.relativePath),
      entry.content,
      changedFiles,
    );
  }

  for (const relativePath of mail_SDK_STALE_MATERIALIZED_FILES) {
    removeIfExists(workspaceRoot, path.join(workspaceRoot, relativePath), changedFiles);
  }

  return { changedFiles };
}

export function buildMailSdkMaterializationPlan(workspaceRoot) {
  const assemblyPath = path.join(workspaceRoot, 'sdk-manifest.json');
  const assembly = readJsonFile(assemblyPath);
  assertMailAssemblyWorkspaceBaseline(assembly);

  const entries = [
    ...mail_TEMPLATE_MATERIALIZATION_ASSETS.map((asset) => ({
      relativePath: asset.materializedRelativePath,
      content: renderMaterializedTemplateContent(workspaceRoot, asset.templateRelativePath, assembly),
    })),
    {
      relativePath: 'docs/multilanguage-capability-matrix.md',
      content: renderCapabilityMatrix(assembly),
    },
    {
      relativePath: 'docs/usage-guide.md',
      content: renderUsageGuide(assembly),
    },
    {
      relativePath: 'docs/typescript-smtp-runtime-usage.md',
      content: renderTypeScriptRuntimeUsageDoc(assembly),
    },
    {
      relativePath: 'docs/flutter-smtp-runtime-usage.md',
      content: renderFlutterRuntimeUsageDoc(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/package.json',
      content: renderTypeScriptWorkspaceManifest(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/tsconfig.build.json',
      content: renderTypeScriptBuildTsconfig(),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/index.ts',
      content: renderTypeScriptRootEntrypoint(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/capability-catalog.ts',
      content: renderTypeScriptCapabilityCatalog(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/language-workspace-catalog.ts',
      content: renderTypeScriptLanguageWorkspaceCatalog(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/provider-extension-catalog.ts',
      content: renderTypeScriptProviderExtensionCatalog(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/runtime-surface.ts',
      content: renderTypeScriptRuntimeSurface(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/runtime-immutability.ts',
      content: renderTypeScriptRuntimeImmutability(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/root-public-surface.ts',
      content: renderTypeScriptRootPublicSurface(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/lookup-helper-naming.ts',
      content: renderTypeScriptLookupHelperNaming(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/provider-package-catalog.ts',
      content: renderTypeScriptProviderPackageCatalog(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/provider-activation-catalog.ts',
      content: renderTypeScriptProviderActivationCatalog(assembly),
    },
    {
      relativePath: 'sdkwork-mail-sdk-typescript/src/provider-catalog.ts',
      content: renderTypeScriptProviderCatalog(assembly),
    },
  ];

  for (const languageEntry of assembly.languages ?? []) {
    entries.push({
      relativePath: `${languageEntry.workspace}/README.md`,
      content: renderLanguageWorkspaceReadme(languageEntry, assembly),
    });

    if (languageEntry.language !== 'typescript') {
      entries.push(...buildReservedLanguageMaterializationPlan(languageEntry, assembly));
    }
  }

  for (const provider of assembly.providers ?? []) {
    const providerPackageDir = path.posix.join(
      'sdkwork-mail-sdk-typescript',
      'providers',
      `Mail-sdk-provider-${provider.providerKey}`,
    );

    entries.push({
      relativePath: `${providerPackageDir}/package.json`,
      content: renderProviderPackageManifest(provider),
    });
    entries.push({
      relativePath: `${providerPackageDir}/index.js`,
      content: renderProviderPackageEntrypoint(provider),
    });
    entries.push({
      relativePath: `${providerPackageDir}/index.d.ts`,
      content: renderProviderPackageDeclarationEntrypoint(provider),
    });
    entries.push({
      relativePath: `${providerPackageDir}/README.md`,
      content: renderProviderPackageReadme(provider),
    });
  }

  return entries;
}

const workspaceRoot = resolveMailSdkWorkspaceRoot(import.meta.url);
const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
const isCliEntry = invokedPath === import.meta.url;

if (isCliEntry) {
  const result = materializeMailSdkWorkspace(workspaceRoot);
  if (result.changedFiles.length === 0) {
    console.log('[sdkwork-mail-sdk] materialization already up to date');
  } else {
    console.log('[sdkwork-mail-sdk] materialized standard assets:');
    for (const changedFile of result.changedFiles) {
      console.log(`- ${changedFile}`);
    }
  }
}
