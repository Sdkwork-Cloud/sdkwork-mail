# Flutter Volcengine Mail Provider Package

Reference Flutter provider package boundary for Volcengine Mail.

- provider key: `volcengine`
- plugin id: `Mail-volcengine`
- driver id: `sdkwork-mail-driver-volcengine`
- package identity: `mail_sdk_provider_volcengine`
- directory path: `providers/mail_sdk_provider_volcengine`
- manifest path: `providers/mail_sdk_provider_volcengine/pubspec.yaml`
- readme path: `providers/mail_sdk_provider_volcengine/README.md`
- source path: `providers/mail_sdk_provider_volcengine/lib/src/mail_provider_volcengine_package_contract.dart`
- source symbol: `MailProviderVolcenginePackageContract`
- vendor SDK package: `volc_engine_Mail@^3.60.4`
- status: `package_reference_boundary`
- runtime bridge status: `reference-baseline`
- root public exposure: `false`

Rules:

- this package is the executable Flutter reference bridge for the official Volcengine Mail SDK
- the root `mail_sdk` package remains provider-neutral and does not depend on `volc_engine_Mail`
- install this provider package only when a Flutter application selects Volcengine as its Mail media provider
- wrap the official vendor SDK; do not re-implement Mail media runtime, signaling, invitation, or call lifecycle behavior
- expose only provider-neutral Mail media operations: `join`, `leave`, `publish`, `unpublish`, `muteAudio`, and `muteVideo`
- use Craw Chat or another owning IM/signaling runtime for business messages, room invitations, and call state orchestration
