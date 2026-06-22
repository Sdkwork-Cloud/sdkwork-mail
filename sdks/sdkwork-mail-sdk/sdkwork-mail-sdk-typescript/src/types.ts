import type {
  MailCapabilityKey,
  MailOptionalCapability,
  MailRequiredCapability,
} from './capability-catalog.js';

export type {
  MailCapabilityKey,
  MailOptionalCapability,
  MailRequiredCapability,
} from './capability-catalog.js';

export type MailCapabilityCategory = 'required-baseline' | 'optional-advanced';
export type MailCapabilitySurface = 'control-plane' | 'runtime-bridge' | 'cross-surface';
export type MailProviderExtensionAccess = 'unwrap-only' | 'extension-object';
export type MailProviderExtensionStatus = 'reference-baseline' | 'reserved';

export interface MailCapabilityDescriptor<TCapabilityKey extends string = string> {
  capabilityKey: TCapabilityKey;
  category: MailCapabilityCategory;
  surface: MailCapabilitySurface;
}

export interface MailProviderExtensionDescriptor<TExtensionKey extends string = string> {
  extensionKey: TExtensionKey;
  providerKey: string;
  displayName: string;
  surface: MailCapabilitySurface;
  access: MailProviderExtensionAccess;
  status: MailProviderExtensionStatus;
}

export interface MailCapabilitySupportState {
  capabilityKey: MailCapabilityKey;
  category: MailCapabilityCategory;
  surface: MailCapabilitySurface;
  supported: boolean;
}

export interface MailCapabilitySet {
  required: readonly MailRequiredCapability[];
  optional: readonly MailOptionalCapability[];
}

export interface MailCloseable {
  close(): Promise<void> | void;
}

export type MailTransportConnectionState = 'connected' | 'disconnected';

export interface MailTransportConnectOptions {
  accountId: string;
  metadata?: Record<string, unknown>;
}

export interface MailTransportAuthenticateOptions {
  username: string;
  secretRef?: string;
  metadata?: Record<string, unknown>;
}

export interface MailTransportDescriptor {
  accountId: string;
  providerKey: string;
  connectionState: MailTransportConnectionState;
}

export interface MailSendOptions {
  messageId?: string;
  from: string;
  to: readonly string[];
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  metadata?: Record<string, unknown>;
}

export interface MailSendResult {
  messageId: string;
  accepted: readonly string[];
}

export interface MailMailboxProbeOptions {
  mailbox?: string;
  metadata?: Record<string, unknown>;
}

export interface MailMailboxProbeResult {
  mailbox: string;
  exists: number;
  uidValidity?: number;
  uidNext?: number;
}

export interface MailMailboxSyncOptions {
  folderId?: string;
  mailbox?: string;
  sinceUid?: number;
  limit?: number;
  metadata?: Record<string, unknown>;
}

export interface MailMailboxSyncResult {
  folderId: string;
  syncedCount: number;
  highestUid?: number;
  uidValidity?: number;
}

export interface MailTransportHealthResult {
  healthy: boolean;
  detail?: string;
}

export interface MailCapabilityNegotiationRequest {
  required?: readonly MailCapabilityKey[];
  optional?: readonly MailCapabilityKey[];
}

export type MailCapabilityNegotiationStatus = 'supported' | 'degraded' | 'unsupported';
export type MailCapabilityNegotiationRule =
  | 'all-requested-capabilities-available'
  | 'all-required-capabilities-available_optional-capabilities-missing'
  | 'required-capabilities-missing';

export interface MailCapabilityNegotiationSurfaceMap {
  controlPlane: readonly MailCapabilityKey[];
  runtimeBridge: readonly MailCapabilityKey[];
  crossSurface: readonly MailCapabilityKey[];
}

export interface MailCapabilityNegotiationResult {
  status: MailCapabilityNegotiationStatus;
  supportedRequired: readonly MailCapabilityKey[];
  missingRequired: readonly MailCapabilityKey[];
  supportedOptional: readonly MailCapabilityKey[];
  missingOptional: readonly MailCapabilityKey[];
  missingBySurface: MailCapabilityNegotiationSurfaceMap;
}

export interface MailProviderMetadata {
  providerKey: string;
  pluginId: string;
  driverId: string;
  displayName: string;
  defaultSelected: boolean;
  urlSchemes: readonly string[];
  requiredCapabilities: readonly MailRequiredCapability[];
  optionalCapabilities: readonly MailOptionalCapability[];
  extensionKeys: readonly string[];
}

export type MailProviderTier = 'tier-a' | 'tier-b' | 'tier-c';

export interface MailTypeScriptAdapterContract {
  sdkProvisioning: 'consumer-supplied';
  bindingStrategy: 'native-factory';
  bundlePolicy: 'must-not-bundle';
  runtimeBridgeStatus: 'reference-baseline' | 'reserved';
  officialVendorSdkRequirement: 'required' | 'not-declared-until-bridge';
}

export interface MailTypeScriptPackageContract {
  packageName: string;
  sourceModule: string;
  driverFactory: string;
  metadataSymbol: string;
  moduleSymbol: string;
  rootPublic: boolean;
}

