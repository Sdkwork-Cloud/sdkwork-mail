import { MailSdkException } from './errors.js';
import type { MailDriverManager } from './driver-manager.js';
import {
  getMailProviderPackageByPackageIdentity,
  getMailProviderPackageByProviderKey,
} from './provider-package-catalog.js';
import {
  registerMailProviderModule,
  registerMailProviderModules,
  type MailProviderModule,
  type MailProviderModuleDriverOptions,
  type MailProviderModuleRegistration,
} from './provider-module.js';
import type { MailProviderPackageCatalogEntry } from './types.js';

export interface MailProviderPackageLoadRequest {
  providerKey?: string;
  packageIdentity?: string;
}

export interface MailResolvedProviderPackageLoadTarget {
  providerKey: string;
  packageIdentity: string;
  packageEntry: MailProviderPackageCatalogEntry;
}

export type MailProviderModuleNamespace = Record<string, unknown>;

export interface MailProviderPackageImportFn {
  (
    packageIdentity: string,
    packageEntry: MailProviderPackageCatalogEntry,
  ): Promise<MailProviderModuleNamespace>;
}

export interface MailProviderPackageLoader {
  (
    target: MailResolvedProviderPackageLoadTarget,
  ): Promise<MailProviderModuleNamespace>;
}

export interface MailProviderPackageInstallRequest<TNativeClient = unknown>
  extends MailProviderPackageLoadRequest {
  options?: MailProviderModuleDriverOptions<TNativeClient>;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isMailProviderModule<TNativeClient = unknown>(
  value: unknown,
): value is MailProviderModule<TNativeClient> {
  return (
    isObjectRecord(value) &&
    typeof value.packageName === 'string' &&
    isObjectRecord(value.metadata) &&
    typeof value.createDriver === 'function'
  );
}

function assertMailProviderModuleMatchesLoadTarget<TNativeClient = unknown>(
  target: MailResolvedProviderPackageLoadTarget,
  providerModule: MailProviderModule<TNativeClient>,
): void {
  const expectedPackage = target.packageEntry;
  const actualMetadata = providerModule.metadata;
  const expectedTypeScriptPackage = actualMetadata.typescriptPackage;

  const matches =
    providerModule.packageName === expectedPackage.packageIdentity &&
    actualMetadata.providerKey === expectedPackage.providerKey &&
    actualMetadata.pluginId === expectedPackage.pluginId &&
    actualMetadata.driverId === expectedPackage.driverId &&
    expectedTypeScriptPackage.packageName === expectedPackage.packageIdentity &&
    expectedTypeScriptPackage.driverFactory === expectedPackage.driverFactory &&
    expectedTypeScriptPackage.metadataSymbol === expectedPackage.metadataSymbol &&
    expectedTypeScriptPackage.moduleSymbol === expectedPackage.moduleSymbol;

  if (matches) {
    return;
  }

  throw new MailSdkException({
    code: 'provider_module_contract_mismatch',
    message: `Mail provider package load target drift detected: ${target.packageIdentity} returned a provider module for ${actualMetadata.providerKey}`,
    providerKey: expectedPackage.providerKey,
    pluginId: expectedPackage.pluginId,
    details: {
      expectedProviderKey: expectedPackage.providerKey,
      receivedProviderKey: actualMetadata.providerKey,
      expectedPackageIdentity: expectedPackage.packageIdentity,
      receivedPackageName: providerModule.packageName,
      expectedPluginId: expectedPackage.pluginId,
      receivedPluginId: actualMetadata.pluginId,
      expectedDriverId: expectedPackage.driverId,
      receivedDriverId: actualMetadata.driverId,
      expectedModuleSymbol: expectedPackage.moduleSymbol,
      receivedModuleSymbol: expectedTypeScriptPackage.moduleSymbol,
    },
  });
}

export function resolveMailProviderPackageLoadTarget(
  request: MailProviderPackageLoadRequest,
): MailResolvedProviderPackageLoadTarget {
  const packageEntryByProviderKey =
    typeof request.providerKey === 'string' && request.providerKey.length > 0
      ? getMailProviderPackageByProviderKey(request.providerKey)
      : undefined;
  const packageEntryByPackageIdentity =
    typeof request.packageIdentity === 'string' && request.packageIdentity.length > 0
      ? getMailProviderPackageByPackageIdentity(request.packageIdentity)
      : undefined;

  if (
    typeof request.providerKey === 'string' &&
    request.providerKey.length > 0 &&
    typeof request.packageIdentity === 'string' &&
    request.packageIdentity.length > 0
  ) {
    if (
      !packageEntryByProviderKey ||
      !packageEntryByPackageIdentity ||
      packageEntryByProviderKey.providerKey !== packageEntryByPackageIdentity.providerKey
    ) {
      throw new MailSdkException({
        code: 'provider_package_identity_mismatch',
        message:
          'Mail provider package request drift detected: providerKey and packageIdentity must resolve to the same official package boundary',
        providerKey: request.providerKey,
        pluginId: packageEntryByProviderKey?.pluginId ?? packageEntryByPackageIdentity?.pluginId,
        details: {
          requestedProviderKey: request.providerKey,
          requestedPackageIdentity: request.packageIdentity,
          resolvedProviderKey: packageEntryByProviderKey?.providerKey,
          resolvedPackageIdentity: packageEntryByPackageIdentity?.packageIdentity,
        },
      });
    }
  }

  const packageEntry = packageEntryByProviderKey ?? packageEntryByPackageIdentity;
  if (!packageEntry) {
    throw new MailSdkException({
      code: 'provider_package_not_found',
      message:
        'Mail provider package resolution requires a known providerKey or packageIdentity from the official package catalog',
      providerKey: request.providerKey,
      details: {
        providerKey: request.providerKey,
        packageIdentity: request.packageIdentity,
      },
    });
  }

  return {
    providerKey: packageEntry.providerKey,
    packageIdentity: packageEntry.packageIdentity,
    packageEntry,
  };
}

export function createMailProviderPackageLoader(
  importPackage: MailProviderPackageImportFn = async (packageIdentity) => import(packageIdentity),
): MailProviderPackageLoader {
  return async (target) => {
    try {
      return await importPackage(target.packageIdentity, target.packageEntry);
    } catch (error) {
      throw new MailSdkException({
        code: 'provider_package_load_failed',
        message: `Failed to load Mail provider package: ${target.packageIdentity}`,
        providerKey: target.providerKey,
        pluginId: target.packageEntry.pluginId,
        details: {
          packageIdentity: target.packageIdentity,
          moduleSymbol: target.packageEntry.moduleSymbol,
        },
        cause: error,
      });
    }
  };
}

export async function loadMailProviderModule<TNativeClient = unknown>(
  request: MailProviderPackageLoadRequest,
  loader: MailProviderPackageLoader,
): Promise<MailProviderModule<TNativeClient>> {
  const target = resolveMailProviderPackageLoadTarget(request);

  let namespace: MailProviderModuleNamespace;
  try {
    namespace = await loader(target);
  } catch (error) {
    if (error instanceof MailSdkException) {
      throw error;
    }

    throw new MailSdkException({
      code: 'provider_package_load_failed',
      message: `Failed to load Mail provider package: ${target.packageIdentity}`,
      providerKey: target.providerKey,
      pluginId: target.packageEntry.pluginId,
      details: {
        packageIdentity: target.packageIdentity,
        moduleSymbol: target.packageEntry.moduleSymbol,
      },
      cause: error,
    });
  }

  if (!isObjectRecord(namespace)) {
    throw new MailSdkException({
      code: 'provider_module_export_missing',
      message: `Mail provider package did not return a module namespace object: ${target.packageIdentity}`,
      providerKey: target.providerKey,
      pluginId: target.packageEntry.pluginId,
      details: {
        packageIdentity: target.packageIdentity,
        moduleSymbol: target.packageEntry.moduleSymbol,
      },
    });
  }

  const providerModule = namespace[target.packageEntry.moduleSymbol];
  if (!isMailProviderModule<TNativeClient>(providerModule)) {
    throw new MailSdkException({
      code: 'provider_module_export_missing',
      message: `Mail provider package is missing the required provider module export: ${target.packageEntry.moduleSymbol}`,
      providerKey: target.providerKey,
      pluginId: target.packageEntry.pluginId,
      details: {
        packageIdentity: target.packageIdentity,
        moduleSymbol: target.packageEntry.moduleSymbol,
        availableExports: Object.keys(namespace),
      },
    });
  }

  assertMailProviderModuleMatchesLoadTarget(target, providerModule);

  return providerModule;
}

export async function installMailProviderPackage<TNativeClient = unknown>(
  manager: MailDriverManager,
  request: MailProviderPackageInstallRequest<TNativeClient>,
  loader: MailProviderPackageLoader,
): Promise<MailDriverManager> {
  const providerModule = await loadMailProviderModule<TNativeClient>(request, loader);
  registerMailProviderModule(manager, providerModule, request.options);
  return manager;
}

export async function installMailProviderPackages<TNativeClient = unknown>(
  manager: MailDriverManager,
  requests: readonly MailProviderPackageInstallRequest<TNativeClient>[],
  loader: MailProviderPackageLoader,
): Promise<MailDriverManager> {
  const registrations: MailProviderModuleRegistration<TNativeClient>[] = [];

  for (const request of requests) {
    registrations.push({
      providerModule: await loadMailProviderModule<TNativeClient>(request, loader),
      options: request.options,
    });
  }

  registerMailProviderModules(manager, registrations);
  return manager;
}
