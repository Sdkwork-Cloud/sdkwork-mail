import {
  createCapabilitySet,
  describeCapabilitySupport,
  negotiateCapabilities,
} from './capabilities.js';
import { MailDriverManager } from './driver-manager.js';
import { getMailProviderExtensions, hasMailProviderExtension } from './provider-extension-catalog.js';
import type { MailClient } from './client.js';
import type {
  MailCapabilityKey,
  MailCapabilityNegotiationRequest,
  MailCapabilityNegotiationResult,
  MailCapabilitySupportState,
  MailClientConfig,
  MailProviderExtensionDescriptor,
  MailProviderMetadata,
  MailProviderSelection,
  MailProviderSupportState,
} from './types.js';

export interface MailDataSourceConfig extends MailClientConfig {
  driverManager?: MailDriverManager;
}

export interface MailDataSourceOptions extends MailDataSourceConfig {}

export class MailDataSource {
  readonly #config: MailDataSourceConfig;
  readonly #driverManager: MailDriverManager;

  constructor(config: MailDataSourceConfig = {}) {
    this.#config = config;
    this.#driverManager = config.driverManager ?? new MailDriverManager();
  }

  describe(overrides: MailClientConfig = {}): MailProviderMetadata {
    return this.#driverManager.getMetadata({
      ...this.#config,
      ...overrides,
    });
  }

  describeSelection(overrides: MailClientConfig = {}): MailProviderSelection {
    return this.#driverManager.resolveSelection({
      ...this.#config,
      ...overrides,
    });
  }

  describeProviderSupport(overrides: MailClientConfig = {}): MailProviderSupportState {
    const selection = this.describeSelection(overrides);
    return this.#driverManager.describeProviderSupport(selection.providerKey);
  }

  listProviderSupport(): readonly MailProviderSupportState[] {
    return this.#driverManager.listProviderSupport();
  }

  describeCapability(
    capability: MailCapabilityKey,
    overrides: MailClientConfig = {},
  ): MailCapabilitySupportState {
    const metadata = this.describe(overrides);
    return describeCapabilitySupport(
      createCapabilitySet({
        required: metadata.requiredCapabilities,
        optional: metadata.optionalCapabilities,
      }),
      capability,
    );
  }

  negotiateCapabilities(
    request: MailCapabilityNegotiationRequest,
    overrides: MailClientConfig = {},
  ): MailCapabilityNegotiationResult {
    const metadata = this.describe(overrides);
    return negotiateCapabilities(
      createCapabilitySet({
        required: metadata.requiredCapabilities,
        optional: metadata.optionalCapabilities,
      }),
      request,
    );
  }

  describeProviderExtensions(overrides: MailClientConfig = {}): readonly MailProviderExtensionDescriptor[] {
    const metadata = this.describe(overrides);
    return getMailProviderExtensions(metadata.extensionKeys);
  }

  supportsProviderExtension(extensionKey: string, overrides: MailClientConfig = {}): boolean {
    const metadata = this.describe(overrides);
    return hasMailProviderExtension(metadata.extensionKeys, extensionKey);
  }

  async createClient<TNativeClient = unknown>(
    overrides: MailClientConfig = {},
  ): Promise<MailClient<TNativeClient>> {
    return this.#driverManager.connect({
      ...this.#config,
      ...overrides,
    });
  }
}
