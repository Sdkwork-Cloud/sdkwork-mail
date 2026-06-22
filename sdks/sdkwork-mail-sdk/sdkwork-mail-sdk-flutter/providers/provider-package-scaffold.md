# Flutter Provider Package Scaffold

Reserved provider package scaffold for future Flutter Mail adapters.

- directory pattern: `providers/mail_sdk_provider_{providerKey}`
- package pattern: `mail_sdk_provider_{providerKey}`
- manifest file name: `pubspec.yaml`
- readme file name: `README.md`
- source file pattern: `lib/src/mail_provider_{providerKey}_package_contract.dart`
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
| `volcengine` | `Volcengine` | `mail_sdk_provider_volcengine` | `providers/mail_sdk_provider_volcengine` | `providers/mail_sdk_provider_volcengine/pubspec.yaml` | `providers/mail_sdk_provider_volcengine/README.md` | `providers/mail_sdk_provider_volcengine/lib/src/mail_provider_volcengine_package_contract.dart` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `mail_sdk_provider_aliyun` | `providers/mail_sdk_provider_aliyun` | `providers/mail_sdk_provider_aliyun/pubspec.yaml` | `providers/mail_sdk_provider_aliyun/README.md` | `providers/mail_sdk_provider_aliyun/lib/src/mail_provider_aliyun_package_contract.dart` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `mail_sdk_provider_tencent` | `providers/mail_sdk_provider_tencent` | `providers/mail_sdk_provider_tencent/pubspec.yaml` | `providers/mail_sdk_provider_tencent/README.md` | `providers/mail_sdk_provider_tencent/lib/src/mail_provider_tencent_package_contract.dart` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `mail_sdk_provider_agora` | `providers/mail_sdk_provider_agora` | `providers/mail_sdk_provider_agora/pubspec.yaml` | `providers/mail_sdk_provider_agora/README.md` | `providers/mail_sdk_provider_agora/lib/src/mail_provider_agora_package_contract.dart` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `mail_sdk_provider_zego` | `providers/mail_sdk_provider_zego` | `providers/mail_sdk_provider_zego/pubspec.yaml` | `providers/mail_sdk_provider_zego/README.md` | `providers/mail_sdk_provider_zego/lib/src/mail_provider_zego_package_contract.dart` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `mail_sdk_provider_livekit` | `providers/mail_sdk_provider_livekit` | `providers/mail_sdk_provider_livekit/pubspec.yaml` | `providers/mail_sdk_provider_livekit/README.md` | `providers/mail_sdk_provider_livekit/lib/src/mail_provider_livekit_package_contract.dart` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `mail_sdk_provider_twilio` | `providers/mail_sdk_provider_twilio` | `providers/mail_sdk_provider_twilio/pubspec.yaml` | `providers/mail_sdk_provider_twilio/README.md` | `providers/mail_sdk_provider_twilio/lib/src/mail_provider_twilio_package_contract.dart` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `mail_sdk_provider_jitsi` | `providers/mail_sdk_provider_jitsi` | `providers/mail_sdk_provider_jitsi/pubspec.yaml` | `providers/mail_sdk_provider_jitsi/README.md` | `providers/mail_sdk_provider_jitsi/lib/src/mail_provider_jitsi_package_contract.dart` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `mail_sdk_provider_janus` | `providers/mail_sdk_provider_janus` | `providers/mail_sdk_provider_janus/pubspec.yaml` | `providers/mail_sdk_provider_janus/README.md` | `providers/mail_sdk_provider_janus/lib/src/mail_provider_janus_package_contract.dart` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `mail_sdk_provider_mediasoup` | `providers/mail_sdk_provider_mediasoup` | `providers/mail_sdk_provider_mediasoup/pubspec.yaml` | `providers/mail_sdk_provider_mediasoup/README.md` | `providers/mail_sdk_provider_mediasoup/lib/src/mail_provider_mediasoup_package_contract.dart` | `MailProviderMediasoupPackageContract` |
