# Go Provider Package Scaffold

Reserved provider package scaffold for future Go Mail adapters.

- directory pattern: `providers/Mail-sdk-provider-{providerKey}`
- package pattern: `github.com/sdkwork/Mail-sdk-provider-{providerKey}`
- manifest file name: `go.mod`
- readme file name: `README.md`
- source file pattern: `provider_package_contract.go`
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
| `volcengine` | `Volcengine` | `github.com/sdkwork/Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/go.mod` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/provider_package_contract.go` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `github.com/sdkwork/Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun` | `providers/Mail-sdk-provider-aliyun/go.mod` | `providers/Mail-sdk-provider-aliyun/README.md` | `providers/Mail-sdk-provider-aliyun/provider_package_contract.go` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `github.com/sdkwork/Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent` | `providers/Mail-sdk-provider-tencent/go.mod` | `providers/Mail-sdk-provider-tencent/README.md` | `providers/Mail-sdk-provider-tencent/provider_package_contract.go` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `github.com/sdkwork/Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora` | `providers/Mail-sdk-provider-agora/go.mod` | `providers/Mail-sdk-provider-agora/README.md` | `providers/Mail-sdk-provider-agora/provider_package_contract.go` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `github.com/sdkwork/Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego` | `providers/Mail-sdk-provider-zego/go.mod` | `providers/Mail-sdk-provider-zego/README.md` | `providers/Mail-sdk-provider-zego/provider_package_contract.go` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `github.com/sdkwork/Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit` | `providers/Mail-sdk-provider-livekit/go.mod` | `providers/Mail-sdk-provider-livekit/README.md` | `providers/Mail-sdk-provider-livekit/provider_package_contract.go` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `github.com/sdkwork/Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio` | `providers/Mail-sdk-provider-twilio/go.mod` | `providers/Mail-sdk-provider-twilio/README.md` | `providers/Mail-sdk-provider-twilio/provider_package_contract.go` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `github.com/sdkwork/Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi` | `providers/Mail-sdk-provider-jitsi/go.mod` | `providers/Mail-sdk-provider-jitsi/README.md` | `providers/Mail-sdk-provider-jitsi/provider_package_contract.go` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `github.com/sdkwork/Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus` | `providers/Mail-sdk-provider-janus/go.mod` | `providers/Mail-sdk-provider-janus/README.md` | `providers/Mail-sdk-provider-janus/provider_package_contract.go` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `github.com/sdkwork/Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup` | `providers/Mail-sdk-provider-mediasoup/go.mod` | `providers/Mail-sdk-provider-mediasoup/README.md` | `providers/Mail-sdk-provider-mediasoup/provider_package_contract.go` | `MailProviderMediasoupPackageContract` |
