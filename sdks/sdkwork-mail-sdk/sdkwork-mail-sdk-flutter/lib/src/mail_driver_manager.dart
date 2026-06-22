import 'mail_errors.dart';
import 'mail_provider_activation_catalog.dart';
import 'mail_provider_catalog.dart';
import 'mail_provider_metadata.dart';
import 'mail_provider_selection.dart';
import 'mail_provider_support.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class MailDriverManager {
  MailDriverManager({
    this.defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
    Iterable<MailProviderDriver<dynamic>> drivers =
        const <MailProviderDriver<dynamic>>[],
  }) {
    registerAll(drivers);
  }

  final String defaultProviderKey;
  final Map<String, MailProviderDriver<dynamic>> _drivers =
      <String, MailProviderDriver<dynamic>>{};

  MailProviderSelection resolveSelection(
    MailProviderSelectionRequest request, {
    String? defaultProviderKey,
  }) {
    return resolveMailProviderSelection(
      request,
      defaultProviderKey: defaultProviderKey ?? this.defaultProviderKey,
    );
  }

  MailProviderMetadata getMetadata([
    MailClientConfig config = const MailClientConfig(),
  ]) {
    final selection = _resolveClientSelection(config);
    final catalogEntry = getMailProviderByProviderKey(selection.providerKey);
    final driver = _drivers[selection.providerKey];
    if (driver != null) {
      return driver.metadata;
    }

    final officialMetadata =
        catalogEntry == null
            ? null
            : getOfficialMailProviderMetadataByKey(catalogEntry.providerKey);
    if (officialMetadata != null) {
      return officialMetadata;
    }

    throw MailSdkException(
      code: 'driver_not_found',
      message: 'No Mail driver registered for provider: ${selection.providerKey}',
      providerKey: selection.providerKey,
    );
  }

  MailProviderMetadata getDefaultMetadata() {
    return getMetadata(
      MailClientConfig(defaultProviderKey: defaultProviderKey),
    );
  }

  void register<TNativeClient>(MailProviderDriver<TNativeClient> driver) {
    _asseMailanRegister(driver);
    _drivers[driver.metadata.providerKey] = driver;
  }

  void registerAll(Iterable<MailProviderDriver<dynamic>> drivers) {
    final plannedProviderKeys = <String>{};

    for (final driver in drivers) {
      _asseMailanRegister(
        driver,
        plannedProviderKeys: plannedProviderKeys,
      );
      plannedProviderKeys.add(driver.metadata.providerKey);
    }

    for (final driver in drivers) {
      _drivers[driver.metadata.providerKey] = driver;
    }
  }

  bool hasDriver(String providerKey) => _drivers.containsKey(providerKey);

  MailProviderDriver<dynamic> resolveDriver(String providerKey) {
    final driver = _drivers[providerKey];
    if (driver != null) {
      return driver;
    }

    throw MailSdkException(
      code: 'driver_not_found',
      message: 'No Mail driver registered for provider: $providerKey',
      providerKey: providerKey,
    );
  }

  MailProviderSupport describeProviderSupport(String providerKey) {
    final catalogEntry = getMailProviderByProviderKey(providerKey);
    final activationEntry = getMailProviderActivationByProviderKey(providerKey);
    final registered = _drivers.containsKey(providerKey);

    return createMailProviderSupportState(
      MailProviderSupportStateRequest(
        providerKey: providerKey,
        builtin: activationEntry?.builtin ?? false,
        official: catalogEntry != null && activationEntry != null,
        registered: registered,
      ),
    );
  }

  List<MailProviderSupport> listProviderSupport() {
    return MailProviderCatalog.entries
        .map((entry) => describeProviderSupport(entry.providerKey))
        .toList(growable: false);
  }

  Future<MailClient<dynamic>> connect([
    MailClientConfig config = const MailClientConfig(),
  ]) async {
    final selection = _resolveClientSelection(config);
    final driver = _drivers[selection.providerKey];

    if (driver == null) {
      final catalogEntry = getMailProviderByProviderKey(selection.providerKey);
      final activationEntry = getMailProviderActivationByProviderKey(
        selection.providerKey,
      );

      if (catalogEntry != null && activationEntry != null) {
        throw MailSdkException(
          code: 'provider_not_supported',
          message: 'Mail provider is officially defined but not registered in this runtime: ${selection.providerKey}',
          providerKey: selection.providerKey,
        );
      }

      throw MailSdkException(
        code: 'driver_not_found',
        message: 'No Mail driver registered for provider: ${selection.providerKey}',
        providerKey: selection.providerKey,
      );
    }

    return driver.connect(
      MailResolvedClientConfig(
        providerUrl: config.providerUrl,
        providerKey: selection.providerKey,
        tenantOverrideProviderKey: config.tenantOverrideProviderKey,
        deploymentProfileProviderKey: config.deploymentProfileProviderKey,
        defaultProviderKey: config.defaultProviderKey ?? defaultProviderKey,
        nativeConfig: config.nativeConfig,
        selectionSource: selection.source,
      ),
    );
  }

  MailProviderSelection _resolveClientSelection(MailClientConfig config) {
    return resolveSelection(
      MailProviderSelectionRequest(
        providerUrl: config.providerUrl,
        providerKey: config.providerKey,
        tenantOverrideProviderKey: config.tenantOverrideProviderKey,
        deploymentProfileProviderKey: config.deploymentProfileProviderKey,
      ),
      defaultProviderKey: config.defaultProviderKey,
    );
  }

  void _asseMailanRegister(
    MailProviderDriver<dynamic> driver, {
    Set<String> plannedProviderKeys = const <String>{},
  }) {
    final providerKey = driver.metadata.providerKey;
    final catalogEntry = getMailProviderByProviderKey(providerKey);
    final activationEntry = getMailProviderActivationByProviderKey(providerKey);
    final officialMetadata = getOfficialMailProviderMetadataByKey(providerKey);

    if (
      catalogEntry == null ||
      activationEntry == null ||
      officialMetadata == null
    ) {
      throw MailSdkException(
        code: 'provider_not_official',
        message: 'Mail driver registration requires an official provider catalog entry: $providerKey',
        providerKey: providerKey,
        pluginId: driver.metadata.pluginId,
      );
    }

    if (!_sameProviderMetadata(driver.metadata, officialMetadata)) {
      throw MailSdkException(
        code: 'provider_metadata_mismatch',
        message: 'Mail driver metadata must match the official provider catalog: $providerKey',
        providerKey: providerKey,
        pluginId: driver.metadata.pluginId,
        details: <String, Object?>{
          'expectedMetadata': officialMetadata.toDebugMap(),
          'receivedMetadata': driver.metadata.toDebugMap(),
        },
      );
    }

    if (_drivers.containsKey(providerKey) || plannedProviderKeys.contains(providerKey)) {
      throw MailSdkException(
        code: 'driver_already_registered',
        message: 'Mail driver already registered for provider: $providerKey',
        providerKey: providerKey,
        pluginId: driver.metadata.pluginId,
      );
    }
  }

  bool _sameProviderMetadata(
    MailProviderMetadata actual,
    MailProviderMetadata expected,
  ) {
    return actual.providerKey == expected.providerKey &&
        actual.pluginId == expected.pluginId &&
        actual.driverId == expected.driverId &&
        actual.displayName == expected.displayName &&
        actual.defaultSelected == expected.defaultSelected &&
        _sameStringList(actual.requiredCapabilities, expected.requiredCapabilities) &&
        _sameStringList(actual.optionalCapabilities, expected.optionalCapabilities) &&
        _sameStringList(actual.extensionKeys, expected.extensionKeys);
  }

  bool _sameStringList(List<String> actual, List<String> expected) {
    if (actual.length != expected.length) {
      return false;
    }

    for (var index = 0; index < actual.length; index += 1) {
      if (actual[index] != expected[index]) {
        return false;
      }
    }

    return true;
  }
}
