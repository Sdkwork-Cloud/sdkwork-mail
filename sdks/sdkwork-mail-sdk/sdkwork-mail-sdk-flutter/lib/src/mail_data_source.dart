import 'mail_driver_manager.dart';
import 'mail_provider_catalog.dart';
import 'mail_provider_selection.dart';
import 'mail_provider_support.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

final class MailDataSourceOptions extends MailClientConfig {
  const MailDataSourceOptions({
    super.providerUrl,
    super.providerKey,
    super.tenantOverrideProviderKey,
    super.deploymentProfileProviderKey,
    super.defaultProviderKey = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
    super.nativeConfig,
  });
}

MailDataSourceOptions _mergeOptions(
  MailDataSourceOptions base,
  MailDataSourceOptions? overrides,
) {
  if (overrides == null) {
    return base;
  }

  return MailDataSourceOptions(
    providerUrl: overrides.providerUrl ?? base.providerUrl,
    providerKey: overrides.providerKey ?? base.providerKey,
    tenantOverrideProviderKey:
        overrides.tenantOverrideProviderKey ?? base.tenantOverrideProviderKey,
    deploymentProfileProviderKey:
        overrides.deploymentProfileProviderKey ?? base.deploymentProfileProviderKey,
    defaultProviderKey: overrides.defaultProviderKey ?? base.defaultProviderKey,
    nativeConfig: overrides.nativeConfig ?? base.nativeConfig,
  );
}

final class MailDataSource {
  MailDataSource({
    MailDataSourceOptions? options,
    MailDriverManager? driverManager,
  })  : options = options ?? const MailDataSourceOptions(),
        driverManager = driverManager ?? MailDriverManager();

  final MailDataSourceOptions options;
  final MailDriverManager driverManager;

  MailProviderMetadata describe([MailDataSourceOptions? overrides]) {
    return driverManager.getMetadata(
      _mergeOptions(options, overrides),
    );
  }

  MailProviderSelection describeSelection([MailDataSourceOptions? overrides]) {
    final merged = _mergeOptions(options, overrides);
    return driverManager.resolveSelection(
      MailProviderSelectionRequest(
        providerUrl: merged.providerUrl,
        providerKey: merged.providerKey,
        tenantOverrideProviderKey: merged.tenantOverrideProviderKey,
        deploymentProfileProviderKey: merged.deploymentProfileProviderKey,
      ),
      defaultProviderKey: merged.defaultProviderKey,
    );
  }

  MailProviderSupport describeProviderSupport([MailDataSourceOptions? overrides]) {
    final selection = describeSelection(overrides);
    return driverManager.describeProviderSupport(selection.providerKey);
  }

  List<MailProviderSupport> listProviderSupport() {
    return driverManager.listProviderSupport();
  }

  bool supportsCapability(
    String capability, [
    MailDataSourceOptions? overrides,
  ]) {
    final metadata = describe(overrides);
    return metadata.requiredCapabilities.contains(capability) ||
        metadata.optionalCapabilities.contains(capability);
  }

  bool supportsProviderExtension(
    String extensionKey, [
    MailDataSourceOptions? overrides,
  ]) {
    return describe(overrides).extensionKeys.contains(extensionKey);
  }

  Future<MailClient<TNativeClient>> createClient<TNativeClient>([
    MailDataSourceOptions? overrides,
  ]) async {
    return await driverManager.connect(
          _mergeOptions(options, overrides),
        )
        as MailClient<TNativeClient>;
  }
}
