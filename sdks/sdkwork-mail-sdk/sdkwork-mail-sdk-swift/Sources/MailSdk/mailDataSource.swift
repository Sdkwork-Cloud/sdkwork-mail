public struct MailDataSourceOptions {
    public let providerUrl: String?
    public let providerKey: String?
    public let tenantOverrideProviderKey: String?
    public let deploymentProfileProviderKey: String?
    public let defaultProviderKey: String

    public init(
        providerUrl: String? = nil,
        providerKey: String? = nil,
        tenantOverrideProviderKey: String? = nil,
        deploymentProfileProviderKey: String? = nil,
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) {
        self.providerUrl = providerUrl
        self.providerKey = providerKey
        self.tenantOverrideProviderKey = tenantOverrideProviderKey
        self.deploymentProfileProviderKey = deploymentProfileProviderKey
        self.defaultProviderKey = defaultProviderKey
    }
}

public struct MailDataSource {
    public let options: MailDataSourceOptions
    public let driverManager: MailDriverManager

    public init(
        options: MailDataSourceOptions = MailDataSourceOptions(),
        driverManager: MailDriverManager = MailDriverManager()
    ) {
        self.options = options
        self.driverManager = driverManager
    }

    public func describeSelection(_ overrides: MailDataSourceOptions? = nil) -> MailProviderSelection {
        let merged = merge(options, overrides)
        return driverManager.resolveSelection(
            request: MailProviderSelectionRequest(
                providerUrl: merged.providerUrl,
                providerKey: merged.providerKey,
                tenantOverrideProviderKey: merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey: merged.deploymentProfileProviderKey
            ),
            defaultProviderKey: merged.defaultProviderKey
        )
    }

    public func describeProviderSupport(_ overrides: MailDataSourceOptions? = nil) -> MailProviderSupport {
        let selection = describeSelection(overrides)
        return driverManager.describeProviderSupport(providerKey: selection.providerKey)
    }

    public func listProviderSupport() -> [MailProviderSupport] {
        driverManager.listProviderSupport()
    }

    private func merge(_ base: MailDataSourceOptions, _ overrides: MailDataSourceOptions?) -> MailDataSourceOptions {
        guard let overrides else {
            return base
        }

        return MailDataSourceOptions(
            providerUrl: overrides.providerUrl ?? base.providerUrl,
            providerKey: overrides.providerKey ?? base.providerKey,
            tenantOverrideProviderKey: overrides.tenantOverrideProviderKey ?? base.tenantOverrideProviderKey,
            deploymentProfileProviderKey: overrides.deploymentProfileProviderKey ?? base.deploymentProfileProviderKey,
            defaultProviderKey: overrides.defaultProviderKey.isEmpty ? base.defaultProviderKey : overrides.defaultProviderKey
        )
    }
}
