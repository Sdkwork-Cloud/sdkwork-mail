# Go IMAP Mail Sync Provider Package

Reserved Go provider package boundary for IMAP Mail Sync.

- provider key: `imap`
- plugin id: `Mail-imap`
- driver id: `sdkwork-mail-driver-imap`
- package identity: `github.com/sdkwork/Mail-sdk-provider-imap`
- directory path: `providers/Mail-sdk-provider-imap`
- manifest path: `providers/Mail-sdk-provider-imap/go.mod`
- readme path: `providers/Mail-sdk-provider-imap/README.md`
- source path: `providers/Mail-sdk-provider-imap/provider_package_contract.go`
- source symbol: `MailProviderImapPackageContract`
- builtin provider: `true`
- status: `future-runtime-bridge-only`
- runtime bridge status: `reserved`
- root public exposure: `false`

Rules:

- one provider per package boundary
- preserve providerKey, pluginId, and driverId alignment with the official provider catalog
- wrap the official vendor SDK instead of re-implementing media runtime
- keep the source scaffold metadata-only until a verified runtime bridge lands
- do not expose this package through the root public API in the current landing
- no runtime bridge ships in the current reserved package boundary
