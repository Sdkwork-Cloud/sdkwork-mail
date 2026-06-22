# Python Twilio Video Provider Package

Reserved Python provider package boundary for Twilio Video.

- provider key: `twilio`
- plugin id: `Mail-twilio`
- driver id: `sdkwork-mail-driver-twilio`
- package identity: `sdkwork-mail-sdk-provider-twilio`
- directory path: `providers/sdkwork_mail_sdk_provider_twilio`
- manifest path: `providers/sdkwork_mail_sdk_provider_twilio/pyproject.toml`
- readme path: `providers/sdkwork_mail_sdk_provider_twilio/README.md`
- source path: `providers/sdkwork_mail_sdk_provider_twilio/sdkwork_mail_sdk_provider_twilio/__init__.py`
- source symbol: `MailProviderTwilioPackageContract`
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
