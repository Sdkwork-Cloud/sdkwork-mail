# Python IMAP Mail Sync Provider Package

Reserved Python provider package boundary for IMAP Mail Sync.

- provider key: `imap`
- plugin id: `Mail-imap`
- driver id: `sdkwork-mail-driver-imap`
- package identity: `sdkwork-mail-sdk-provider-imap`
- directory path: `providers/sdkwork_mail_sdk_provider_imap`
- manifest path: `providers/sdkwork_mail_sdk_provider_imap/pyproject.toml`
- readme path: `providers/sdkwork_mail_sdk_provider_imap/README.md`
- source path: `providers/sdkwork_mail_sdk_provider_imap/sdkwork_mail_sdk_provider_imap/__init__.py`
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
