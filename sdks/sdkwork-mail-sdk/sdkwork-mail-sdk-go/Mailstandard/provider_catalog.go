package Mailstandard

type MailProviderCatalogEntry struct {
    ProviderKey     string
    PluginId        string
    DriverId        string
    DefaultSelected bool
}

type MailProviderCatalog struct{}

const DEFAULT_mail_PROVIDER_KEY = "smtp"

var OFFICIAL_mail_PROVIDERS = []MailProviderCatalogEntry{
    {ProviderKey: "smtp", PluginId: "Mail-smtp", DriverId: "sdkwork-mail-driver-smtp", DefaultSelected: true},
    {ProviderKey: "imap", PluginId: "Mail-imap", DriverId: "sdkwork-mail-driver-imap", DefaultSelected: false},
}

func GetMailProviderByProviderKey(providerKey string) *MailProviderCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDERS {
        if OFFICIAL_mail_PROVIDERS[index].ProviderKey == providerKey {
            return &OFFICIAL_mail_PROVIDERS[index]
        }
    }

    return nil
}
