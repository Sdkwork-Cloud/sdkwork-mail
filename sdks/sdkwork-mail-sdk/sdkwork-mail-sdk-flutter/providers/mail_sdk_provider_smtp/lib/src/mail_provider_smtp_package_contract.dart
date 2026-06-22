/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
final class MailProviderSmtpPackageContract {
  static const String providerKey = "smtp";
  static const String pluginId = "Mail-smtp";
  static const String driverId = "sdkwork-mail-driver-smtp";
  static const String packageIdentity = "mail_sdk_provider_smtp";
  static const String status = "future-runtime-bridge-only";
  static const String runtimeBridgeStatus = "reserved";
  static const bool rootPublic = false;

  const MailProviderSmtpPackageContract._();
}
