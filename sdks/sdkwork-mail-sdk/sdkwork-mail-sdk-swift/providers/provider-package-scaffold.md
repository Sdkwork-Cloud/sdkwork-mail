# Swift Provider Package Scaffold

Reserved provider package scaffold for future Swift Mail adapters.

- directory pattern: `Providers/MailSdkProvider{providerPascal}`
- package pattern: `MailSdkProvider{providerPascal}`
- manifest file name: `Package.swift`
- readme file name: `README.md`
- source file pattern: `Sources/MailSdkProvider{providerPascal}/MailProvider{providerPascal}PackageContract.swift`
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
| `volcengine` | `Volcengine` | `MailSdkProviderVolcengine` | `Providers/MailSdkProviderVolcengine` | `Providers/MailSdkProviderVolcengine/Package.swift` | `Providers/MailSdkProviderVolcengine/README.md` | `Providers/MailSdkProviderVolcengine/Sources/MailSdkProviderVolcengine/MailProviderVolcenginePackageContract.swift` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `MailSdkProviderAliyun` | `Providers/MailSdkProviderAliyun` | `Providers/MailSdkProviderAliyun/Package.swift` | `Providers/MailSdkProviderAliyun/README.md` | `Providers/MailSdkProviderAliyun/Sources/MailSdkProviderAliyun/MailProviderAliyunPackageContract.swift` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `MailSdkProviderTencent` | `Providers/MailSdkProviderTencent` | `Providers/MailSdkProviderTencent/Package.swift` | `Providers/MailSdkProviderTencent/README.md` | `Providers/MailSdkProviderTencent/Sources/MailSdkProviderTencent/MailProviderTencentPackageContract.swift` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `MailSdkProviderAgora` | `Providers/MailSdkProviderAgora` | `Providers/MailSdkProviderAgora/Package.swift` | `Providers/MailSdkProviderAgora/README.md` | `Providers/MailSdkProviderAgora/Sources/MailSdkProviderAgora/MailProviderAgoraPackageContract.swift` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `MailSdkProviderZego` | `Providers/MailSdkProviderZego` | `Providers/MailSdkProviderZego/Package.swift` | `Providers/MailSdkProviderZego/README.md` | `Providers/MailSdkProviderZego/Sources/MailSdkProviderZego/MailProviderZegoPackageContract.swift` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `MailSdkProviderLivekit` | `Providers/MailSdkProviderLivekit` | `Providers/MailSdkProviderLivekit/Package.swift` | `Providers/MailSdkProviderLivekit/README.md` | `Providers/MailSdkProviderLivekit/Sources/MailSdkProviderLivekit/MailProviderLivekitPackageContract.swift` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `MailSdkProviderTwilio` | `Providers/MailSdkProviderTwilio` | `Providers/MailSdkProviderTwilio/Package.swift` | `Providers/MailSdkProviderTwilio/README.md` | `Providers/MailSdkProviderTwilio/Sources/MailSdkProviderTwilio/MailProviderTwilioPackageContract.swift` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `MailSdkProviderJitsi` | `Providers/MailSdkProviderJitsi` | `Providers/MailSdkProviderJitsi/Package.swift` | `Providers/MailSdkProviderJitsi/README.md` | `Providers/MailSdkProviderJitsi/Sources/MailSdkProviderJitsi/MailProviderJitsiPackageContract.swift` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `MailSdkProviderJanus` | `Providers/MailSdkProviderJanus` | `Providers/MailSdkProviderJanus/Package.swift` | `Providers/MailSdkProviderJanus/README.md` | `Providers/MailSdkProviderJanus/Sources/MailSdkProviderJanus/MailProviderJanusPackageContract.swift` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `MailSdkProviderMediasoup` | `Providers/MailSdkProviderMediasoup` | `Providers/MailSdkProviderMediasoup/Package.swift` | `Providers/MailSdkProviderMediasoup/README.md` | `Providers/MailSdkProviderMediasoup/Sources/MailSdkProviderMediasoup/MailProviderMediasoupPackageContract.swift` | `MailProviderMediasoupPackageContract` |
