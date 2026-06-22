# Python SMTP Mail Transport Provider Package

Reserved Python provider package boundary for SMTP Mail Transport.

- provider key: `smtp`
- plugin id: `Mail-smtp`
- driver id: `sdkwork-mail-driver-smtp`
- package identity: `sdkwork-mail-sdk-provider-smtp`
- directory path: `providers/sdkwork_mail_sdk_provider_smtp`
- manifest path: `providers/sdkwork_mail_sdk_provider_smtp/pyproject.toml`
- readme path: `providers/sdkwork_mail_sdk_provider_smtp/README.md`
- source path: `providers/sdkwork_mail_sdk_provider_smtp/sdkwork_mail_sdk_provider_smtp/__init__.py`
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
