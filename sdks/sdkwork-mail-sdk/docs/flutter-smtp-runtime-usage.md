# SDKWork Mail SDK Flutter Runtime Usage

This guide describes the executable Flutter/mobile mail transport runtime baseline of `sdkwork-mail-sdk`.
Backend services and application layers resolve SMTP/IMAP provider credentials. The Mail SDK consumes
those credentials and drives provider transport behavior through the standard runtime surface.

## Current Runnable Baseline

- Default transport provider: `smtp`
- Default mobile provider plugin package: `mail_sdk_provider_smtp`
- Default mobile provider plugin import path: `package:mail_sdk_provider_smtp/mail_sdk_provider_smtp.dart`
- Standard transport entrypoint: `MailDataSource`
- Recommended runtime entrypoint: `MailDataSource`
- Smoke command: `flutter analyze`
- Smoke mode: `analysis-backed`
- Smoke variants: `default`

## Install

Add the standard Mail package. Provider plugin packages such as
`mail_sdk_provider_smtp` are installed by the application only when that provider is
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
the provider-neutral mail transport runtime contracts:

```powershell
flutter analyze
```

## Mail Transport Runtime Flow

```dart
import 'package:mail_sdk/mail_sdk.dart';

void inspectMailProviderBoundary() {
  final packageEntry = getMailProviderPackageByProviderKey('smtp');
  final target = resolveMailProviderPackageLoadTarget(
    const MailProviderPackageLoadRequest(providerKey: 'smtp'),
  );

  assert(packageEntry?.packageIdentity == 'mail_sdk_provider_smtp');
  assert(target.packageEntry.packageIdentity == 'mail_sdk_provider_smtp');
}
```

## Provider Native Config

The Flutter root package is provider-neutral. Provider-specific native config types belong to the
selected provider plugin package and are imported only by applications that install that plugin.

## Runtime Guarantees

- `MailDataSource` is the standard provider-neutral mail transport client factory
- `MailDriverManager` accepts provider drivers registered by explicit provider plugin packages
- `MailDataSource` defaults to `smtp` only after the matching provider driver is
  registered
- provider plugin packages own concrete native bridge implementations and vendor dependencies
- provider credentials are supplied by the application or backend service before `connectTransport()`
- Mail runtime code does not own user invitation, conversation delivery, or business lifecycle
- send, probe, and sync operations stay standardized through `sendMail`, `probeMailbox`, and
  `syncMailbox`
