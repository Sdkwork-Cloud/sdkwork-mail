# Swift SMTP Mail Transport Provider Package

Reserved Swift provider package boundary for SMTP Mail Transport.

- provider key: `smtp`
- plugin id: `Mail-smtp`
- driver id: `sdkwork-mail-driver-smtp`
- package identity: `MailSdkProviderSmtp`
- directory path: `Providers/MailSdkProviderSmtp`
- manifest path: `Providers/MailSdkProviderSmtp/Package.swift`
- readme path: `Providers/MailSdkProviderSmtp/README.md`
- source path: `Providers/MailSdkProviderSmtp/Sources/MailSdkProviderSmtp/MailProviderSmtpPackageContract.swift`
- source symbol: `MailProviderSmtpPackageContract`
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
