# C# Twilio Video Provider Package

Reserved C# provider package boundary for Twilio Video.

- provider key: `twilio`
- plugin id: `Mail-twilio`
- driver id: `sdkwork-mail-driver-twilio`
- package identity: `Sdkwork.Mail.Sdk.Provider.Twilio`
- directory path: `providers/Sdkwork.Mail.Sdk.Provider.Twilio`
- manifest path: `providers/Sdkwork.Mail.Sdk.Provider.Twilio/Sdkwork.Mail.Sdk.Provider.Twilio.csproj`
- readme path: `providers/Sdkwork.Mail.Sdk.Provider.Twilio/README.md`
- source path: `providers/Sdkwork.Mail.Sdk.Provider.Twilio/src/MailProviderTwilioPackageContract.cs`
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
