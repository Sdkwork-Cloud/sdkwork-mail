# Rust LiveKit Mail Provider Package

Reserved Rust provider package boundary for LiveKit Mail.

- provider key: `livekit`
- plugin id: `Mail-livekit`
- driver id: `sdkwork-mail-driver-livekit`
- package identity: `Mail-sdk-provider-livekit`
- directory path: `providers/Mail-sdk-provider-livekit`
- manifest path: `providers/Mail-sdk-provider-livekit/Cargo.toml`
- readme path: `providers/Mail-sdk-provider-livekit/README.md`
- source path: `providers/Mail-sdk-provider-livekit/src/lib.rs`
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
