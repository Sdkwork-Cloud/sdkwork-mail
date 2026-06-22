# Flutter ZEGO Mail Provider Package

Reserved Flutter provider package boundary for ZEGO Mail.

- provider key: `zego`
- plugin id: `Mail-zego`
- driver id: `sdkwork-mail-driver-zego`
- package identity: `mail_sdk_provider_zego`
- directory path: `providers/mail_sdk_provider_zego`
- manifest path: `providers/mail_sdk_provider_zego/pubspec.yaml`
- readme path: `providers/mail_sdk_provider_zego/README.md`
- source path: `providers/mail_sdk_provider_zego/lib/src/mail_provider_zego_package_contract.dart`
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
