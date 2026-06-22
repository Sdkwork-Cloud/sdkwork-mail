import 'dart:async';

import 'mail_driver_manager.dart';
import 'mail_provider_package_catalog.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class MailProviderPackageLoaderException implements Exception {
  const MailProviderPackageLoaderException(this.code, this.message);

  final String code;
  final String message;

  @override
  String toString() => 'MailProviderPackageLoaderException($code): $message';
}

typedef MailProviderModuleDriverOptions<TNativeClient> = ({
  FutureOr<TNativeClient> Function(MailResolvedClientConfig config)? nativeFactory,
  MailRuntimeController<TNativeClient>? runtimeController,
});

final class MailProviderModule<TNativeClient> {
  const MailProviderModule({
    required this.packageName,
    required this.metadata,
    required this.builtin,
    required this.createDriver,
  });

  final String packageName;
  final MailProviderMetadata metadata;
  final bool builtin;
  final MailProviderDriver<TNativeClient> Function([
    MailProviderModuleDriverOptions<TNativeClient>? options,
  ]) createDriver;
}

final class MailProviderModuleRegistration<TNativeClient> {
  const MailProviderModuleRegistration({
    required this.providerModule,
    this.options,
  });

  final MailProviderModule<TNativeClient> providerModule;
  final MailProviderModuleDriverOptions<TNativeClient>? options;
}

final class MailProviderPackageLoadRequest {
  const MailProviderPackageLoadRequest({
    this.providerKey,
    this.packageIdentity,
  });

  final String? providerKey;
  final String? packageIdentity;
}

final class MailResolvedProviderPackageLoadTarget {
  const MailResolvedProviderPackageLoadTarget({
    required this.packageEntry,
  });

  final MailProviderPackageCatalogEntry packageEntry;
}

typedef MailProviderModuleNamespace = Object?;
typedef MailProviderPackageImportFn = Future<MailProviderModuleNamespace> Function(
  MailResolvedProviderPackageLoadTarget target,
);
typedef MailProviderPackageLoader = Future<MailProviderModuleNamespace> Function(
  MailProviderPackageLoadRequest request,
);

final class MailProviderPackageInstallRequest<TNativeClient> {
  const MailProviderPackageInstallRequest({
    required this.driverManager,
    required this.loadRequest,
    this.options,
  });

  final MailDriverManager driverManager;
  final MailProviderPackageLoadRequest loadRequest;
  final MailProviderModuleDriverOptions<TNativeClient>? options;
}

MailResolvedProviderPackageLoadTarget resolveMailProviderPackageLoadTarget(
  MailProviderPackageLoadRequest request,
) {
  final packageByProviderKey = request.providerKey == null
      ? null
      : getMailProviderPackageByProviderKey(request.providerKey!);
  final packageByIdentity = request.packageIdentity == null
      ? null
      : getMailProviderPackageByPackageIdentity(request.packageIdentity!);

  if (packageByProviderKey != null &&
      packageByIdentity != null &&
      packageByProviderKey.packageIdentity != packageByIdentity.packageIdentity) {
    throw const MailProviderPackageLoaderException(
      'provider_package_identity_mismatch',
      'providerKey and packageIdentity must resolve to the same provider package boundary.',
    );
  }

  final resolvedPackage = packageByProviderKey ?? packageByIdentity;
  if (resolvedPackage == null) {
    throw const MailProviderPackageLoaderException(
      'provider_package_not_found',
      'No official provider package matches the requested provider boundary.',
    );
  }

  return MailResolvedProviderPackageLoadTarget(packageEntry: resolvedPackage);
}

MailProviderPackageLoader createMailProviderPackageLoader({
  required MailProviderPackageImportFn importPackage,
}) {
  return (request) async => loadMailProviderModuleNamespace(
        request,
        importPackage: importPackage,
      );
}

