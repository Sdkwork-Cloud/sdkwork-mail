public enum MailProviderSelectionSource: String {
    case provider_url = "provider_url"
    case provider_key = "provider_key"
    case tenant_override = "tenant_override"
    case deployment_profile = "deployment_profile"
    case default_provider = "default_provider"
}

public struct ParsedMailProviderUrl {
    public let providerKey: String
    public let rawUrl: String

    public init(providerKey: String, rawUrl: String) {
        self.providerKey = providerKey
        self.rawUrl = rawUrl
    }
}

public struct MailProviderSelectionRequest {
    public let providerUrl: String?
    public let providerKey: String?
    public let tenantOverrideProviderKey: String?
    public let deploymentProfileProviderKey: String?

    public init(
        providerUrl: String? = nil,
        providerKey: String? = nil,
        tenantOverrideProviderKey: String? = nil,
        deploymentProfileProviderKey: String? = nil
    ) {
        self.providerUrl = providerUrl
        self.providerKey = providerKey
        self.tenantOverrideProviderKey = tenantOverrideProviderKey
        self.deploymentProfileProviderKey = deploymentProfileProviderKey
    }
}

public struct MailProviderSelection {
    public let providerKey: String
    public let source: MailProviderSelectionSource

    public static let MailProviderSelectionSources: [String] = [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ]

    public static let MailProviderSelectionPrecedence: [String] = [
        "provider_url",
        "provider_key",
        "tenant_override",
        "deployment_profile",
        "default_provider",
    ]

    public static func parseMailProviderUrl(_ providerUrl: String) -> ParsedMailProviderUrl {
        let trimmed = providerUrl.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.hasPrefix("Mail:"), let delimiter = trimmed.range(of: "://") else {
            fatalError("Invalid Mail provider URL: \(providerUrl)")
        }

        return ParsedMailProviderUrl(
            providerKey: String(trimmed[trimmed.index(trimmed.startIndex, offsetBy: 4)..<delimiter.lowerBound]).lowercased(),
            rawUrl: providerUrl
        )
    }

    public static func resolveMailProviderSelection(
        request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) -> MailProviderSelection {
        if let providerUrl = request.providerUrl, hasText(providerUrl) {
            return MailProviderSelection(
                providerKey: parseMailProviderUrl(providerUrl).providerKey,
                source: .provider_url
            )
        }

        if let providerKey = request.providerKey, hasText(providerKey) {
            return MailProviderSelection(
                providerKey: providerKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .provider_key
            )
        }

        if let tenantOverrideProviderKey = request.tenantOverrideProviderKey, hasText(tenantOverrideProviderKey) {
            return MailProviderSelection(
                providerKey: tenantOverrideProviderKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .tenant_override
            )
        }

        if let deploymentProfileProviderKey = request.deploymentProfileProviderKey, hasText(deploymentProfileProviderKey) {
            return MailProviderSelection(
                providerKey: deploymentProfileProviderKey.trimmingCharacters(in: .whitespacesAndNewlines),
                source: .deployment_profile
            )
        }

        return MailProviderSelection(
            providerKey: defaultProviderKey,
            source: .default_provider
        )
    }

    private static func hasText(_ value: String) -> Bool {
        !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
}
