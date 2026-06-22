# Rust Volcengine Mail Provider Package

Reserved Rust provider package boundary for Volcengine Mail.

- provider key: `volcengine`
- plugin id: `Mail-volcengine`
- driver id: `sdkwork-mail-driver-volcengine`
- package identity: `Mail-sdk-provider-volcengine`
- directory path: `providers/Mail-sdk-provider-volcengine`
- manifest path: `providers/Mail-sdk-provider-volcengine/Cargo.toml`
- readme path: `providers/Mail-sdk-provider-volcengine/README.md`
- source path: `providers/Mail-sdk-provider-volcengine/src/lib.rs`
- source symbol: `MailProviderVolcenginePackageContract`
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
