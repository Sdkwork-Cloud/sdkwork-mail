import 'mail_provider_selection.dart';

enum MailTransportConnectionState {
  connected,
  disconnected,
}

class MailProviderMetadata {
  const MailProviderMetadata({
    required this.providerKey,
    required this.pluginId,
    required this.driverId,
    required this.displayName,
    required this.defaultSelected,
    this.urlSchemes = const <String>[],
    this.requiredCapabilities = const <String>[],
    this.optionalCapabilities = const <String>[],
    this.extensionKeys = const <String>[],
  });

  final String providerKey;
  final String pluginId;
  final String driverId;
  final String displayName;
  final bool defaultSelected;
  final List<String> urlSchemes;
  final List<String> requiredCapabilities;
  final List<String> optionalCapabilities;
  final List<String> extensionKeys;
}

class MailCapabilitySet {
  const MailCapabilitySet({
    required this.required,
    required this.optional,
  });

  final List<String> required;
  final List<String> optional;
}

class MailTransportConnectOptions {
  const MailTransportConnectOptions({
    required this.accountId,
    this.metadata,
  });

  final String accountId;
  final Map<String, Object?>? metadata;
}

class MailTransportAuthenticateOptions {
  const MailTransportAuthenticateOptions({
    required this.username,
    this.secretRef,
    this.metadata,
  });

  final String username;
  final String? secretRef;
  final Map<String, Object?>? metadata;
}

class MailTransportDescriptor {
  const MailTransportDescriptor({
    required this.accountId,
    required this.providerKey,
    required this.connectionState,
  });

  final String accountId;
  final String providerKey;
  final MailTransportConnectionState connectionState;
}

class MailSendOptions {
  const MailSendOptions({
    this.messageId,
    required this.from,
    required this.to,
    required this.subject,
    this.bodyText,
    this.bodyHtml,
    this.metadata,
  });

  final String? messageId;
  final String from;
  final List<String> to;
  final String subject;
  final String? bodyText;
  final String? bodyHtml;
  final Map<String, Object?>? metadata;
}

class MailSendResult {
  const MailSendResult({
    required this.messageId,
    required this.accepted,
  });

  final String messageId;
  final List<String> accepted;
}

class MailMailboxProbeOptions {
  const MailMailboxProbeOptions({
    this.mailbox,
    this.metadata,
  });

  final String? mailbox;
  final Map<String, Object?>? metadata;
}

class MailMailboxProbeResult {
  const MailMailboxProbeResult({
    required this.mailbox,
    required this.exists,
    this.uidValidity,
    this.uidNext,
  });

  final String mailbox;
  final int exists;
  final int? uidValidity;
  final int? uidNext;
}

class MailMailboxSyncOptions {
  const MailMailboxSyncOptions({
    this.folderId,
    this.mailbox,
    this.sinceUid,
    this.limit,
    this.metadata,
  });

  final String? folderId;
  final String? mailbox;
  final int? sinceUid;
  final int? limit;
  final Map<String, Object?>? metadata;
}

class MailMailboxSyncResult {
  const MailMailboxSyncResult({
    required this.folderId,
    required this.syncedCount,
    this.highestUid,
    this.uidValidity,
  });

  final String folderId;
  final int syncedCount;
  final int? highestUid;
  final int? uidValidity;
}

class MailTransportHealthResult {
  const MailTransportHealthResult({
    required this.healthy,
    this.detail,
  });

  final bool healthy;
  final String? detail;
}

class MailClientConfig {
  const MailClientConfig({
    this.providerUrl,
    this.providerKey,
    this.tenantOverrideProviderKey,
    this.deploymentProfileProviderKey,
    this.defaultProviderKey,
    this.nativeConfig,
  });

  final String? providerUrl;
  final String? providerKey;
  final String? tenantOverrideProviderKey;
  final String? deploymentProfileProviderKey;
  final String? defaultProviderKey;
  final Object? nativeConfig;
}

class MailResolvedClientConfig extends MailClientConfig {
  const MailResolvedClientConfig({
    super.providerUrl,
    required super.providerKey,
    super.tenantOverrideProviderKey,
    super.deploymentProfileProviderKey,
    super.defaultProviderKey,
    super.nativeConfig,
    required this.selectionSource,
  });

  final MailProviderSelectionSource selectionSource;
}

class MailRuntimeControllerContext<TNativeClient> {
  const MailRuntimeControllerContext({
    required this.metadata,
    required this.capabilities,
    required this.selection,
    required this.nativeClient,
  });

  final MailProviderMetadata metadata;
  final MailCapabilitySet capabilities;
  final MailProviderSelection selection;
  final TNativeClient nativeClient;
}
