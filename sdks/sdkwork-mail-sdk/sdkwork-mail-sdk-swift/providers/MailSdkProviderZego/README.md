# Swift ZEGO Mail Provider Package

Reserved Swift provider package boundary for ZEGO Mail.

- provider key: `zego`
- plugin id: `Mail-zego`
- driver id: `sdkwork-mail-driver-zego`
- package identity: `MailSdkProviderZego`
- directory path: `Providers/MailSdkProviderZego`
- manifest path: `Providers/MailSdkProviderZego/Package.swift`
- readme path: `Providers/MailSdkProviderZego/README.md`
- source path: `Providers/MailSdkProviderZego/Sources/MailSdkProviderZego/MailProviderZegoPackageContract.swift`
- source symbol: `MailProviderZegoPackageContract`
- builtin provider: `false`
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
