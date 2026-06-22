# C# Agora Mail Provider Package

Reserved C# provider package boundary for Agora Mail.

- provider key: `agora`
- plugin id: `Mail-agora`
- driver id: `sdkwork-mail-driver-agora`
- package identity: `Sdkwork.Mail.Sdk.Provider.Agora`
- directory path: `providers/Sdkwork.Mail.Sdk.Provider.Agora`
- manifest path: `providers/Sdkwork.Mail.Sdk.Provider.Agora/Sdkwork.Mail.Sdk.Provider.Agora.csproj`
- readme path: `providers/Sdkwork.Mail.Sdk.Provider.Agora/README.md`
- source path: `providers/Sdkwork.Mail.Sdk.Provider.Agora/src/MailProviderAgoraPackageContract.cs`
- source symbol: `MailProviderAgoraPackageContract`
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
