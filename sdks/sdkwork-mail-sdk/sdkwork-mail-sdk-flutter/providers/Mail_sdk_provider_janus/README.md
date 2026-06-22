# Flutter Janus Mail Provider Package

Reserved Flutter provider package boundary for Janus Mail.

- provider key: `janus`
- plugin id: `Mail-janus`
- driver id: `sdkwork-mail-driver-janus`
- package identity: `mail_sdk_provider_janus`
- directory path: `providers/mail_sdk_provider_janus`
- manifest path: `providers/mail_sdk_provider_janus/pubspec.yaml`
- readme path: `providers/mail_sdk_provider_janus/README.md`
- source path: `providers/mail_sdk_provider_janus/lib/src/mail_provider_janus_package_contract.dart`
- source symbol: `MailProviderJanusPackageContract`
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
