# Rust Jitsi Meet Provider Package

Reserved Rust provider package boundary for Jitsi Meet.

- provider key: `jitsi`
- plugin id: `Mail-jitsi`
- driver id: `sdkwork-mail-driver-jitsi`
- package identity: `Mail-sdk-provider-jitsi`
- directory path: `providers/Mail-sdk-provider-jitsi`
- manifest path: `providers/Mail-sdk-provider-jitsi/Cargo.toml`
- readme path: `providers/Mail-sdk-provider-jitsi/README.md`
- source path: `providers/Mail-sdk-provider-jitsi/src/lib.rs`
- source symbol: `MailProviderJitsiPackageContract`
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
