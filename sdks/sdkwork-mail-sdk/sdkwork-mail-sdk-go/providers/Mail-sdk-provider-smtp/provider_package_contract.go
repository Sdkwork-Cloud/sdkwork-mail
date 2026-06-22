package Mailprovider

// Metadata-only provider package scaffold. No runtime bridge is implemented here yet.
type MailProviderSmtpPackageContract struct{}

const (
	MailProviderSmtpPackageContractProviderKey = "smtp"
	MailProviderSmtpPackageContractPluginID = "Mail-smtp"
	MailProviderSmtpPackageContractDriverID = "sdkwork-mail-driver-smtp"
	MailProviderSmtpPackageContractPackageIdentity = "github.com/sdkwork/Mail-sdk-provider-smtp"
	MailProviderSmtpPackageContractStatus = "future-runtime-bridge-only"
	MailProviderSmtpPackageContractRuntimeBridgeStatus = "reserved"
)

const MailProviderSmtpPackageContractRootPublic = false
