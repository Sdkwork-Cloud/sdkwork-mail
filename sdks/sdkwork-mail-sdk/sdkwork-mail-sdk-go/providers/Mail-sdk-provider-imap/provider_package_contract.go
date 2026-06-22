package Mailprovider

// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
type MailProviderImapPackageContract struct{}

const (
	MailProviderImapPackageContractProviderKey = "imap"
	MailProviderImapPackageContractPluginID = "Mail-imap"
	MailProviderImapPackageContractDriverID = "sdkwork-mail-driver-imap"
	MailProviderImapPackageContractPackageIdentity = "github.com/sdkwork/Mail-sdk-provider-imap"
	MailProviderImapPackageContractStatus = "future-runtime-bridge-only"
	MailProviderImapPackageContractRuntimeBridgeStatus = "reserved"
)

const MailProviderImapPackageContractRootPublic = false
