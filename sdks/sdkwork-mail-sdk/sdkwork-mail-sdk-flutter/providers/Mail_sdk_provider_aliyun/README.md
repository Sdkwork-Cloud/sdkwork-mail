# Flutter Aliyun Mail Provider Package

Reserved Flutter provider package boundary for Aliyun Mail.

- provider key: `aliyun`
- plugin id: `Mail-aliyun`
- driver id: `sdkwork-mail-driver-aliyun`
- package identity: `mail_sdk_provider_aliyun`
- directory path: `providers/mail_sdk_provider_aliyun`
- manifest path: `providers/mail_sdk_provider_aliyun/pubspec.yaml`
- readme path: `providers/mail_sdk_provider_aliyun/README.md`
- source path: `providers/mail_sdk_provider_aliyun/lib/src/mail_provider_aliyun_package_contract.dart`
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