export interface MailProviderCatalogEntry extends MailProviderMetadata {
  tier: MailProviderTier;
  builtin: boolean;
  typescriptAdapter: MailTypeScriptAdapterContract;
  typescriptPackage: MailTypeScriptPackageContract;
}

export interface MailClientConfig {
  providerUrl?: string;
  providerKey?: string;
  tenantOverrideProviderKey?: string;
  deploymentProfileProviderKey?: string;
  defaultProviderKey?: string;
  nativeConfig?: Record<string, unknown>;
}

export interface MailProviderSelectionRequest {
  providerUrl?: string;
  providerKey?: string;
  tenantOverrideProviderKey?: string;
  deploymentProfileProviderKey?: string;
}

export type MailProviderSelectionSource =
  | 'provider_url'
  | 'provider_key'
  | 'tenant_override'
  | 'deployment_profile'
  | 'default_provider';

export type MailLanguageWorkspaceMaturityTier = 'reference' | 'reserved';

export interface MailLanguageWorkspaceMetadataScaffold {
  providerCatalogRelativePath: string;
  capabilityCatalogRelativePath: string;
  providerExtensionCatalogRelativePath: string;
  providerPackageCatalogRelativePath: string;
  providerActivationCatalogRelativePath: string;
  providerSelectionRelativePath: string;
}

export interface MailLanguageWorkspaceResolutionScaffold {
  driverManagerRelativePath: string;
  dataSourceRelativePath: string;
  providerSupportRelativePath: string;
  providerPackageLoaderRelativePath: string;
}

export interface MailLanguageWorkspaceDefaultProviderContract {
  providerKey: string;
  pluginId: string;
  driverId: string;
}

export interface MailLanguageWorkspaceProviderSelectionContract {
  sourceTerms: readonly MailProviderSelectionSource[];
  precedence: readonly MailProviderSelectionSource[];
  defaultSource: MailProviderSelectionSource;
}

export interface MailLanguageWorkspaceProviderSuppoMailontract {
  statusTerms: readonly MailProviderSupportStatus[];
}

export interface MailLanguageWorkspaceProviderActivationContract {
  statusTerms: readonly MailProviderActivationStatus[];
}

export type MailLanguageWorkspaceSmokeMode = 'runtime-backed' | 'analysis-backed';
export type MailLanguageWorkspaceSmokeVariant = 'default' | 'reuse-live-connection';

export interface MailLanguageWorkspaceRuntimeBaseline {
  vendorSdkPackage: string;
  vendorSdkImportPath: string;
  recommendedEntrypoint: string;
  smokeCommand: string;
  smokeMode: MailLanguageWorkspaceSmokeMode;
  smokeVariants: readonly MailLanguageWorkspaceSmokeVariant[];
}

export type MailProviderPackageRuntimeBridgeStatus =
  | MailTypeScriptAdapterContract['runtimeBridgeStatus']
  | 'reserved';

export type MailProviderPackageCatalogStatus = 'package_reference_boundary';

export type MailLanguageWorkspaceProviderPackageScaffoldStatus =
  | 'future-runtime-bridge-only';

export type MailLanguageWorkspaceProviderPackageBoundaryMode =
  | 'catalog-governed-mixed'
  | 'scaffold-per-provider-package';

export type MailLanguageWorkspaceProviderPackageBoundaryRootPublicPolicy = 'none';

export type MailLanguageWorkspaceProviderPackageBoundaryLifecycleStatus =
  | MailProviderPackageCatalogStatus
  | MailLanguageWorkspaceProviderPackageScaffoldStatus;

export interface MailLanguageWorkspaceProviderPackageBoundaryContract {
  modeTerms: readonly MailLanguageWorkspaceProviderPackageBoundaryMode[];
  rootPublicPolicyTerms: readonly MailLanguageWorkspaceProviderPackageBoundaryRootPublicPolicy[];
  lifecycleStatusTerms: readonly MailLanguageWorkspaceProviderPackageBoundaryLifecycleStatus[];
  runtimeBridgeStatusTerms: readonly MailProviderPackageRuntimeBridgeStatus[];
}

export interface MailLanguageWorkspaceProviderPackageBoundary {
  mode: MailLanguageWorkspaceProviderPackageBoundaryMode;
  rootPublicPolicy: MailLanguageWorkspaceProviderPackageBoundaryRootPublicPolicy;
  lifecycleStatusTerms: readonly MailLanguageWorkspaceProviderPackageBoundaryLifecycleStatus[];
  runtimeBridgeStatusTerms: readonly MailProviderPackageRuntimeBridgeStatus[];
}

export interface MailLanguageWorkspaceProviderPackageScaffold {
  relativePath: string;
  directoryPattern: string;
  packagePattern: string;
  manifestFileName: string;
  readmeFileName: string;
  sourceFilePattern: string;
  sourceSymbolPattern: string;
  templateTokens: readonly string[];
  sourceTemplateTokens: readonly string[];
  referenceProviderKey?: string;
  referenceStatus?: MailProviderPackageCatalogStatus;
  referenceRuntimeBridgeStatus?: MailProviderPackageRuntimeBridgeStatus;
  referenceVendorSdkPackage?: string;
  referenceVendorSdkVersion?: string;
  runtimeBridgeStatus: MailProviderPackageRuntimeBridgeStatus;
  rootPublic: boolean;
  status: MailLanguageWorkspaceProviderPackageScaffoldStatus;
}

