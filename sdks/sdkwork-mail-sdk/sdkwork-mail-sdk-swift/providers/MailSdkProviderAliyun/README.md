# Swift Aliyun Mail Provider Package

Reserved Swift provider package boundary for Aliyun Mail.

- provider key: `aliyun`
- plugin id: `Mail-aliyun`
- driver id: `sdkwork-mail-driver-aliyun`
- package identity: `MailSdkProviderAliyun`
- directory path: `Providers/MailSdkProviderAliyun`
- manifest path: `Providers/MailSdkProviderAliyun/Package.swift`
- readme path: `Providers/MailSdkProviderAliyun/README.md`
- source path: `Providers/MailSdkProviderAliyun/Sources/MailSdkProviderAliyun/MailProviderAliyunPackageContract.swift`
- source symbol: `MailProviderAliyunPackageContract`
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
