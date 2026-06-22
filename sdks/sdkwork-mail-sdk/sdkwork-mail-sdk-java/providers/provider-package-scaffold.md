# Java Provider Package Scaffold

Reserved provider package scaffold for future Java Mail adapters.

- directory pattern: `providers/Mail-sdk-provider-{providerKey}`
- package pattern: `com.sdkwork:Mail-sdk-provider-{providerKey}`
- manifest file name: `pom.xml`
- readme file name: `README.md`
- source file pattern: `src/main/java/com/sdkwork/Mail/provider/{providerKey}/MailProvider{providerPascal}PackageContract.java`
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
| `volcengine` | `Volcengine` | `com.sdkwork:Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/pom.xml` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/src/main/java/com/sdkwork/Mail/provider/volcengine/MailProviderVolcenginePackageContract.java` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `com.sdkwork:Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun/pom.xml` | `providers/Mail-sdk-provider-aliyun/README.md` | `providers/Mail-sdk-provider-aliyun/src/main/java/com/sdkwork/Mail/provider/aliyun/MailProviderAliyunPackageContract.java` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `com.sdkwork:Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent/pom.xml` | `providers/Mail-sdk-provider-tencent/README.md` | `providers/Mail-sdk-provider-tencent/src/main/java/com/sdkwork/Mail/provider/tencent/MailProviderTencentPackageContract.java` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `com.sdkwork:Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora/pom.xml` | `providers/Mail-sdk-provider-agora/README.md` | `providers/Mail-sdk-provider-agora/src/main/java/com/sdkwork/Mail/provider/agora/MailProviderAgoraPackageContract.java` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `com.sdkwork:Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego/pom.xml` | `providers/Mail-sdk-provider-zego/README.md` | `providers/Mail-sdk-provider-zego/src/main/java/com/sdkwork/Mail/provider/zego/MailProviderZegoPackageContract.java` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `com.sdkwork:Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit/pom.xml` | `providers/Mail-sdk-provider-livekit/README.md` | `providers/Mail-sdk-provider-livekit/src/main/java/com/sdkwork/Mail/provider/livekit/MailProviderLivekitPackageContract.java` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `com.sdkwork:Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio/pom.xml` | `providers/Mail-sdk-provider-twilio/README.md` | `providers/Mail-sdk-provider-twilio/src/main/java/com/sdkwork/Mail/provider/twilio/MailProviderTwilioPackageContract.java` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `com.sdkwork:Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi/pom.xml` | `providers/Mail-sdk-provider-jitsi/README.md` | `providers/Mail-sdk-provider-jitsi/src/main/java/com/sdkwork/Mail/provider/jitsi/MailProviderJitsiPackageContract.java` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `com.sdkwork:Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus/pom.xml` | `providers/Mail-sdk-provider-janus/README.md` | `providers/Mail-sdk-provider-janus/src/main/java/com/sdkwork/Mail/provider/janus/MailProviderJanusPackageContract.java` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `com.sdkwork:Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup/pom.xml` | `providers/Mail-sdk-provider-mediasoup/README.md` | `providers/Mail-sdk-provider-mediasoup/src/main/java/com/sdkwork/Mail/provider/mediasoup/MailProviderMediasoupPackageContract.java` | `MailProviderMediasoupPackageContract` |
