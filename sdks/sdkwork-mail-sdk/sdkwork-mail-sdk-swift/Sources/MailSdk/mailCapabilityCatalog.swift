public struct MailCapabilityCatalogEntry {
    public let capabilityKey: String
    public let category: String
    public let surface: String
}

public enum MailCapabilityCatalog {
    public static let entries: [MailCapabilityCatalogEntry] = [
        .init(capabilityKey: "transport.connect", category: "required-baseline", surface: "control-plane"),
        .init(capabilityKey: "transport.authenticate", category: "required-baseline", surface: "control-plane"),
        .init(capabilityKey: "health", category: "required-baseline", surface: "control-plane"),
        .init(capabilityKey: "smtp.send", category: "optional-advanced", surface: "runtime-bridge"),
        .init(capabilityKey: "imap.sync", category: "optional-advanced", surface: "runtime-bridge"),
        .init(capabilityKey: "imap.folder-sync", category: "optional-advanced", surface: "runtime-bridge"),
        .init(capabilityKey: "imap.message-sync", category: "optional-advanced", surface: "runtime-bridge"),
        .init(capabilityKey: "transport.retry", category: "optional-advanced", surface: "control-plane"),
        .init(capabilityKey: "transport.pool", category: "optional-advanced", surface: "control-plane"),
    ]

public static func getMailCapabilityCatalog() -> [MailCapabilityCatalogEntry] {
        entries
    }

    public static func getMailCapabilityDescriptor(_ capabilityKey: String) -> MailCapabilityCatalogEntry? {
        entries.first { $0.capabilityKey == capabilityKey }
    }

}
