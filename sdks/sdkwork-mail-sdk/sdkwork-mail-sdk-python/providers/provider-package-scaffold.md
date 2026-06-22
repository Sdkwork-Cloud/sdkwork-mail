# Python Provider Package Scaffold

Reserved provider package scaffold for future Python Mail adapters.

- directory pattern: `providers/sdkwork_mail_sdk_provider_{providerKey}`
- package pattern: `sdkwork-mail-sdk-provider-{providerKey}`
- manifest file name: `pyproject.toml`
- readme file name: `README.md`
- source file pattern: `sdkwork_mail_sdk_provider_{providerKey}/__init__.py`
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
| `volcengine` | `Volcengine` | `sdkwork-mail-sdk-provider-volcengine` | `providers/sdkwork_mail_sdk_provider_volcengine` | `providers/sdkwork_mail_sdk_provider_volcengine/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_volcengine/README.md` | `providers/sdkwork_mail_sdk_provider_volcengine/sdkwork_mail_sdk_provider_volcengine/__init__.py` | `MailProviderVolcenginePackageContract` |
| `aliyun` | `Aliyun` | `sdkwork-mail-sdk-provider-aliyun` | `providers/sdkwork_mail_sdk_provider_aliyun` | `providers/sdkwork_mail_sdk_provider_aliyun/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_aliyun/README.md` | `providers/sdkwork_mail_sdk_provider_aliyun/sdkwork_mail_sdk_provider_aliyun/__init__.py` | `MailProviderAliyunPackageContract` |
| `tencent` | `Tencent` | `sdkwork-mail-sdk-provider-tencent` | `providers/sdkwork_mail_sdk_provider_tencent` | `providers/sdkwork_mail_sdk_provider_tencent/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_tencent/README.md` | `providers/sdkwork_mail_sdk_provider_tencent/sdkwork_mail_sdk_provider_tencent/__init__.py` | `MailProviderTencentPackageContract` |
| `agora` | `Agora` | `sdkwork-mail-sdk-provider-agora` | `providers/sdkwork_mail_sdk_provider_agora` | `providers/sdkwork_mail_sdk_provider_agora/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_agora/README.md` | `providers/sdkwork_mail_sdk_provider_agora/sdkwork_mail_sdk_provider_agora/__init__.py` | `MailProviderAgoraPackageContract` |
| `zego` | `Zego` | `sdkwork-mail-sdk-provider-zego` | `providers/sdkwork_mail_sdk_provider_zego` | `providers/sdkwork_mail_sdk_provider_zego/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_zego/README.md` | `providers/sdkwork_mail_sdk_provider_zego/sdkwork_mail_sdk_provider_zego/__init__.py` | `MailProviderZegoPackageContract` |
| `livekit` | `Livekit` | `sdkwork-mail-sdk-provider-livekit` | `providers/sdkwork_mail_sdk_provider_livekit` | `providers/sdkwork_mail_sdk_provider_livekit/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_livekit/README.md` | `providers/sdkwork_mail_sdk_provider_livekit/sdkwork_mail_sdk_provider_livekit/__init__.py` | `MailProviderLivekitPackageContract` |
| `twilio` | `Twilio` | `sdkwork-mail-sdk-provider-twilio` | `providers/sdkwork_mail_sdk_provider_twilio` | `providers/sdkwork_mail_sdk_provider_twilio/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_twilio/README.md` | `providers/sdkwork_mail_sdk_provider_twilio/sdkwork_mail_sdk_provider_twilio/__init__.py` | `MailProviderTwilioPackageContract` |
| `jitsi` | `Jitsi` | `sdkwork-mail-sdk-provider-jitsi` | `providers/sdkwork_mail_sdk_provider_jitsi` | `providers/sdkwork_mail_sdk_provider_jitsi/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_jitsi/README.md` | `providers/sdkwork_mail_sdk_provider_jitsi/sdkwork_mail_sdk_provider_jitsi/__init__.py` | `MailProviderJitsiPackageContract` |
| `janus` | `Janus` | `sdkwork-mail-sdk-provider-janus` | `providers/sdkwork_mail_sdk_provider_janus` | `providers/sdkwork_mail_sdk_provider_janus/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_janus/README.md` | `providers/sdkwork_mail_sdk_provider_janus/sdkwork_mail_sdk_provider_janus/__init__.py` | `MailProviderJanusPackageContract` |
| `mediasoup` | `Mediasoup` | `sdkwork-mail-sdk-provider-mediasoup` | `providers/sdkwork_mail_sdk_provider_mediasoup` | `providers/sdkwork_mail_sdk_provider_mediasoup/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_mediasoup/README.md` | `providers/sdkwork_mail_sdk_provider_mediasoup/sdkwork_mail_sdk_provider_mediasoup/__init__.py` | `MailProviderMediasoupPackageContract` |
