# Swift IMAP Mail Sync Provider Package

Reserved Swift provider package boundary for IMAP Mail Sync.

- provider key: `imap`
- plugin id: `Mail-imap`
- driver id: `sdkwork-mail-driver-imap`
- package identity: `MailSdkProviderImap`
- directory path: `Providers/MailSdkProviderImap`
- manifest path: `Providers/MailSdkProviderImap/Package.swift`
- readme path: `Providers/MailSdkProviderImap/README.md`
- source path: `Providers/MailSdkProviderImap/Sources/MailSdkProviderImap/MailProviderImapPackageContract.swift`
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
