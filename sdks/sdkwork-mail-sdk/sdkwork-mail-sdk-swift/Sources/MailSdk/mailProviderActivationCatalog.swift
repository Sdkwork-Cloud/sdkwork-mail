public struct MailProviderActivationCatalogEntry {
    public let providerKey: String
    public let pluginId: String
    public let driverId: String
    public let activationStatus: String
    public let runtimeBridge: Bool
    public let rootPublic: Bool
    public let packageBoundary: Bool
    public let builtin: Bool
    public let packageIdentity: String
}

public enum MailProviderActivationCatalog {
    public static let recognizedActivationStatuses: [String] = [
        "package-boundary",
        "control-metadata-only",
    ]

    public static let entries: [MailProviderActivationCatalogEntry] = [
        .init(providerKey: "smtp", pluginId: "Mail-smtp", driverId: "sdkwork-mail-driver-smtp", activationStatus: "package-boundary", runtimeBridge: true, rootPublic: false, packageBoundary: true, builtin: true, packageIdentity: "MailSdkProviderSmtp"),
        .init(providerKey: "imap", pluginId: "Mail-imap", driverId: "sdkwork-mail-driver-imap", activationStatus: "package-boundary", runtimeBridge: true, rootPublic: false, packageBoundary: true, builtin: true, packageIdentity: "MailSdkProviderImap"),
    ]

public static func getMailProviderActivationByProviderKey(_ providerKey: String) -> MailProviderActivationCatalogEntry? {
        entries.first { $0.providerKey == providerKey }
    }

}
