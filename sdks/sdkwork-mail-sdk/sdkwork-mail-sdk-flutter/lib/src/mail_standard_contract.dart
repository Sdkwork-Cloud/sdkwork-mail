import 'mail_provider_selection.dart';
import 'mail_types.dart';

abstract interface class MailProviderDriver<TNativeClient> {
  MailProviderMetadata get metadata;
  Future<MailClient<TNativeClient>> connect(MailResolvedClientConfig config);
}

abstract interface class MailClient<TNativeClient> {
  MailProviderMetadata get metadata;
  MailCapabilitySet get capabilities;
  MailProviderSelection get selection;
  Future<MailTransportDescriptor> connectTransport(MailTransportConnectOptions options);
  Future<MailTransportDescriptor> authenticateTransport(
    MailTransportAuthenticateOptions options,
  );
  Future<MailTransportDescriptor> disconnectTransport();
  Future<MailSendResult> sendMail(MailSendOptions options);
  Future<MailMailboxProbeResult> probeMailbox([MailMailboxProbeOptions? options]);
  Future<MailMailboxSyncResult> syncMailbox([MailMailboxSyncOptions? options]);
  Future<MailTransportHealthResult> healthCheck();
  List<String> getProviderExtensions();
  bool supportsProviderExtension(String extensionKey);
  bool supportsCapability(String capability);
  void requireCapability(String capability);
  TNativeClient unwrap();
}

abstract interface class MailRuntimeController<TNativeClient> {
  Future<MailTransportDescriptor> connectTransport(
    MailTransportConnectOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailTransportDescriptor> authenticateTransport(
    MailTransportAuthenticateOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailTransportDescriptor> disconnectTransport(
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailSendResult> sendMail(
    MailSendOptions options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailMailboxProbeResult> probeMailbox(
    MailMailboxProbeOptions? options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailMailboxSyncResult> syncMailbox(
    MailMailboxSyncOptions? options,
    MailRuntimeControllerContext<TNativeClient> context,
  );
  Future<MailTransportHealthResult> healthCheck(
    MailRuntimeControllerContext<TNativeClient> context,
  );
}

final class MailStandardContract {
  static const String symbol = 'MailStandardContract';
  static const List<String> jdbcStyleResolutionTypes = <String>[
    'MailDriverManager',
    'MailDataSource',
  ];
  static const List<String> runtimeSurfaceMethods = <String>[
    'connectTransport',
    'authenticateTransport',
    'disconnectTransport',
    'sendMail',
    'probeMailbox',
    'syncMailbox',
    'healthCheck',
  ];
  static const String runtimeSurfaceFailureCode = 'native_sdk_not_available';

  const MailStandardContract._();
}
