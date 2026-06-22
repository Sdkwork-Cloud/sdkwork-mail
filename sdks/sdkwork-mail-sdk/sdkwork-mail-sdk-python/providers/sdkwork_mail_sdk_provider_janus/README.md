# Python Janus Mail Provider Package

Reserved Python provider package boundary for Janus Mail.

- provider key: `janus`
- plugin id: `Mail-janus`
- driver id: `sdkwork-mail-driver-janus`
- package identity: `sdkwork-mail-sdk-provider-janus`
- directory path: `providers/sdkwork_mail_sdk_provider_janus`
- manifest path: `providers/sdkwork_mail_sdk_provider_janus/pyproject.toml`
- readme path: `providers/sdkwork_mail_sdk_provider_janus/README.md`
- source path: `providers/sdkwork_mail_sdk_provider_janus/sdkwork_mail_sdk_provider_janus/__init__.py`
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