Future<MailProviderModuleNamespace> loadMailProviderModuleNamespace(
  MailProviderPackageLoadRequest request, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final target = resolveMailProviderPackageLoadTarget(request);

  try {
    final namespace = await importPackage(target);
    if (namespace == null) {
      throw const MailProviderPackageLoaderException(
        'provider_module_export_missing',
        'Provider package loader requires an executable provider module namespace.',
      );
    }

    return namespace;
  } on MailProviderPackageLoaderException {
    rethrow;
  } catch (error) {
    throw MailProviderPackageLoaderException(
      'provider_package_load_failed',
      'Reserved provider package loader scaffold could not load ${target.packageEntry.packageIdentity}: $error',
    );
  }
}

Future<MailProviderModule<TNativeClient>> loadMailProviderModule<TNativeClient>(
  MailProviderPackageLoadRequest request, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final target = resolveMailProviderPackageLoadTarget(request);
  final namespace = await loadMailProviderModuleNamespace(
    request,
    importPackage: importPackage,
  );
  final providerModule = _extractProviderModule<TNativeClient>(namespace, target.packageEntry);
  _assertMailProviderModuleContract(providerModule, target.packageEntry);

  return providerModule;
}

Future<void> installMailProviderPackage<TNativeClient>(
  MailProviderPackageInstallRequest<TNativeClient> request, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final providerModule = await loadMailProviderModule<TNativeClient>(
    request.loadRequest,
    importPackage: importPackage,
  );
  request.driverManager.register(providerModule.createDriver(request.options));
}

Future<void> installMailProviderPackages<TNativeClient>(
  Iterable<MailProviderPackageInstallRequest<TNativeClient>> requests, {
  required MailProviderPackageImportFn importPackage,
}) async {
  final materializedRequests = requests.toList(growable: false);
  if (materializedRequests.isEmpty) {
    return;
  }

  final manager = materializedRequests.first.driverManager;
  final drivers = <MailProviderDriver<TNativeClient>>[];

  for (final request in materializedRequests) {
    if (!identical(request.driverManager, manager)) {
      throw const MailProviderPackageLoaderException(
        'provider_module_contract_mismatch',
        'Batch Mail provider package installation requires one shared MailDriverManager.',
      );
    }

    final providerModule = await loadMailProviderModule<TNativeClient>(
      request.loadRequest,
      importPackage: importPackage,
    );
    drivers.add(providerModule.createDriver(request.options));
  }

  manager.registerAll(drivers);
}

MailProviderModule<TNativeClient> _extractProviderModule<TNativeClient>(
  Object? namespace,
  MailProviderPackageCatalogEntry packageEntry,
) {
  if (namespace is MailProviderModule) {
    return namespace as MailProviderModule<TNativeClient>;
  }

  if (namespace is Map<String, Object?>) {
    final value = namespace[packageEntry.sourceSymbol];
    if (value is MailProviderModule) {
      return value as MailProviderModule<TNativeClient>;
    }
  }

  throw MailProviderPackageLoaderException(
    'provider_module_export_missing',
    'Mail provider package is missing the required provider module export: ${packageEntry.sourceSymbol}.',
  );
}

void _assertMailProviderModuleContract<TNativeClient>(
  MailProviderModule<TNativeClient> providerModule,
  MailProviderPackageCatalogEntry packageEntry,
) {
  if (providerModule.packageName != packageEntry.packageIdentity) {
    throw const MailProviderPackageLoaderException(
      'provider_module_contract_mismatch',
      'Mail provider module packageName must match the provider package catalog identity.',
    );
  }

  if (providerModule.metadata.providerKey != packageEntry.providerKey ||
      providerModule.metadata.pluginId != packageEntry.pluginId ||
      providerModule.metadata.driverId != packageEntry.driverId) {
    throw const MailProviderPackageLoaderException(
      'provider_module_contract_mismatch',
      'Mail provider module metadata must match the provider package catalog entry.',
    );
  }
}
