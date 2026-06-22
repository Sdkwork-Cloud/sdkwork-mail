import { MailSdkException } from './errors.js';
import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type { MailClient } from './client.js';
import type { MailProviderDriver } from './driver.js';
import {
  DEFAULT_mail_PROVIDER_KEY,
  getBuiltinMailProviderMetadata,
  getOfficialMailProviderMetadata,
} from './provider-catalog.js';
import { resolveMailProviderSelection } from './provider-selection.js';
import { createMailProviderSupportState } from './provider-support.js';
import type {
  MailClientConfig,
  MailProviderMetadata,
  MailProviderSupportState,
  MailProviderSelection,
  MailResolvedClientConfig,
} from './types.js';

function sameStringArray(actual: readonly string[], expected: readonly string[]): boolean {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function isOfficialProviderMetadataMatch(
  actual: MailProviderMetadata,
  expected: MailProviderMetadata,
): boolean {
  return (
    actual.providerKey === expected.providerKey &&
    actual.pluginId === expected.pluginId &&
    actual.driverId === expected.driverId &&
    actual.displayName === expected.displayName &&
    actual.defaultSelected === expected.defaultSelected &&
    sameStringArray(actual.urlSchemes, expected.urlSchemes) &&
    sameStringArray(actual.requiredCapabilities, expected.requiredCapabilities) &&
    sameStringArray(actual.optionalCapabilities, expected.optionalCapabilities) &&
    sameStringArray(actual.extensionKeys, expected.extensionKeys)
  );
}

export interface MailDriverManagerOptions {
  defaultProviderKey?: string;
  drivers?: readonly MailProviderDriver[];
}

export class MailDriverManager {
  readonly #drivers = new Map<string, MailProviderDriver>();
  readonly #builtinProviderKeys = new Set<string>();
  readonly #officialProviders = new Map<string, MailProviderMetadata>();
  readonly #defaultProviderKey: string;

  constructor(options: MailDriverManagerOptions = {}) {
    this.#defaultProviderKey = options.defaultProviderKey ?? DEFAULT_mail_PROVIDER_KEY;

    for (const metadata of getBuiltinMailProviderMetadata()) {
      this.#builtinProviderKeys.add(metadata.providerKey);
    }

    for (const metadata of getOfficialMailProviderMetadata()) {
      this.#officialProviders.set(metadata.providerKey, metadata);
    }

    this.registerAll(options.drivers ?? []);
  }

  #asseMailanRegister(driver: MailProviderDriver, plannedProviderKeys: ReadonlySet<string> = new Set()): void {
    const providerKey = driver.metadata.providerKey;
    const officialProvider = this.#officialProviders.get(providerKey);
    if (!officialProvider) {
      throw new MailSdkException({
        code: 'provider_not_official',
        message: `Mail driver registration requires an official provider catalog entry: ${providerKey}`,
        providerKey,
        pluginId: driver.metadata.pluginId,
      });
    }

    if (!isOfficialProviderMetadataMatch(driver.metadata, officialProvider)) {
      throw new MailSdkException({
        code: 'provider_metadata_mismatch',
        message: `Mail driver metadata must match the official provider catalog: ${providerKey}`,
        providerKey,
        pluginId: driver.metadata.pluginId,
        details: {
          expectedMetadata: officialProvider,
          receivedMetadata: driver.metadata,
        },
      });
    }

    if (this.#drivers.has(providerKey) || plannedProviderKeys.has(providerKey)) {
      throw new MailSdkException({
        code: 'driver_already_registered',
        message: `Mail driver already registered for provider: ${providerKey}`,
        providerKey,
        pluginId: driver.metadata.pluginId,
      });
    }
  }

  register(driver: MailProviderDriver): this {
    this.#asseMailanRegister(driver);
    this.#drivers.set(driver.metadata.providerKey, driver);
    return this;
  }

  registerAll(drivers: readonly MailProviderDriver[]): this {
    const plannedProviderKeys = new Set<string>();

    for (const driver of drivers) {
      this.#asseMailanRegister(driver, plannedProviderKeys);
      plannedProviderKeys.add(driver.metadata.providerKey);
    }

    for (const driver of drivers) {
      this.#drivers.set(driver.metadata.providerKey, driver);
    }

    return this;
  }

  list() {
    return freezeMailRuntimeValue([...this.#drivers.values()].map((driver) => driver.metadata));
  }

  hasDriver(providerKey: string): boolean {
    return this.#drivers.has(providerKey);
  }

  getMetadata(config: MailClientConfig = {}) {
    const selection = this.resolveSelection(config);
    const registeredDriver = this.#drivers.get(selection.providerKey);
    if (registeredDriver) {
      return registeredDriver.metadata;
    }

    const officialProvider = this.#officialProviders.get(selection.providerKey);
    if (officialProvider) {
      return officialProvider;
    }

    throw new MailSdkException({
      code: 'driver_not_found',
      message: `No Mail driver registered for provider: ${selection.providerKey}`,
      providerKey: selection.providerKey,
    });
  }

  getDefaultMetadata() {
    return this.getMetadata({ defaultProviderKey: this.#defaultProviderKey });
  }

  describeProviderSupport(providerKey: string): MailProviderSupportState {
    const officialProvider = this.#officialProviders.get(providerKey);
    const registeredDriver = this.#drivers.get(providerKey);
    const builtin = this.#builtinProviderKeys.has(providerKey);
    const official = officialProvider !== undefined;
    const registered = registeredDriver !== undefined;

    return createMailProviderSupportState({
      providerKey,
      builtin,
      official,
      registered,
    });
  }

  listProviderSupport(): readonly MailProviderSupportState[] {
    return freezeMailRuntimeValue(
      [...this.#officialProviders.keys()].map((providerKey) =>
        this.describeProviderSupport(providerKey),
      ),
    );
  }

  resolveSelection(config: MailClientConfig = {}): MailProviderSelection {
    return resolveMailProviderSelection(
      config,
      config.defaultProviderKey ?? this.#defaultProviderKey,
    );
  }

  resolve(config: MailClientConfig = {}): MailProviderDriver {
    const selection = this.resolveSelection(config);
    const providerKey = selection.providerKey;

    const driver = this.#drivers.get(providerKey);
    if (!driver) {
      throw new MailSdkException({
        code: 'driver_not_found',
        message: `No Mail driver registered for provider: ${providerKey}`,
        providerKey,
      });
    }

    return driver;
  }

  async connect<TNativeClient = unknown>(config: MailClientConfig = {}): Promise<MailClient<TNativeClient>> {
    const selection = this.resolveSelection(config);
    const driver = this.#drivers.get(selection.providerKey);
    if (!driver) {
      if (this.#officialProviders.has(selection.providerKey)) {
        throw new MailSdkException({
          code: 'provider_not_supported',
          message: `Mail provider is officially defined but not registered in this runtime: ${selection.providerKey}`,
          providerKey: selection.providerKey,
        });
      }

      throw new MailSdkException({
        code: 'driver_not_found',
        message: `No Mail driver registered for provider: ${selection.providerKey}`,
        providerKey: selection.providerKey,
      });
    }

    const resolvedConfig: MailResolvedClientConfig = {
      ...config,
      providerKey: selection.providerKey,
      selectionSource: selection.source,
    };
    return driver.connect(resolvedConfig) as Promise<MailClient<TNativeClient>>;
  }
}
