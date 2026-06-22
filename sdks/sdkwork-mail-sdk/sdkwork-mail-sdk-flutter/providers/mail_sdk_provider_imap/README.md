# Flutter IMAP Mail Sync Provider Package

Reserved Flutter provider package boundary for IMAP Mail Sync.

- provider key: `imap`
- plugin id: `Mail-imap`
- driver id: `sdkwork-mail-driver-imap`
- package identity: `mail_sdk_provider_imap`
- directory path: `providers/mail_sdk_provider_imap`
- manifest path: `providers/mail_sdk_provider_imap/pubspec.yaml`
- readme path: `providers/mail_sdk_provider_imap/README.md`
- source path: `providers/mail_sdk_provider_imap/lib/src/mail_provider_imap_package_contract.dart`
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
