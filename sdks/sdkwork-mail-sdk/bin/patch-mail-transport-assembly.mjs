import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const assemblyPath = path.resolve(scriptDir, '..', 'sdk-manifest.json');

const MAIL_RUNTIME_SURFACE_METHODS = [
  'connectTransport',
  'authenticateTransport',
  'disconnectTransport',
  'sendMail',
  'probeMailbox',
  'syncMailbox',
  'healthCheck',
];

const MAIL_CAPABILITY_CATALOG = [
  { capabilityKey: 'transport.connect', category: 'required-baseline', surface: 'control-plane' },
  { capabilityKey: 'transport.authenticate', category: 'required-baseline', surface: 'control-plane' },
  { capabilityKey: 'health', category: 'required-baseline', surface: 'control-plane' },
  { capabilityKey: 'smtp.send', category: 'optional-advanced', surface: 'runtime-bridge' },
  { capabilityKey: 'imap.sync', category: 'optional-advanced', surface: 'runtime-bridge' },
  { capabilityKey: 'imap.folder-sync', category: 'optional-advanced', surface: 'runtime-bridge' },
  { capabilityKey: 'imap.message-sync', category: 'optional-advanced', surface: 'runtime-bridge' },
  { capabilityKey: 'transport.retry', category: 'optional-advanced', surface: 'control-plane' },
  { capabilityKey: 'transport.pool', category: 'optional-advanced', surface: 'control-plane' },
];

const MAIL_PROVIDER_EXTENSION_CATALOG = [
  {
    extensionKey: 'smtp.transport',
    providerKey: 'smtp',
    displayName: 'SMTP Transport',
    surface: 'runtime-bridge',
    access: 'unwrap-only',
    status: 'reserved',
  },
  {
    extensionKey: 'imap.sync',
    providerKey: 'imap',
    displayName: 'IMAP Sync',
    surface: 'runtime-bridge',
    access: 'unwrap-only',
    status: 'reserved',
  },
];

const MAIL_TRANSPORT_ADAPTER = {
  sdkProvisioning: 'consumer-supplied',
  bindingStrategy: 'native-factory',
  bundlePolicy: 'must-not-bundle',
  runtimeBridgeStatus: 'reserved',
  officialVendorSdkRequirement: 'not-declared-until-bridge',
};

const MAIL_TRANSPORT_PROVIDERS = [
  {
    providerKey: 'smtp',
    pluginId: 'Mail-smtp',
    driverId: 'sdkwork-mail-driver-smtp',
    displayName: 'SMTP Mail Transport',
    tier: 'tier-a',
    builtin: true,
    defaultSelected: true,
    urlSchemes: ['mail:smtp'],
    requiredCapabilities: ['transport.connect', 'transport.authenticate', 'health'],
    optionalCapabilities: ['smtp.send', 'transport.retry', 'transport.pool'],
    extensionKeys: ['smtp.transport'],
    typescriptAdapter: MAIL_TRANSPORT_ADAPTER,
    typescriptPackage: {
      packageName: '@sdkwork/Mail-sdk-provider-smtp',
      sourceModule: './index.js',
      driverFactory: 'createSmtpMailDriver',
      metadataSymbol: 'SMTP_mail_PROVIDER_METADATA',
      moduleSymbol: 'SMTP_mail_PROVIDER_MODULE',
      rootPublic: true,
    },
  },
  {
    providerKey: 'imap',
    pluginId: 'Mail-imap',
    driverId: 'sdkwork-mail-driver-imap',
    displayName: 'IMAP Mail Sync',
    tier: 'tier-a',
    builtin: true,
    defaultSelected: false,
    urlSchemes: ['mail:imap'],
    requiredCapabilities: ['transport.connect', 'transport.authenticate', 'health'],
    optionalCapabilities: ['imap.sync', 'imap.folder-sync', 'imap.message-sync'],
    extensionKeys: ['imap.sync'],
    typescriptAdapter: MAIL_TRANSPORT_ADAPTER,
    typescriptPackage: {
      packageName: '@sdkwork/Mail-sdk-provider-imap',
      sourceModule: './index.js',
      driverFactory: 'createImapMailDriver',
      metadataSymbol: 'IMAP_mail_PROVIDER_METADATA',
      moduleSymbol: 'IMAP_mail_PROVIDER_MODULE',
      rootPublic: true,
    },
  },
];

const LEGACY_PROVIDER_KEYS = new Set([
  'volcengine',
  'aliyun',
  'tencent',
  'agora',
  'zego',
  'livekit',
  'twilio',
  'jitsi',
  'janus',
  'mediasoup',
]);

