# Swift Volcengine Mail Provider Package

Reserved Swift provider package boundary for Volcengine Mail.

- provider key: `volcengine`
- plugin id: `Mail-volcengine`
- driver id: `sdkwork-mail-driver-volcengine`
- package identity: `MailSdkProviderVolcengine`
- directory path: `Providers/MailSdkProviderVolcengine`
- manifest path: `Providers/MailSdkProviderVolcengine/Package.swift`
- readme path: `Providers/MailSdkProviderVolcengine/README.md`
- source path: `Providers/MailSdkProviderVolcengine/Sources/MailSdkProviderVolcengine/MailProviderVolcenginePackageContract.swift`
- source symbol: `MailProviderVolcenginePackageContract`
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
