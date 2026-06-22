# SDKWork Mail SDK Flutter Runtime Usage

This guide describes the executable Flutter/mobile media runtime baseline of `sdkwork-mail-sdk`.
IM-owned SDKs and services create business call sessions, deliver invitations, and issue provider
credentials. The Mail SDK consumes media-room inputs and drives provider media behavior.

## Current Runnable Baseline

- Default media provider: `volcengine`
- Default mobile provider plugin package: `mail_sdk_provider_volcengine`
- Default mobile provider plugin import path: `package:mail_sdk_provider_volcengine/mail_sdk_provider_volcengine.dart`
- Standard media entrypoint: `MailDataSource`
- Recommended runtime entrypoint: `MailDataSource`
- Smoke command: `flutter analyze`
- Smoke mode: `analysis-backed`
- Smoke variants: `default`

## Install

Add the standard Mail package. Provider plugin packages such as
`mail_sdk_provider_volcengine` are installed by the application only when that provider is
selected. The root package has no provider or vendor SDK dependency.

```yaml
dependencies:
  flutter:
    sdk: flutter
  mail_sdk:
    path: ../sdkwork-mail-sdk/sdkwork-mail-sdk-flutter
```

## Fast Runtime Verification

Run the public Flutter analysis command inside `sdkwork-mail-sdk-flutter` when you need to verify
the provider-neutral media runtime contracts:

```powershell
flutter analyze
```

## Media Runtime Flow

```dart
import 'package:mail_sdk/mail_sdk.dart';

void inspectMailProviderBoundary() {
  final packageEntry = getMailProviderPackageByProviderKey('volcengine');
  final target = resolveMailProviderPackageLoadTarget(
    const MailProviderPackageLoadRequest(providerKey: 'volcengine'),
  );

  assert(packageEntry?.packageIdentity == 'mail_sdk_provider_volcengine');
  assert(target.packageEntry.packageIdentity == 'mail_sdk_provider_volcengine');
}
```

## Provider Native Config

The Flutter root package is provider-neutral. Provider-specific native config types belong to the
selected provider plugin package and are imported only by applications that install that plugin.

## Runtime Guarantees

- `MailDataSource` is the standard provider-neutral media client factory
- `MailDriverManager` accepts provider drivers registered by explicit provider plugin packages
- `MailDataSource` defaults to `volcengine` only after the matching provider driver is
  registered
- provider plugin packages own concrete native bridge implementations and vendor dependencies
- provider credentials are supplied by the application or IM layer before `join()`
- Mail runtime code does not own user invitation, conversation delivery, or business call lifecycle
- audio and video publish operations stay standardized through `MailPublishOptions`
