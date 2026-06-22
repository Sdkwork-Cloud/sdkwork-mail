# Rust Aliyun Mail Provider Package

Reserved Rust provider package boundary for Aliyun Mail.

- provider key: `aliyun`
- plugin id: `Mail-aliyun`
- driver id: `sdkwork-mail-driver-aliyun`
- package identity: `Mail-sdk-provider-aliyun`
- directory path: `providers/Mail-sdk-provider-aliyun`
- manifest path: `providers/Mail-sdk-provider-aliyun/Cargo.toml`
- readme path: `providers/Mail-sdk-provider-aliyun/README.md`
- source path: `providers/Mail-sdk-provider-aliyun/src/lib.rs`
- source symbol: `MailProviderAliyunPackageContract`
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
