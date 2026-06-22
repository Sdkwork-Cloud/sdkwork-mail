public struct MailDriverManager {
    public init() {}

    public func resolveSelection(
        request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY
    ) -> MailProviderSelection {
        return MailProviderSelection.resolveMailProviderSelection(
            request: request,
            defaultProviderKey: defaultProviderKey
        )
    }

    public func describeProviderSupport(providerKey: String) -> MailProviderSupport {
        let official = MailProviderCatalog.getMailProviderByProviderKey(providerKey) != nil
        let activation = MailProviderActivationCatalog.getMailProviderActivationByProviderKey(providerKey)

        return MailProviderSupport.createMailProviderSupportState(
            .init(
                providerKey: providerKey,
                builtin: activation?.builtin ?? false,
                official: official,
                registered: activation?.runtimeBridge ?? false
            )
        )
    }

    public func listProviderSupport() -> [MailProviderSupport] {
        MailProviderCatalog.entries.map { describeProviderSupport(providerKey: $0.providerKey) }
    }
}
