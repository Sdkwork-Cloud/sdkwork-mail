namespace Sdkwork.Mail.Sdk.Provider.Smtp;

/// <summary>
/// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
/// </summary>
public static class MailProviderSmtpPackageContract
{
    public const string ProviderKey = "smtp";
    public const string PluginId = "Mail-smtp";
    public const string DriverId = "sdkwork-mail-driver-smtp";
    public const string PackageIdentity = "Sdkwork.Mail.Sdk.Provider.Smtp";
    public const string Status = "future-runtime-bridge-only";
    public const string RuntimeBridgeStatus = "reserved";
    public const bool RootPublic = false;
}
