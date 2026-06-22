# Python Jitsi Meet Provider Package

Reserved Python provider package boundary for Jitsi Meet.

- provider key: `jitsi`
- plugin id: `Mail-jitsi`
- driver id: `sdkwork-mail-driver-jitsi`
- package identity: `sdkwork-mail-sdk-provider-jitsi`
- directory path: `providers/sdkwork_mail_sdk_provider_jitsi`
- manifest path: `providers/sdkwork_mail_sdk_provider_jitsi/pyproject.toml`
- readme path: `providers/sdkwork_mail_sdk_provider_jitsi/README.md`
- source path: `providers/sdkwork_mail_sdk_provider_jitsi/sdkwork_mail_sdk_provider_jitsi/__init__.py`
- source symbol: `MailProviderJitsiPackageContract`
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
