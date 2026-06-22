package Mailstandard

type MailDriverManager struct{}

func (manager MailDriverManager) resolveSelection(request MailProviderSelectionRequest, defaultProviderKey string) MailProviderSelection {
    return ResolveMailProviderSelection(request, defaultProviderKey)
}

func (manager MailDriverManager) ResolveSelection(request MailProviderSelectionRequest, defaultProviderKey string) MailProviderSelection {
    return manager.resolveSelection(request, defaultProviderKey)
}

func (manager MailDriverManager) describeProviderSupport(providerKey string) MailProviderSupport {
    official := GetMailProviderByProviderKey(providerKey) != nil
    activation := GetMailProviderActivationByProviderKey(providerKey)

    return CreateMailProviderSupportState(MailProviderSupportStateRequest{
        ProviderKey: providerKey,
        Builtin:     activation != nil && activation.Builtin,
        Official:    official,
        Registered:  activation != nil && activation.RuntimeBridge,
    })
}

func (manager MailDriverManager) DescribeProviderSupport(providerKey string) MailProviderSupport {
    return manager.describeProviderSupport(providerKey)
}

func (manager MailDriverManager) listProviderSupport() []MailProviderSupport {
    supports := make([]MailProviderSupport, 0, len(OFFICIAL_mail_PROVIDERS))
    for _, entry := range OFFICIAL_mail_PROVIDERS {
        supports = append(supports, manager.describeProviderSupport(entry.ProviderKey))
    }
    return supports
}

func (manager MailDriverManager) ListProviderSupport() []MailProviderSupport {
    return manager.listProviderSupport()
}
