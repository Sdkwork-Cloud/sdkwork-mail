package Mailstandard

type MailProviderActivationCatalogEntry struct {
    ProviderKey      string
    PluginId         string
    DriverId         string
    ActivationStatus string
    RuntimeBridge    bool
    RootPublic       bool
    PackageBoundary  bool
    Builtin          bool
    PackageIdentity  string
}

type MailProviderActivationCatalog struct{}

var mail_PROVIDER_ACTIVATION_STATUSES = []string{"package-boundary", "control-metadata-only"}

var OFFICIAL_mail_PROVIDER_ACTIVATIONS = []MailProviderActivationCatalogEntry{
    {ProviderKey: "smtp", PluginId: "Mail-smtp", DriverId: "sdkwork-mail-driver-smtp", ActivationStatus: "package-boundary", RuntimeBridge: true, RootPublic: false, PackageBoundary: true, Builtin: true, PackageIdentity: "github.com/sdkwork/Mail-sdk-provider-smtp"},
    {ProviderKey: "imap", PluginId: "Mail-imap", DriverId: "sdkwork-mail-driver-imap", ActivationStatus: "package-boundary", RuntimeBridge: true, RootPublic: false, PackageBoundary: true, Builtin: true, PackageIdentity: "github.com/sdkwork/Mail-sdk-provider-imap"},
}

func GetMailProviderActivationByProviderKey(providerKey string) *MailProviderActivationCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDER_ACTIVATIONS {
        if OFFICIAL_mail_PROVIDER_ACTIVATIONS[index].ProviderKey == providerKey {
            return &OFFICIAL_mail_PROVIDER_ACTIVATIONS[index]
        }
    }

    return nil
}
