# Python ZEGO Mail Provider Package

Reserved Python provider package boundary for ZEGO Mail.

- provider key: `zego`
- plugin id: `Mail-zego`
- driver id: `sdkwork-mail-driver-zego`
- package identity: `sdkwork-mail-sdk-provider-zego`
- directory path: `providers/sdkwork_mail_sdk_provider_zego`
- manifest path: `providers/sdkwork_mail_sdk_provider_zego/pyproject.toml`
- readme path: `providers/sdkwork_mail_sdk_provider_zego/README.md`
- source path: `providers/sdkwork_mail_sdk_provider_zego/sdkwork_mail_sdk_provider_zego/__init__.py`
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
