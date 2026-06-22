import 'dart:async';

import 'mail_client.dart';
import 'mail_provider_selection.dart';
import 'mail_standard_contract.dart';
import 'mail_types.dart';

typedef MailNativeFactory<TNativeClient> = FutureOr<TNativeClient> Function(
  MailResolvedClientConfig config,
);

MailProviderDriver<TNativeClient> createMailProviderDriver<TNativeClient>({
  required MailProviderMetadata metadata,
  MailNativeFactory<TNativeClient>? nativeFactory,
  MailRuntimeController<TNativeClient>? runtimeController,
}) {
  return _StandardMailProviderDriver<TNativeClient>(
    metadata: metadata,
    nativeFactory: nativeFactory,
    runtimeController: runtimeController,
  );
}

final class _StandardMailProviderDriver<TNativeClient>
    implements MailProviderDriver<TNativeClient> {
  _StandardMailProviderDriver({
    required this.metadata,
    this.nativeFactory,
    this.runtimeController,
  });

  @override
  final MailProviderMetadata metadata;

  final MailNativeFactory<TNativeClient>? nativeFactory;
  final MailRuntimeController<TNativeClient>? runtimeController;

  @override
  Future<MailClient<TNativeClient>> connect(MailResolvedClientConfig config) async {
    final resolvedNativeClient = await (nativeFactory?.call(config) ??
        ({
          'providerKey': metadata.providerKey,
          'driverId': metadata.driverId,
          'nativeConfig': config.nativeConfig,
        } as Object?) as TNativeClient);

    return StandardMailClient<TNativeClient>(
      metadata: metadata,
      capabilities: buildMailCapabilitySet(metadata),
      selection: MailProviderSelection(
        providerKey: config.providerKey!,
        source: config.selectionSource,
      ),
      nativeClient: resolvedNativeClient,
      runtimeController: runtimeController,
    );
  }
}
