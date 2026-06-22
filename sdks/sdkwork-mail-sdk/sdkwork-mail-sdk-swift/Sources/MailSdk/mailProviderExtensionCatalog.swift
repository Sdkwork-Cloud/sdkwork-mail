public struct MailProviderExtensionCatalogEntry {
    public let extensionKey: String
    public let providerKey: String
    public let displayName: String
    public let surface: String
    public let access: String
    public let status: String
}

public enum MailProviderExtensionCatalog {
    public static let recognizedSurfaces: [String] = [
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    ]

    public static let recognizedAccessModes: [String] = [
        "unwrap-only",
        "extension-object",
    ]

    public static let recognizedStatuses: [String] = [
        "reference-baseline",
        "reserved",
    ]

    public static let entries: [MailProviderExtensionCatalogEntry] = [
        .init(extensionKey: "smtp.transport", providerKey: "smtp", displayName: "SMTP Transport", surface: "runtime-bridge", access: "unwrap-only", status: "reserved"),
        .init(extensionKey: "imap.sync", providerKey: "imap", displayName: "IMAP Sync", surface: "runtime-bridge", access: "unwrap-only", status: "reserved"),
    ]

public static func getMailProviderExtensionCatalog() -> [MailProviderExtensionCatalogEntry] {
        entries
    }

    public static func getMailProviderExtensionDescriptor(_ extensionKey: String) -> MailProviderExtensionCatalogEntry? {
        entries.first { $0.extensionKey == extensionKey }
    }

    public static func getMailProviderExtensionsForProvider(_ providerKey: String) -> [MailProviderExtensionCatalogEntry] {
        entries.filter { $0.providerKey == providerKey }
    }

    public static func getMailProviderExtensions(_ extensionKeys: [String]) -> [MailProviderExtensionCatalogEntry] {
        var resolved: [MailProviderExtensionCatalogEntry] = []
        for extensionKey in extensionKeys {
            if let entry = getMailProviderExtensionDescriptor(extensionKey) {
                resolved.append(entry)
            }
        }

        return resolved
    }

    public static func hasMailProviderExtension(_ extensionKeys: [String], _ extensionKey: String) -> Bool {
        extensionKeys.contains(extensionKey) && getMailProviderExtensionDescriptor(extensionKey) != nil
    }

}
