# Kotlin Provider Package Scaffold

Reserved provider package scaffold for future Kotlin Mail adapters.

- directory pattern: `providers/Mail-sdk-provider-{providerKey}`
- package pattern: `com.sdkwork:Mail-sdk-provider-{providerKey}`
- manifest file name: `build.gradle.kts`
- readme file name: `README.md`
- source file pattern: `src/main/kotlin/com/sdkwork/Mail/provider/{providerKey}/MailProvider{providerPascal}PackageContract.kt`
- source symbol pattern: `MailProvider{providerPascal}PackageContract`
- template tokens: `{providerKey}`
- source template tokens: `{providerKey}`, `{providerPascal}`
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
| `volcengine` | `Volcengine` | `com.sdkwork:Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/build.gradle.kts` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/src/main/kotlin/com/sdkwork/Mail/provider/volcengine/MailProviderVolcenginePackageContract.kt` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `com.sdkwork:Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun/build.gradle.kts` | `providers/Mail-sdk-provider-aliyun/README.md` | `providers/Mail-sdk-provider-aliyun/src/main/kotlin/com/sdkwork/Mail/provider/aliyun/MailProviderAliyunPackageContract.kt` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `com.sdkwork:Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent/build.gradle.kts` | `providers/Mail-sdk-provider-tencent/README.md` | `providers/Mail-sdk-provider-tencent/src/main/kotlin/com/sdkwork/Mail/provider/tencent/MailProviderTencentPackageContract.kt` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `com.sdkwork:Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora/build.gradle.kts` | `providers/Mail-sdk-provider-agora/README.md` | `providers/Mail-sdk-provider-agora/src/main/kotlin/com/sdkwork/Mail/provider/agora/MailProviderAgoraPackageContract.kt` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `com.sdkwork:Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego/build.gradle.kts` | `providers/Mail-sdk-provider-zego/README.md` | `providers/Mail-sdk-provider-zego/src/main/kotlin/com/sdkwork/Mail/provider/zego/MailProviderZegoPackageContract.kt` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `com.sdkwork:Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit/build.gradle.kts` | `providers/Mail-sdk-provider-livekit/README.md` | `providers/Mail-sdk-provider-livekit/src/main/kotlin/com/sdkwork/Mail/provider/livekit/MailProviderLivekitPackageContract.kt` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `com.sdkwork:Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio/build.gradle.kts` | `providers/Mail-sdk-provider-twilio/README.md` | `providers/Mail-sdk-provider-twilio/src/main/kotlin/com/sdkwork/Mail/provider/twilio/MailProviderTwilioPackageContract.kt` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `com.sdkwork:Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi/build.gradle.kts` | `providers/Mail-sdk-provider-jitsi/README.md` | `providers/Mail-sdk-provider-jitsi/src/main/kotlin/com/sdkwork/Mail/provider/jitsi/MailProviderJitsiPackageContract.kt` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `com.sdkwork:Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus/build.gradle.kts` | `providers/Mail-sdk-provider-janus/README.md` | `providers/Mail-sdk-provider-janus/src/main/kotlin/com/sdkwork/Mail/provider/janus/MailProviderJanusPackageContract.kt` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `com.sdkwork:Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup/build.gradle.kts` | `providers/Mail-sdk-provider-mediasoup/README.md` | `providers/Mail-sdk-provider-mediasoup/src/main/kotlin/com/sdkwork/Mail/provider/mediasoup/MailProviderMediasoupPackageContract.kt` | `MailProviderMediasoupPackageContract` |
