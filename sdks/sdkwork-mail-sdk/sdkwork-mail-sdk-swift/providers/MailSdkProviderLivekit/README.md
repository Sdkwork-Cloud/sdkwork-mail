# Swift LiveKit Mail Provider Package

Reserved Swift provider package boundary for LiveKit Mail.

- provider key: `livekit`
- plugin id: `Mail-livekit`
- driver id: `sdkwork-mail-driver-livekit`
- package identity: `MailSdkProviderLivekit`
- directory path: `Providers/MailSdkProviderLivekit`
- manifest path: `Providers/MailSdkProviderLivekit/Package.swift`
- readme path: `Providers/MailSdkProviderLivekit/README.md`
- source path: `Providers/MailSdkProviderLivekit/Sources/MailSdkProviderLivekit/MailProviderLivekitPackageContract.swift`
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
