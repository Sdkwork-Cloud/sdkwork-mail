/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
final class MailProviderJitsiPackageContract {
  static const String providerKey = "jitsi";
  static const String pluginId = "Mail-jitsi";
  static const String driverId = "sdkwork-mail-driver-jitsi";
  static const String packageIdentity = "mail_sdk_provider_jitsi";
  static const String status = "future-runtime-bridge-only";
  static const String runtimeBridgeStatus = "reserved";
  static const bool rootPublic = false;

  const MailProviderJitsiPackageContract._();
}
