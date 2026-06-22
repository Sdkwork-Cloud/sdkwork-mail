# C# mediasoup Mail Provider Package

Reserved C# provider package boundary for mediasoup Mail.

- provider key: `mediasoup`
- plugin id: `Mail-mediasoup`
- driver id: `sdkwork-mail-driver-mediasoup`
- package identity: `Sdkwork.Mail.Sdk.Provider.Mediasoup`
- directory path: `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup`
- manifest path: `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup/Sdkwork.Mail.Sdk.Provider.Mediasoup.csproj`
- readme path: `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup/README.md`
- source path: `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup/src/MailProviderMediasoupPackageContract.cs`
- source symbol: `MailProviderMediasoupPackageContract`
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
