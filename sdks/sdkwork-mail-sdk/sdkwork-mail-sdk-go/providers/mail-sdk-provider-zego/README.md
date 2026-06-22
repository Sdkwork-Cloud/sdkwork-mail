# Go ZEGO Mail Provider Package

Reserved Go provider package boundary for ZEGO Mail.

- provider key: `zego`
- plugin id: `Mail-zego`
- driver id: `sdkwork-mail-driver-zego`
- package identity: `github.com/sdkwork/Mail-sdk-provider-zego`
- directory path: `providers/Mail-sdk-provider-zego`
- manifest path: `providers/Mail-sdk-provider-zego/go.mod`
- readme path: `providers/Mail-sdk-provider-zego/README.md`
- source path: `providers/Mail-sdk-provider-zego/provider_package_contract.go`
- source symbol: `MailProviderZegoPackageContract`
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
