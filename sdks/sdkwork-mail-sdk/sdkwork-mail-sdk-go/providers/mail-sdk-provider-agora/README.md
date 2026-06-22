# Go Agora Mail Provider Package

Reserved Go provider package boundary for Agora Mail.

- provider key: `agora`
- plugin id: `Mail-agora`
- driver id: `sdkwork-mail-driver-agora`
- package identity: `github.com/sdkwork/Mail-sdk-provider-agora`
- directory path: `providers/Mail-sdk-provider-agora`
- manifest path: `providers/Mail-sdk-provider-agora/go.mod`
- readme path: `providers/Mail-sdk-provider-agora/README.md`
- source path: `providers/Mail-sdk-provider-agora/provider_package_contract.go`
- source symbol: `MailProviderAgoraPackageContract`
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
