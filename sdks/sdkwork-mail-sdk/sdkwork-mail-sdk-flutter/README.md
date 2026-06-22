# SDKWork Mail SDK Flutter Workspace

Language: `flutter`

Planned public package:

- `mail_sdk`

Current boundary:

- control SDK support: yes
- runtime bridge support: yes
- maturity tier: reference

Current role:

- Executable mobile runtime baseline
- provider-neutral Mail contracts
- JDBC-style driver manager and data source model for Flutter/mobile
- official SMTP Flutter runtime binding through the mail_sdk_provider_SMTP plugin package
- assembly-driven provider catalog, capability catalog, provider extension catalog, and provider selection helpers
- default mobile provider remains SMTP unless the caller explicitly overrides selection
- mobile runtime bridge remains mail transport focused and leaves realtime signaling to IM

This workspace is the executable Flutter/mobile runtime baseline for provider-neutral Mail contracts, SMTP default transport binding, and JDBC-style driver selection in sdkwork-mail-sdk.

Default provider contract:

- Flutter/mobile default provider key: `smtp`
- Flutter/mobile default plugin id: `Mail-smtp`
- Flutter/mobile default driver id: `sdkwork-mail-driver-smtp`
- `MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY` must stay aligned to that assembly default
- `resolveMailProviderSelection()` in `lib/src/mail_provider_selection.dart`
  falls back to `MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY` when Flutter callers do not
  provide providerUrl, providerKey, tenant override, or deployment profile values
- `MailDataSourceOptions.defaultProviderKey` and `MailDataSource.describeSelection()`
  therefore keep the Flutter/mobile default provider on `smtp`
  until a caller explicitly overrides it


Language workspace catalog:

- workspace catalog: `lib/src/mail_language_workspace_catalog.dart`
- workspace catalog entries also keep `workspaceCatalogRelativePath`,
  `defaultProviderContract`, `providerSelectionContract`, `providerSuppoMailontract`,
  `providerActivationContract`, any declared `runtimeBaseline`,
  `providerPackageBoundaryContract`, and any declared
  `metadataScaffold`, `resolutionScaffold`, `providerPackageBoundary`, and
  `providerPackageScaffold` boundaries so consumers can inspect official assembly-driven module
  locations, workspace-wide default provider identity, selection precedence, support-status
  vocabulary, activation-status vocabulary, runtime-baseline integration details, and
  package-boundary vocabulary without rereading the
  assembly.


Runtime baseline contract:

- vendor SDK package: `mail_sdk_provider_smtp`
- vendor SDK import path: `package:mail_sdk_provider_smtp/mail_sdk_provider_smtp.dart`
- recommended entrypoint: `MailDataSource`
- smoke command: `flutter analyze`
- smoke mode: `analysis-backed`
- smoke variants: `default`


Provider package boundary:

- mode: `scaffold-per-provider-package`
- root public policy: `none`
- lifecycle status terms: `package_reference_boundary`, `future-runtime-bridge-only`
- runtime bridge status terms: `reference-baseline`, `reserved`
- these terms describe future extracted provider packages, not the runnable root workspace baseline


Package scaffold:

- build system: flutter-pub
- manifest: `pubspec.yaml`
- contract scaffold: `lib/src/mail_standard_contract.dart`


Metadata scaffold:

- provider catalog: `lib/src/mail_provider_catalog.dart`
- provider package catalog: `lib/src/mail_provider_package_catalog.dart`
- provider activation catalog: `lib/src/mail_provider_activation_catalog.dart`
- capability catalog: `lib/src/mail_capability_catalog.dart`
- provider extension catalog: `lib/src/mail_provider_extension_catalog.dart`
- provider selection: `lib/src/mail_provider_selection.dart`
- lookup helper naming contract: `lookupHelperNamingStandard`
- lookup helper naming profiles: `lower-camel-Mail`, `upper-camel-Mail`, `snake-case-Mail`
- explicit lookup helpers stay mandatory for metadata catalogs:
  provider catalog by provider key, provider package by provider key,
  provider activation by provider key, capability descriptor by capability key,
  provider extension catalog by extension key and provider key, provider URL parsing,
  provider selection resolution, provider support resolution, provider package loading, and
  language workspace by language
- helper naming stays language-idiomatic while preserving the same semantics:
  `getMail...` for Flutter/Java/Swift/Kotlin, `GetMail...` for C#/Go, and `get_Mail...` for Rust/Python


Resolution scaffold:

- driver manager: `lib/src/mail_driver_manager.dart`
- data source: `lib/src/mail_data_source.dart`
- provider support: `lib/src/mail_provider_support.dart`
- provider package loader: `lib/src/mail_provider_package_loader.dart`


Provider package scaffold:

- scaffold: `providers/provider-package-scaffold.md`
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
- this scaffold remains reserved for future extracted provider packages; the current executable runtime stays in the root workspace baseline

Provider plugin boundary:

- Flutter/mobile root stays provider-neutral and ships no concrete provider adapter
- provider plugins such as `mail_sdk_provider_volcengine` are installed only by applications that select them
- `MailDriverManager` does not auto-register provider drivers from the root package
- `MailDataSource()` resolves metadata but requires an explicitly registered provider driver before connecting
- business invitations, lifecycle state, and conversation delivery are supplied by IM-owned SDKs

Quick start:

```dart
import 'package:mail_sdk/mail_sdk.dart';

void inspectProviderPluginPackage() {
  final target = resolveMailProviderPackageLoadTarget(
    const MailProviderPackageLoadRequest(providerKey: 'volcengine'),
  );

  assert(target.packageEntry.packageIdentity == 'mail_sdk_provider_volcengine');
}
```

Runtime notes:

- provider-specific native config types belong to the selected provider plugin package
- `MailJoinOptions.token` is supplied by the application or IM layer, not hardcoded in Mail callers
- `MailPublishOptions` remains provider-neutral and supports standard audio and video publishing
- `MailDataSource` keeps the provider-neutral runtime boundary stable across native SDK adapters
- IM-owned services decide who should join, which provider room to use, and when the media runtime
  should leave

Standards references:

- `../docs/provider-adapter-standard.md`
- `../docs/multilanguage-capability-matrix.md`
