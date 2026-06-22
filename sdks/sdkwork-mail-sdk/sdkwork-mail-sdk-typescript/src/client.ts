import { describeCapabilitySupport, hasCapability, negotiateCapabilities } from './capabilities.js';
import { MailSdkException } from './errors.js';
import { getMailProviderExtensions, hasMailProviderExtension } from './provider-extension-catalog.js';
import {
  cloneMailCapabilitySet,
  cloneMailProviderMetadata,
  cloneMailProviderSelection,
  shallowFreezeMailRuntimeValue,
} from './runtime-freeze.js';
import { mail_RUNTIME_SURFACE_FAILURE_CODE } from './runtime-surface.js';
import type {
  MailCapabilityNegotiationRequest,
  MailCapabilityNegotiationResult,
  MailCapabilityKey,
  MailCapabilitySet,
  MailCapabilitySupportState,
  MailMailboxProbeOptions,
  MailMailboxProbeResult,
  MailMailboxSyncOptions,
  MailMailboxSyncResult,
  MailProviderExtensionDescriptor,
  MailProviderMetadata,
  MailProviderSelection,
  MailRuntimeController,
  MailRuntimeControllerContext,
  MailSendOptions,
  MailSendResult,
  MailTransportAuthenticateOptions,
  MailTransportConnectOptions,
  MailTransportDescriptor,
  MailTransportHealthResult,
} from './types.js';
import type { MailRuntimeSurfaceMethodName } from './runtime-surface.js';

export interface MailClient<TNativeClient = unknown> {
  readonly metadata: MailProviderMetadata;
  readonly capabilities: MailCapabilitySet;
  readonly selection: MailProviderSelection;
  connectTransport(options: MailTransportConnectOptions): Promise<MailTransportDescriptor>;
  authenticateTransport(
    options: MailTransportAuthenticateOptions,
  ): Promise<MailTransportDescriptor>;
  disconnectTransport(): Promise<MailTransportDescriptor>;
  sendMail(options: MailSendOptions): Promise<MailSendResult>;
  probeMailbox(options?: MailMailboxProbeOptions): Promise<MailMailboxProbeResult>;
  syncMailbox(options?: MailMailboxSyncOptions): Promise<MailMailboxSyncResult>;
  healthCheck(): Promise<MailTransportHealthResult>;
  describeCapability(capability: MailCapabilityKey): MailCapabilitySupportState;
  negotiateCapabilities(request: MailCapabilityNegotiationRequest): MailCapabilityNegotiationResult;
  getProviderExtensions(): readonly MailProviderExtensionDescriptor[];
  supportsProviderExtension(extensionKey: string): boolean;
  supportsCapability(capability: MailCapabilityKey): boolean;
  requireCapability(capability: MailCapabilityKey): void;
  unwrap(): TNativeClient;
}

export class StandardMailClient<TNativeClient = unknown> implements MailClient<TNativeClient> {
  readonly #metadata: MailProviderMetadata;
  readonly #capabilities: MailCapabilitySet;
  readonly #selection: MailProviderSelection;
  readonly #nativeClient: TNativeClient;
  readonly #runtimeController?: MailRuntimeController<TNativeClient>;

  get metadata(): MailProviderMetadata {
    return this.#metadata;
  }

  get capabilities(): MailCapabilitySet {
    return this.#capabilities;
  }

  get selection(): MailProviderSelection {
    return this.#selection;
  }

  constructor(
    metadata: MailProviderMetadata,
    capabilities: MailCapabilitySet,
    selection: MailProviderSelection,
    nativeClient: TNativeClient,
    runtimeController?: MailRuntimeController<TNativeClient>,
  ) {
    this.#metadata = cloneMailProviderMetadata(metadata);
    this.#capabilities = cloneMailCapabilitySet(capabilities);
    this.#selection = cloneMailProviderSelection(selection);
    this.#nativeClient = nativeClient;
    this.#runtimeController = runtimeController;
  }

