# Python Aliyun Mail Provider Package

Reserved Python provider package boundary for Aliyun Mail.

- provider key: `aliyun`
- plugin id: `Mail-aliyun`
- driver id: `sdkwork-mail-driver-aliyun`
- package identity: `sdkwork-mail-sdk-provider-aliyun`
- directory path: `providers/sdkwork_mail_sdk_provider_aliyun`
- manifest path: `providers/sdkwork_mail_sdk_provider_aliyun/pyproject.toml`
- readme path: `providers/sdkwork_mail_sdk_provider_aliyun/README.md`
- source path: `providers/sdkwork_mail_sdk_provider_aliyun/sdkwork_mail_sdk_provider_aliyun/__init__.py`
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
