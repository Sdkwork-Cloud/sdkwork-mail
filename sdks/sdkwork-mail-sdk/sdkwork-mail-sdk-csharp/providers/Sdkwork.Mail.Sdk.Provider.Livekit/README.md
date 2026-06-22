# C# LiveKit Mail Provider Package

Reserved C# provider package boundary for LiveKit Mail.

- provider key: `livekit`
- plugin id: `Mail-livekit`
- driver id: `sdkwork-mail-driver-livekit`
- package identity: `Sdkwork.Mail.Sdk.Provider.Livekit`
- directory path: `providers/Sdkwork.Mail.Sdk.Provider.Livekit`
- manifest path: `providers/Sdkwork.Mail.Sdk.Provider.Livekit/Sdkwork.Mail.Sdk.Provider.Livekit.csproj`
- readme path: `providers/Sdkwork.Mail.Sdk.Provider.Livekit/README.md`
- source path: `providers/Sdkwork.Mail.Sdk.Provider.Livekit/src/MailProviderLivekitPackageContract.cs`
- source symbol: `MailProviderLivekitPackageContract`
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