  #getRuntimeContext(): MailRuntimeControllerContext<TNativeClient> {
    return shallowFreezeMailRuntimeValue({
      metadata: this.#metadata,
      capabilities: this.#capabilities,
      selection: this.#selection,
      nativeClient: this.#nativeClient,
    });
  }

  #requireRuntimeMethod<TMethodName extends MailRuntimeSurfaceMethodName>(
    methodName: TMethodName,
  ): NonNullable<MailRuntimeController<TNativeClient>[TMethodName]> {
    const method = this.#runtimeController?.[methodName];
    if (typeof method !== 'function') {
      throw new MailSdkException({
        code: mail_RUNTIME_SURFACE_FAILURE_CODE,
        message: `Mail runtime bridge method not available: ${String(methodName)}`,
        providerKey: this.#metadata.providerKey,
        pluginId: this.#metadata.pluginId,
        details: {
          methodName,
        },
      });
    }

    return method;
  }

  async connectTransport(options: MailTransportConnectOptions): Promise<MailTransportDescriptor> {
    this.requireCapability('transport.connect');
    const connectTransport = this.#requireRuntimeMethod('connectTransport');
    return connectTransport.call(this.#runtimeController, options, this.#getRuntimeContext());
  }

  async authenticateTransport(
    options: MailTransportAuthenticateOptions,
  ): Promise<MailTransportDescriptor> {
    this.requireCapability('transport.authenticate');
    const authenticateTransport = this.#requireRuntimeMethod('authenticateTransport');
    return authenticateTransport.call(this.#runtimeController, options, this.#getRuntimeContext());
  }

  async disconnectTransport(): Promise<MailTransportDescriptor> {
    const disconnectTransport = this.#requireRuntimeMethod('disconnectTransport');
    return disconnectTransport.call(this.#runtimeController, this.#getRuntimeContext());
  }

  async sendMail(options: MailSendOptions): Promise<MailSendResult> {
    this.requireCapability('smtp.send');
    const sendMail = this.#runtimeController?.sendMail;
    if (typeof sendMail !== 'function') {
      throw new MailSdkException({
        code: mail_RUNTIME_SURFACE_FAILURE_CODE,
        message: 'Mail runtime bridge method not available: sendMail',
        providerKey: this.#metadata.providerKey,
        pluginId: this.#metadata.pluginId,
        details: {
          methodName: 'sendMail',
        },
      });
    }
    return sendMail.call(this.#runtimeController, options, this.#getRuntimeContext());
  }

  async probeMailbox(options: MailMailboxProbeOptions = {}): Promise<MailMailboxProbeResult> {
    this.requireCapability('imap.sync');
    const probeMailbox = this.#runtimeController?.probeMailbox;
    if (typeof probeMailbox !== 'function') {
      throw new MailSdkException({
        code: mail_RUNTIME_SURFACE_FAILURE_CODE,
        message: 'Mail runtime bridge method not available: probeMailbox',
        providerKey: this.#metadata.providerKey,
        pluginId: this.#metadata.pluginId,
        details: {
          methodName: 'probeMailbox',
        },
      });
    }
    return probeMailbox.call(this.#runtimeController, options, this.#getRuntimeContext());
  }

  async syncMailbox(options: MailMailboxSyncOptions = {}): Promise<MailMailboxSyncResult> {
    this.requireCapability('imap.message-sync');
    const syncMailbox = this.#runtimeController?.syncMailbox;
    if (typeof syncMailbox !== 'function') {
      throw new MailSdkException({
        code: mail_RUNTIME_SURFACE_FAILURE_CODE,
        message: 'Mail runtime bridge method not available: syncMailbox',
        providerKey: this.#metadata.providerKey,
        pluginId: this.#metadata.pluginId,
        details: {
          methodName: 'syncMailbox',
        },
      });
    }
    return syncMailbox.call(this.#runtimeController, options, this.#getRuntimeContext());
  }

  async healthCheck(): Promise<MailTransportHealthResult> {
    this.requireCapability('health');
    const healthCheck = this.#requireRuntimeMethod('healthCheck');
    return healthCheck.call(this.#runtimeController, this.#getRuntimeContext());
  }

  describeCapability(capability: MailCapabilityKey): MailCapabilitySupportState {
    return describeCapabilitySupport(this.capabilities, capability);
  }

  negotiateCapabilities(request: MailCapabilityNegotiationRequest): MailCapabilityNegotiationResult {
    return negotiateCapabilities(this.capabilities, request);
  }

  getProviderExtensions(): readonly MailProviderExtensionDescriptor[] {
    return getMailProviderExtensions(this.#metadata.extensionKeys);
  }

  supportsProviderExtension(extensionKey: string): boolean {
    return hasMailProviderExtension(this.#metadata.extensionKeys, extensionKey);
  }

  supportsCapability(capability: MailCapabilityKey): boolean {
    return hasCapability(this.capabilities, capability);
  }

  requireCapability(capability: MailCapabilityKey): void {
    if (!this.supportsCapability(capability)) {
      throw new MailSdkException({
        code: 'capability_not_supported',
        message: `Mail capability not supported: ${capability}`,
        providerKey: this.#metadata.providerKey,
        pluginId: this.#metadata.pluginId,
        details: {
          capability,
        },
      });
    }
  }

  unwrap(): TNativeClient {
    return this.#nativeClient;
  }
}