export interface MailLanguageWorkspaceCatalogEntry {
  language: string;
  workspace: string;
  workspaceCatalogRelativePath: string;
  displayName: string;
  publicPackage: string;
  maturityTier: MailLanguageWorkspaceMaturityTier;
  controlSdk: boolean;
  runtimeBridge: boolean;
  currentRole: string;
  workspaceSummary: string;
  roleHighlights: readonly string[];
  defaultProviderContract: MailLanguageWorkspaceDefaultProviderContract;
  providerSelectionContract: MailLanguageWorkspaceProviderSelectionContract;
  providerSuppoMailontract: MailLanguageWorkspaceProviderSuppoMailontract;
  providerActivationContract: MailLanguageWorkspaceProviderActivationContract;
  runtimeBaseline?: MailLanguageWorkspaceRuntimeBaseline;
  metadataScaffold?: MailLanguageWorkspaceMetadataScaffold;
  resolutionScaffold?: MailLanguageWorkspaceResolutionScaffold;
  providerPackageBoundaryContract: MailLanguageWorkspaceProviderPackageBoundaryContract;
  providerPackageBoundary: MailLanguageWorkspaceProviderPackageBoundary;
  providerPackageScaffold?: MailLanguageWorkspaceProviderPackageScaffold;
}

export interface MailProviderPackageCatalogEntry {
  providerKey: string;
  pluginId: string;
  driverId: string;
  packageIdentity: string;
  manifestPath: string;
  readmePath: string;
  sourcePath: string;
  declarationPath: string;
  sourceSymbol: string;
  sourceModule: string;
  driverFactory: string;
  metadataSymbol: string;
  moduleSymbol: string;
  builtin: boolean;
  rootPublic: boolean;
  status: MailProviderPackageCatalogStatus;
  runtimeBridgeStatus: MailProviderPackageRuntimeBridgeStatus;
  requiredCapabilities: readonly MailRequiredCapability[];
  optionalCapabilities: readonly MailOptionalCapability[];
  extensionKeys: readonly string[];
}

export type MailProviderActivationStatus =
  | 'package-boundary'
  | 'control-metadata-only';

export interface MailProviderActivationEntry {
  providerKey: string;
  pluginId: string;
  driverId: string;
  activationStatus: MailProviderActivationStatus;
  runtimeBridge: boolean;
  rootPublic: boolean;
  packageBoundary: boolean;
  builtin: boolean;
  packageIdentity: string;
}

export interface MailProviderSelection {
  providerKey: string;
  source: MailProviderSelectionSource;
}

export type MailProviderSupportStatus =
  | 'builtin_registered'
  | 'official_registered'
  | 'official_unregistered'
  | 'unknown';

export interface MailProviderSupportStateRequest {
  providerKey: string;
  builtin: boolean;
  official: boolean;
  registered: boolean;
}

export interface MailProviderSupportState {
  providerKey: string;
  status: MailProviderSupportStatus;
  builtin: boolean;
  official: boolean;
  registered: boolean;
}

export interface MailResolvedClientConfig extends MailClientConfig {
  providerKey: string;
  selectionSource: MailProviderSelectionSource;
}

export interface MailRuntimeControllerContext<TNativeClient = unknown> {
  metadata: MailProviderMetadata;
  capabilities: MailCapabilitySet;
  selection: MailProviderSelection;
  nativeClient: TNativeClient;
}

export interface MailRuntimeController<TNativeClient = unknown> {
  connectTransport(
    options: MailTransportConnectOptions,
    context: MailRuntimeControllerContext<TNativeClient>,
  ): Promise<MailTransportDescriptor> | MailTransportDescriptor;
  authenticateTransport(
    options: MailTransportAuthenticateOptions,
    context: MailRuntimeControllerContext<TNativeClient>,
  ): Promise<MailTransportDescriptor> | MailTransportDescriptor;
  disconnectTransport(
    context: MailRuntimeControllerContext<TNativeClient>,
  ): Promise<MailTransportDescriptor> | MailTransportDescriptor;
  sendMail?(
    options: MailSendOptions,
    context: MailRuntimeControllerContext<TNativeClient>,
  ): Promise<MailSendResult> | MailSendResult;
  probeMailbox?(
    options: MailMailboxProbeOptions,
    context: MailRuntimeControllerContext<TNativeClient>,
  ): Promise<MailMailboxProbeResult> | MailMailboxProbeResult;
  syncMailbox?(
    options: MailMailboxSyncOptions,
    context: MailRuntimeControllerContext<TNativeClient>,
  ): Promise<MailMailboxSyncResult> | MailMailboxSyncResult;
  healthCheck(
    context: MailRuntimeControllerContext<TNativeClient>,
  ): Promise<MailTransportHealthResult> | MailTransportHealthResult;
}
