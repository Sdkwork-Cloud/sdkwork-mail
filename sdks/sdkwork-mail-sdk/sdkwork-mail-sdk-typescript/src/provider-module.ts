import { MailSdkException } from './errors.js';
import type { CreateMailProviderDriverOptions, MailProviderDriver } from './driver.js';
import type { MailDriverManager } from './driver-manager.js';
import { freezeMailRuntimeValue } from './runtime-freeze.js';
import type {
  MailProviderCatalogEntry,
  MailTypeScriptAdapterContract,
} from './types.js';

export type MailProviderModuleDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
>;

export interface MailProviderModule<TNativeClient = unknown> {
  readonly packageName: string;
  readonly metadata: MailProviderCatalogEntry;
  readonly builtin: boolean;
  readonly typescriptAdapter: MailTypeScriptAdapterContract;
  createDriver(
    options?: MailProviderModuleDriverOptions<TNativeClient>,
  ): MailProviderDriver<TNativeClient>;
}

export interface MailProviderModuleRegistration<TNativeClient = unknown> {
  providerModule: MailProviderModule<TNativeClient>;
  options?: MailProviderModuleDriverOptions<TNativeClient>;
}

export interface CreateMailProviderModuleOptions<TNativeClient = unknown> {
  packageName: string;
  metadata: MailProviderCatalogEntry;
  builtin: boolean;
  createDriver(
    options?: MailProviderModuleDriverOptions<TNativeClient>,
  ): MailProviderDriver<TNativeClient>;
}

export function createMailProviderModule<TNativeClient = unknown>(
  options: CreateMailProviderModuleOptions<TNativeClient>,
): MailProviderModule<TNativeClient> {
  return freezeMailRuntimeValue({
    packageName: options.packageName,
    metadata: options.metadata,
    builtin: options.builtin,
    typescriptAdapter: options.metadata.typescriptAdapter,
    createDriver(driverOptions = {}) {
      return options.createDriver(driverOptions);
    },
  });
}

function sameJsonShape(actual: unknown, expected: unknown): boolean {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function assertMailProviderModuleContract<TNativeClient = unknown>(
  providerModule: MailProviderModule<TNativeClient>,
): void {
  const packageContract = providerModule.metadata.typescriptPackage;

  if (providerModule.packageName !== packageContract.packageName) {
    throw new MailSdkException({
      code: 'provider_module_contract_mismatch',
      message: `Mail provider module package contract drift detected for ${providerModule.metadata.providerKey}: packageName must match the assembly-driven TypeScript package contract`,
      providerKey: providerModule.metadata.providerKey,
      pluginId: providerModule.metadata.pluginId,
      details: {
        expectedPackageName: packageContract.packageName,
        receivedPackageName: providerModule.packageName,
      },
    });
  }

  if (providerModule.builtin !== providerModule.metadata.builtin) {
    throw new MailSdkException({
      code: 'provider_module_contract_mismatch',
      message: `Mail provider module package contract drift detected for ${providerModule.metadata.providerKey}: builtin must match the assembly-driven provider metadata`,
      providerKey: providerModule.metadata.providerKey,
      pluginId: providerModule.metadata.pluginId,
      details: {
        expectedBuiltin: providerModule.metadata.builtin,
        receivedBuiltin: providerModule.builtin,
      },
    });
  }

  if (!sameJsonShape(providerModule.typescriptAdapter, providerModule.metadata.typescriptAdapter)) {
    throw new MailSdkException({
      code: 'provider_module_contract_mismatch',
      message: `Mail provider module package contract drift detected for ${providerModule.metadata.providerKey}: TypeScript adapter contract must match provider metadata`,
      providerKey: providerModule.metadata.providerKey,
      pluginId: providerModule.metadata.pluginId,
      details: {
        expectedTypeScriptAdapter: providerModule.metadata.typescriptAdapter,
        receivedTypeScriptAdapter: providerModule.typescriptAdapter,
      },
    });
  }
}

export function registerMailProviderModule<TNativeClient = unknown>(
  manager: MailDriverManager,
  providerModule: MailProviderModule<TNativeClient>,
  options: MailProviderModuleDriverOptions<TNativeClient> = {},
): MailDriverManager {
  assertMailProviderModuleContract(providerModule);
  manager.register(providerModule.createDriver(options));
  return manager;
}

export function registerMailProviderModules<TNativeClient = unknown>(
  manager: MailDriverManager,
  registrations: readonly MailProviderModuleRegistration<TNativeClient>[],
): MailDriverManager {
  const drivers = registrations.map((registration) => {
    assertMailProviderModuleContract(registration.providerModule);
    return registration.providerModule.createDriver(registration.options);
  });

  manager.registerAll(drivers);

  return manager;
}
