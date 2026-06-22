# C# Provider Package Scaffold

Reserved provider package scaffold for future C# Mail adapters.

- directory pattern: `providers/Sdkwork.Mail.Sdk.Provider.{providerPascal}`
- package pattern: `Sdkwork.Mail.Sdk.Provider.{providerPascal}`
- manifest file name: `Sdkwork.Mail.Sdk.Provider.{providerPascal}.csproj`
- readme file name: `README.md`
- source file pattern: `src/MailProvider{providerPascal}PackageContract.cs`
- source symbol pattern: `MailProvider{providerPascal}PackageContract`
- template tokens: `{providerPascal}`
- source template tokens: `{providerPascal}`
- status: `future-runtime-bridge-only`
- runtime bridge status: `reserved`
- root public exposure: `false`

Rules:

- one provider per package boundary
- bind each package to one official providerKey from the assembly-driven provider catalog
- preserve providerKey, pluginId, and driverId alignment with the official provider catalog
- wrap the official vendor SDK instead of re-implementing media runtime
- materialize one metadata-only source stub per provider package boundary before runtime bridge work lands
- keep the package outside the workspace root public API until a verified runtime bridge lands
- keep the status fixed at `future-runtime-bridge-only` until a language-specific runtime bridge is verified
- keep runtime bridge status fixed at `reserved` until the provider package becomes executable
- keep root public exposure fixed at `false` until the provider becomes a verified builtin baseline

| Provider key | Provider pascal | Package identity | Directory path | Manifest path | README path | Source path | Source symbol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `volcengine` | `Volcengine` | `Sdkwork.Mail.Sdk.Provider.Volcengine` | `providers/Sdkwork.Mail.Sdk.Provider.Volcengine` | `providers/Sdkwork.Mail.Sdk.Provider.Volcengine/Sdkwork.Mail.Sdk.Provider.Volcengine.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Volcengine/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Volcengine/src/MailProviderVolcenginePackageContract.cs` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `Sdkwork.Mail.Sdk.Provider.Aliyun` | `providers/Sdkwork.Mail.Sdk.Provider.Aliyun` | `providers/Sdkwork.Mail.Sdk.Provider.Aliyun/Sdkwork.Mail.Sdk.Provider.Aliyun.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Aliyun/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Aliyun/src/MailProviderAliyunPackageContract.cs` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `Sdkwork.Mail.Sdk.Provider.Tencent` | `providers/Sdkwork.Mail.Sdk.Provider.Tencent` | `providers/Sdkwork.Mail.Sdk.Provider.Tencent/Sdkwork.Mail.Sdk.Provider.Tencent.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Tencent/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Tencent/src/MailProviderTencentPackageContract.cs` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `Sdkwork.Mail.Sdk.Provider.Agora` | `providers/Sdkwork.Mail.Sdk.Provider.Agora` | `providers/Sdkwork.Mail.Sdk.Provider.Agora/Sdkwork.Mail.Sdk.Provider.Agora.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Agora/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Agora/src/MailProviderAgoraPackageContract.cs` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `Sdkwork.Mail.Sdk.Provider.Zego` | `providers/Sdkwork.Mail.Sdk.Provider.Zego` | `providers/Sdkwork.Mail.Sdk.Provider.Zego/Sdkwork.Mail.Sdk.Provider.Zego.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Zego/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Zego/src/MailProviderZegoPackageContract.cs` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `Sdkwork.Mail.Sdk.Provider.Livekit` | `providers/Sdkwork.Mail.Sdk.Provider.Livekit` | `providers/Sdkwork.Mail.Sdk.Provider.Livekit/Sdkwork.Mail.Sdk.Provider.Livekit.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Livekit/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Livekit/src/MailProviderLivekitPackageContract.cs` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `Sdkwork.Mail.Sdk.Provider.Twilio` | `providers/Sdkwork.Mail.Sdk.Provider.Twilio` | `providers/Sdkwork.Mail.Sdk.Provider.Twilio/Sdkwork.Mail.Sdk.Provider.Twilio.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Twilio/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Twilio/src/MailProviderTwilioPackageContract.cs` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `Sdkwork.Mail.Sdk.Provider.Jitsi` | `providers/Sdkwork.Mail.Sdk.Provider.Jitsi` | `providers/Sdkwork.Mail.Sdk.Provider.Jitsi/Sdkwork.Mail.Sdk.Provider.Jitsi.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Jitsi/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Jitsi/src/MailProviderJitsiPackageContract.cs` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `Sdkwork.Mail.Sdk.Provider.Janus` | `providers/Sdkwork.Mail.Sdk.Provider.Janus` | `providers/Sdkwork.Mail.Sdk.Provider.Janus/Sdkwork.Mail.Sdk.Provider.Janus.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Janus/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Janus/src/MailProviderJanusPackageContract.cs` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `Sdkwork.Mail.Sdk.Provider.Mediasoup` | `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup` | `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup/Sdkwork.Mail.Sdk.Provider.Mediasoup.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Mediasoup/src/MailProviderMediasoupPackageContract.cs` | `MailProviderMediasoupPackageContract` |
