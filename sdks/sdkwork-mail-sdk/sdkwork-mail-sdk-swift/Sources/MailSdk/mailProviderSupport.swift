public enum MailProviderSupportStatus: String {
    case builtin_registered = "builtin_registered"
    case official_registered = "official_registered"
    case official_unregistered = "official_unregistered"
    case unknown = "unknown"
}

public struct MailProviderSupportStateRequest {
    public let providerKey: String
    public let builtin: Bool
    public let official: Bool
    public let registered: Bool

    public init(
        providerKey: String,
        builtin: Bool,
        official: Bool,
        registered: Bool
    ) {
        self.providerKey = providerKey
        self.builtin = builtin
        self.official = official
        self.registered = registered
    }
}

public struct MailProviderSupport {
    public let providerKey: String
    public let status: MailProviderSupportStatus
    public let builtin: Bool
    public let official: Bool
    public let registered: Bool

    public static let MailProviderSupportStatuses: [String] = [
        "builtin_registered",
        "official_registered",
        "official_unregistered",
        "unknown",
    ]

    public static func resolveMailProviderSupportStatus(
        _ request: MailProviderSupportStateRequest
    ) -> MailProviderSupportStatus {
        if request.official && request.registered {
            return request.builtin ? .builtin_registered : .official_registered
        }

        if request.official {
            return .official_unregistered
        }

        return .unknown
    }

    public static func createMailProviderSupportState(
        _ request: MailProviderSupportStateRequest
    ) -> MailProviderSupport {
        return MailProviderSupport(
            providerKey: request.providerKey,
            status: resolveMailProviderSupportStatus(request),
            builtin: request.builtin,
            official: request.official,
            registered: request.registered
        )
    }
}
