# C# ZEGO Mail Provider Package

Reserved C# provider package boundary for ZEGO Mail.

- provider key: `zego`
- plugin id: `Mail-zego`
- driver id: `sdkwork-mail-driver-zego`
- package identity: `Sdkwork.Mail.Sdk.Provider.Zego`
- directory path: `providers/Sdkwork.Mail.Sdk.Provider.Zego`
- manifest path: `providers/Sdkwork.Mail.Sdk.Provider.Zego/Sdkwork.Mail.Sdk.Provider.Zego.csproj`
- readme path: `providers/Sdkwork.Mail.Sdk.Provider.Zego/README.md`
- source path: `providers/Sdkwork.Mail.Sdk.Provider.Zego/src/MailProviderZegoPackageContract.cs`
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
