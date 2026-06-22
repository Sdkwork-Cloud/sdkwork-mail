public struct MailProviderCatalogEntry {
    public let providerKey: String
    public let pluginId: String
    public let driverId: String
    public let defaultSelected: Bool
}

public enum MailProviderCatalog {
    public static let DEFAULT_mail_PROVIDER_KEY: String = "smtp"

    public static let entries: [MailProviderCatalogEntry] = [
        .init(providerKey: "smtp", pluginId: "Mail-smtp", driverId: "sdkwork-mail-driver-smtp", defaultSelected: true),
        .init(providerKey: "imap", pluginId: "Mail-imap", driverId: "sdkwork-mail-driver-imap", defaultSelected: false),
    ]

public static func getMailProviderByProviderKey(_ providerKey: String) -> MailProviderCatalogEntry? {
        entries.first { $0.providerKey == providerKey }
    }

}
