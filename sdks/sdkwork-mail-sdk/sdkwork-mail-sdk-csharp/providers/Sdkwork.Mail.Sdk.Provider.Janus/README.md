# C# Janus Mail Provider Package

Reserved C# provider package boundary for Janus Mail.

- provider key: `janus`
- plugin id: `Mail-janus`
- driver id: `sdkwork-mail-driver-janus`
- package identity: `Sdkwork.Mail.Sdk.Provider.Janus`
- directory path: `providers/Sdkwork.Mail.Sdk.Provider.Janus`
- manifest path: `providers/Sdkwork.Mail.Sdk.Provider.Janus/Sdkwork.Mail.Sdk.Provider.Janus.csproj`
- readme path: `providers/Sdkwork.Mail.Sdk.Provider.Janus/README.md`
- source path: `providers/Sdkwork.Mail.Sdk.Provider.Janus/src/MailProviderJanusPackageContract.cs`
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