function patchLanguageEntry(languageEntry) {
  const next = structuredClone(languageEntry);

  if (next.workspaceSummary) {
    next.workspaceSummary = next.workspaceSummary
      .replace(/Volcengine default runtime binding/gi, 'SMTP default transport binding')
      .replace(/volcengine/gi, 'smtp');
  }

  if (Array.isArray(next.roleHighlights)) {
    next.roleHighlights = next.roleHighlights
      .map((line) =>
        line
          .replace(/volcengine, aliyun, tencent, agora, zego, livekit, twilio, jitsi, janus, and mediasoup/gi, 'smtp and imap')
          .replace(/Volcengine/gi, 'SMTP')
          .replace(/volcengine/gi, 'smtp')
          .replace(/join, leave, publish, unpublish, startScreenShare, stopScreenShare, muteAudio, and muteVideo/gi, MAIL_RUNTIME_SURFACE_METHODS.join(', '))
          .replace(/media\/provider focused and leaves call signaling to IM/gi, 'mail transport focused and leaves realtime signaling to IM'),
      )
      .filter((line) => !/media\.audio|live\.broadcast|screen-share|call signaling/i.test(line));
  }

  if (next.runtimeBaseline) {
    if (next.language === 'typescript') {
      next.runtimeBaseline.vendorSdkPackage = '@sdkwork/Mail-sdk-provider-smtp';
      next.runtimeBaseline.vendorSdkImportPath = '@sdkwork/Mail-sdk-provider-smtp';
    } else if (next.language === 'flutter') {
      next.runtimeBaseline.vendorSdkPackage = 'mail_sdk_provider_smtp';
      next.runtimeBaseline.vendorSdkImportPath =
        'package:mail_sdk_provider_smtp/mail_sdk_provider_smtp.dart';
    } else {
      next.runtimeBaseline.vendorSdkPackage = 'Mail-sdk-provider-smtp';
      next.runtimeBaseline.vendorSdkImportPath = 'Mail-sdk-provider-smtp';
    }
  }

  if (next.runtimeDocumentation) {
    next.runtimeDocumentation.baselineConclusion = next.runtimeDocumentation.baselineConclusion
      .replace(/media operations/gi, 'mail transport operations')
      .replace(/Volcengine/gi, 'SMTP')
      .replace(/volcengine/gi, 'smtp');
    next.runtimeDocumentation.guideTitle = next.runtimeDocumentation.guideTitle
      .replace(/Volcengine Media Runtime Baseline/gi, 'SMTP Mail Transport Runtime Baseline')
      .replace(/media runtime/gi, 'mail transport runtime');
    next.runtimeDocumentation.runtimeLabel = next.runtimeDocumentation.runtimeLabel
      .replace(/media runtime/gi, 'mail transport runtime');
    next.runtimeDocumentation.detailedGuidePath = next.runtimeDocumentation.detailedGuidePath
      .replace(/volcengine/gi, 'smtp')
      .replace(/Volcengine/gi, 'Smtp');
    next.runtimeDocumentation.detailedGuideLabel = next.runtimeDocumentation.detailedGuideLabel
      .replace(/volcengine/gi, 'smtp')
      .replace(/Volcengine/gi, 'Smtp');
    next.runtimeDocumentation.smokeNarrative = next.runtimeDocumentation.smokeNarrative
      .replace(/call signaling/gi, 'transport bootstrap')
      .replace(/media runtime/gi, 'mail transport runtime');
  }

  if (next.providerPackageScaffold?.referenceProviderKey) {
    next.providerPackageScaffold.referenceProviderKey = 'smtp';
    next.providerPackageScaffold.referenceStatus = 'package_reference_boundary';
    next.providerPackageScaffold.referenceRuntimeBridgeStatus = 'reserved';
    next.providerPackageScaffold.referenceVendorSdkPackage = 'mail_sdk_provider_smtp';
    delete next.providerPackageScaffold.referenceVendorSdkVersion;
  }

  if (Array.isArray(next.providerActivations)) {
    next.providerActivations = MAIL_TRANSPORT_PROVIDERS.map((provider) => ({
      providerKey: provider.providerKey,
      activationStatus: 'package-boundary',
    }));
  }

  if (Array.isArray(next.reservedProviderActivations)) {
    next.reservedProviderActivations = next.reservedProviderActivations.filter(
      (entry) => !LEGACY_PROVIDER_KEYS.has(entry.providerKey),
    );
  }

  return next;
}

const assembly = JSON.parse(readFileSync(assemblyPath, 'utf8'));

assembly.capabilityCatalog = MAIL_CAPABILITY_CATALOG;
assembly.providerExtensionCatalog = MAIL_PROVIDER_EXTENSION_CATALOG;
assembly.providers = MAIL_TRANSPORT_PROVIDERS;
assembly.runtimeSurfaceStandard = {
  ...assembly.runtimeSurfaceStandard,
  methodTerms: MAIL_RUNTIME_SURFACE_METHODS,
};

assembly.languages = (assembly.languages ?? []).map(patchLanguageEntry);

writeFileSync(assemblyPath, `${JSON.stringify(assembly, null, 2)}\n`, 'utf8');
console.log('[patch-mail-transport-assembly] updated sdk-manifest.json for smtp/imap mail transport');
