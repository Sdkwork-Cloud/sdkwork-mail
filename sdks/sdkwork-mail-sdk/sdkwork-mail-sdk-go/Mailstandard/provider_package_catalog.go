package Mailstandard

type MailProviderPackageCatalogEntry struct {
    ProviderKey         string
    PluginId            string
    DriverId            string
    PackageIdentity     string
    ManifestPath        string
    ReadmePath          string
    SourcePath          string
    SourceSymbol        string
    Builtin             bool
    RootPublic          bool
    Status              string
    RuntimeBridgeStatus string
}

type MailProviderPackageCatalog struct{}

var OFFICIAL_mail_PROVIDER_PACKAGES = []MailProviderPackageCatalogEntry{
    {ProviderKey: "smtp", PluginId: "Mail-smtp", DriverId: "sdkwork-mail-driver-smtp", PackageIdentity: "github.com/sdkwork/Mail-sdk-provider-smtp", ManifestPath: "providers/Mail-sdk-provider-smtp/go.mod", ReadmePath: "providers/Mail-sdk-provider-smtp/README.md", SourcePath: "providers/Mail-sdk-provider-smtp/provider_package_contract.go", SourceSymbol: "MailProviderSmtpPackageContract", Builtin: true, RootPublic: false, Status: "future-runtime-bridge-only", RuntimeBridgeStatus: "reserved"},
    {ProviderKey: "imap", PluginId: "Mail-imap", DriverId: "sdkwork-mail-driver-imap", PackageIdentity: "github.com/sdkwork/Mail-sdk-provider-imap", ManifestPath: "providers/Mail-sdk-provider-imap/go.mod", ReadmePath: "providers/Mail-sdk-provider-imap/README.md", SourcePath: "providers/Mail-sdk-provider-imap/provider_package_contract.go", SourceSymbol: "MailProviderImapPackageContract", Builtin: true, RootPublic: false, Status: "future-runtime-bridge-only", RuntimeBridgeStatus: "reserved"},
}

func GetMailProviderPackageByProviderKey(providerKey string) *MailProviderPackageCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDER_PACKAGES {
        if OFFICIAL_mail_PROVIDER_PACKAGES[index].ProviderKey == providerKey {
            return &OFFICIAL_mail_PROVIDER_PACKAGES[index]
        }
    }

    return nil
}

func GetMailProviderPackageByPackageIdentity(packageIdentity string) *MailProviderPackageCatalogEntry {
    for index := range OFFICIAL_mail_PROVIDER_PACKAGES {
        if OFFICIAL_mail_PROVIDER_PACKAGES[index].PackageIdentity == packageIdentity {
            return &OFFICIAL_mail_PROVIDER_PACKAGES[index]
        }
    }

    return nil
}
