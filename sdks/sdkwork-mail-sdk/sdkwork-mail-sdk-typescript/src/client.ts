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
  MailJoinOptions,
  MailMuteState,
  MailPublishOptions,
  MailProviderExtensionDescriptor,
  MailProviderMetadata,
  MailProviderSelection,
  MailRuntimeController,
  MailRuntimeControllerContext,
  MailScreenShareOptions,
  MailSessionDescriptor,
  MailTrackPublication,
} from './types.js';
import type { MailRuntimeSurfaceMethodName } from './runtime-surface.js';

export interface MailClient<TNativeClient = unknown> {
  readonly metadata: MailProviderMetadata;
  readonly capabilities: MailCapabilitySet;
  readonly selection: MailProviderSelection;
  join(options: MailJoinOptions): Promise<MailSessionDescriptor>;
  leave(): Promise<MailSessionDescriptor>;
  publish(options: MailPublishOptions): Promise<MailTrackPublication>;
  unpublish(trackId: string): Promise<void>;
  startScreenShare(options: MailScreenShareOptions): Promise<MailTrackPublication>;
  stopScreenShare(trackId: string): Promise<void>;
  muteAudio(muted?: boolean): Promise<MailMuteState>;
  muteVideo(muted?: boolean): Promise<MailMuteState>;
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

  async join(options: MailJoinOptions): Promise<MailSessionDescriptor> {
    const join = this.#requireRuntimeMethod('join');
    return join.call(this.#runtimeController, options, this.#getRuntimeContext());
  }

  async leave(): Promise<MailSessionDescriptor> {
    const leave = this.#requireRuntimeMethod('leave');
    return leave.call(this.#runtimeController, this.#getRuntimeContext());
  }

  async publish(options: MailPublishOptions): Promise<MailTrackPublication> {
    const publish = this.#requireRuntimeMethod('publish');
    return publish.call(this.#runtimeController, options, this.#getRuntimeContext());
  }

  async unpublish(trackId: string): Promise<void> {
    const unpublish = this.#requireRuntimeMethod('unpublish');
    await unpublish.call(this.#runtimeController, trackId, this.#getRuntimeContext());
  }

  async startScreenShare(options: MailScreenShareOptions): Promise<MailTrackPublication> {
    this.requireCapability('screen-share');
    const context = this.#getRuntimeContext();
    const startScreenShare = this.#runtimeController?.startScreenShare;
    if (typeof startScreenShare === 'function') {
      return startScreenShare.call(this.#runtimeController, options, context);
    }

    const publish = this.#requireRuntimeMethod('publish');
    return publish.call(
      this.#runtimeController,
      {
        ...options,
        kind: 'screen-share',
      },
      context,
    );
  }

  async stopScreenShare(trackId: string): Promise<void> {
    this.requireCapability('screen-share');
    const context = this.#getRuntimeContext();
    const stopScreenShare = this.#runtimeController?.stopScreenShare;
    if (typeof stopScreenShare === 'function') {
      await stopScreenShare.call(this.#runtimeController, trackId, context);
      return;
    }

    const unpublish = this.#requireRuntimeMethod('unpublish');
    await unpublish.call(this.#runtimeController, trackId, context);
  }

  async muteAudio(muted = true): Promise<MailMuteState> {
    const muteAudio = this.#requireRuntimeMethod('muteAudio');
    return muteAudio.call(this.#runtimeController, muted, this.#getRuntimeContext());
  }

  async muteVideo(muted = true): Promise<MailMuteState> {
    const muteVideo = this.#requireRuntimeMethod('muteVideo');
    return muteVideo.call(this.#runtimeController, muted, this.#getRuntimeContext());
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
