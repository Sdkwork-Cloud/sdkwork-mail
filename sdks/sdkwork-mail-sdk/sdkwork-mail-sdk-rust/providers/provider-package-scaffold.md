# Rust Provider Package Scaffold

Reserved provider package scaffold for future Rust Mail adapters.

- directory pattern: `providers/Mail-sdk-provider-{providerKey}`
- package pattern: `Mail-sdk-provider-{providerKey}`
- manifest file name: `Cargo.toml`
- readme file name: `README.md`
- source file pattern: `src/lib.rs`
- source symbol pattern: `MailProvider{providerPascal}PackageContract`
- template tokens: `{providerKey}`
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
| `volcengine` | `Volcengine` | `Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/Cargo.toml` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/src/lib.rs` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun/Cargo.toml` | `providers/Mail-sdk-provider-aliyun/README.md` | `providers/Mail-sdk-provider-aliyun/src/lib.rs` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent/Cargo.toml` | `providers/Mail-sdk-provider-tencent/README.md` | `providers/Mail-sdk-provider-tencent/src/lib.rs` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora/Cargo.toml` | `providers/Mail-sdk-provider-agora/README.md` | `providers/Mail-sdk-provider-agora/src/lib.rs` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego/Cargo.toml` | `providers/Mail-sdk-provider-zego/README.md` | `providers/Mail-sdk-provider-zego/src/lib.rs` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit/Cargo.toml` | `providers/Mail-sdk-provider-livekit/README.md` | `providers/Mail-sdk-provider-livekit/src/lib.rs` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio/Cargo.toml` | `providers/Mail-sdk-provider-twilio/README.md` | `providers/Mail-sdk-provider-twilio/src/lib.rs` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi/Cargo.toml` | `providers/Mail-sdk-provider-jitsi/README.md` | `providers/Mail-sdk-provider-jitsi/src/lib.rs` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus/Cargo.toml` | `providers/Mail-sdk-provider-janus/README.md` | `providers/Mail-sdk-provider-janus/src/lib.rs` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup/Cargo.toml` | `providers/Mail-sdk-provider-mediasoup/README.md` | `providers/Mail-sdk-provider-mediasoup/src/lib.rs` | `MailProviderMediasoupPackageContract` |
