public struct MailProviderPackageCatalogEntry {
    public let providerKey: String
    public let pluginId: String
    public let driverId: String
    public let packageIdentity: String
    public let manifestPath: String
    public let readmePath: String
    public let sourcePath: String
    public let sourceSymbol: String
    public let builtin: Bool
    public let rootPublic: Bool
    public let status: String
    public let runtimeBridgeStatus: String
}

public enum MailProviderPackageCatalog {
    public static let entries: [MailProviderPackageCatalogEntry] = [
        .init(providerKey: "smtp", pluginId: "Mail-smtp", driverId: "sdkwork-mail-driver-smtp", packageIdentity: "MailSdkProviderSmtp", manifestPath: "Providers/MailSdkProviderSmtp/Package.swift", readmePath: "Providers/MailSdkProviderSmtp/README.md", sourcePath: "Providers/MailSdkProviderSmtp/Sources/MailSdkProviderSmtp/MailProviderSmtpPackageContract.swift", sourceSymbol: "MailProviderSmtpPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved"),
        .init(providerKey: "imap", pluginId: "Mail-imap", driverId: "sdkwork-mail-driver-imap", packageIdentity: "MailSdkProviderImap", manifestPath: "Providers/MailSdkProviderImap/Package.swift", readmePath: "Providers/MailSdkProviderImap/README.md", sourcePath: "Providers/MailSdkProviderImap/Sources/MailSdkProviderImap/MailProviderImapPackageContract.swift", sourceSymbol: "MailProviderImapPackageContract", builtin: true, rootPublic: false, status: "future-runtime-bridge-only", runtimeBridgeStatus: "reserved"),
    ]

public static func getMailProviderPackageByProviderKey(_ providerKey: String) -> MailProviderPackageCatalogEntry? {
        entries.first { $0.providerKey == providerKey }
    }

    public static func getMailProviderPackageByPackageIdentity(_ packageIdentity: String) -> MailProviderPackageCatalogEntry? {
        entries.first { $0.packageIdentity == packageIdentity }
    }

}
