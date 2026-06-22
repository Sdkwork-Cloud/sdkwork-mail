# SDKWork Mail SDK Usage Guide

This document is the entrypoint for adopting `sdkwork-mail-sdk`.

It focuses on provider-neutral Mail media runtime contracts, current runnable baselines, default
`volcengine` selection, and runtime-specific guides. IM owns user call lifecycle,
invite delivery, conversation discovery, and business session orchestration.

## 1. Positioning

`sdkwork-mail-sdk` is not a reimplementation of vendor media engines.

Its responsibility is to provide one provider-neutral Mail media runtime standard:

- JDBC-style `DriverManager` / `DataSource` / `Client` contracts
- standardized provider selection and default-provider resolution
- standardized capability negotiation, error semantics, and extension metadata
- pluggable provider integration through official catalogs and package boundaries
- one consistent media runtime surface across web, mobile, and future language workspaces

The standard intentionally keeps vendor SDK ownership on the application side:

- official vendor SDKs remain consumer-supplied
- `sdkwork-mail-sdk` provides the standard contracts and adapter boundaries
- runtime bridges map vendor behavior into the standard surface instead of hiding vendor engines
- application and IM layers provide room/session credentials before the Mail client joins media

## 2. Official Providers

The current official provider catalog is:

| Provider key | Display name | Tier | Builtin | Current role |
| --- | --- | --- | --- | --- |
| `volcengine` | Volcengine Mail | `tier-a` | `true` | default provider and current runnable baseline across `TypeScript` and `Flutter` executable workspaces |
| `aliyun` | Aliyun Mail | `tier-a` | `true` | official builtin catalog entry; runtime activation remains language-matrix driven |
| `tencent` | Tencent Mail | `tier-a` | `true` | official builtin catalog entry; runtime activation remains language-matrix driven |
| `agora` | Agora Mail | `tier-a` | `true` | official builtin catalog entry; runtime activation remains language-matrix driven |
| `zego` | ZEGO Mail | `tier-b` | `false` | official package-boundary target |
| `livekit` | LiveKit Mail | `tier-a` | `true` | official builtin catalog entry; runtime activation remains language-matrix driven |
| `twilio` | Twilio Video | `tier-b` | `false` | official package-boundary target |
| `jitsi` | Jitsi Meet | `tier-b` | `false` | official package-boundary target |
| `janus` | Janus Mail | `tier-c` | `false` | future SPI target |
| `mediasoup` | mediasoup Mail | `tier-c` | `false` | future SPI target |

Notes:

- `builtin = true` means the provider is part of the official assembly-driven builtin catalog
- builtin does not mean the vendor runtime is bundled into every language workspace
- non-default providers still follow the same provider metadata, capability, and activation rules

## 3. Language Status

Current language workspace status:

| Language | Workspace | Public package | Maturity | Runtime bridge | Current role |
| --- | --- | --- | --- | --- | --- |
| TypeScript | `sdkwork-mail-sdk-typescript` | `@sdkwork/Mail-sdk` | `reference` | yes | Executable reference implementation |
| Flutter | `sdkwork-mail-sdk-flutter` | `mail_sdk` | `reference` | yes | Executable mobile runtime baseline |
| Rust | `sdkwork-mail-sdk-rust` | `mail_sdk` | `reserved` | no | Reserved workspace skeleton |
| Java | `sdkwork-mail-sdk-java` | `com.sdkwork:Mail-sdk` | `reserved` | no | Reserved workspace skeleton |
| C# | `sdkwork-mail-sdk-csharp` | `Sdkwork.Mail.Sdk` | `reserved` | no | Reserved workspace skeleton |
| Swift | `sdkwork-mail-sdk-swift` | `MailSdk` | `reserved` | no | Reserved workspace skeleton |
| Kotlin | `sdkwork-mail-sdk-kotlin` | `com.sdkwork:Mail-sdk` | `reserved` | no | Reserved workspace skeleton |
| Go | `sdkwork-mail-sdk-go` | `github.com/sdkwork/Mail-sdk` | `reserved` | no | Reserved workspace skeleton |
| Python | `sdkwork-mail-sdk-python` | `sdkwork-mail-sdk` | `reserved` | no | Reserved workspace skeleton |

Current conclusion:

- TypeScript remains the executable web runtime bridge baseline for provider-neutral Mail media operations
- Flutter remains the executable mobile runtime bridge baseline for provider-neutral Mail media operations
- current runnable baselines default to `volcengine`
- remaining languages preserve standardized metadata, provider selection, lookup helpers, and
  package-boundary scaffolds for future runtime-bridge landings

## 4. Default Provider Contract

The default provider remains `volcengine`.

Canonical defaults:

- `DEFAULT_mail_PROVIDER_KEY = 'volcengine'`
- `DEFAULT_mail_PROVIDER_PLUGIN_ID = 'Mail-volcengine'`
- `DEFAULT_mail_PROVIDER_DRIVER_ID = 'sdkwork-mail-driver-volcengine'`

Provider selection precedence remains:

1. `providerUrl`
2. `providerKey`
3. `tenantOverrideProviderKey`
4. `deploymentProfileProviderKey`
5. `defaultProvider`

That means the TypeScript/web media runtime and Flutter/mobile media runtime baselines fall back to `volcengine` when the caller does not explicitly override provider selection.

## 5. Runnable Baselines

### TypeScript Volcengine Media Runtime Baseline

TypeScript remains the executable web runtime bridge baseline for provider-neutral Mail media operations.

The current TypeScript/web media runtime runtime path is:

- standard package: `@sdkwork/Mail-sdk`
- default provider: `volcengine`
- vendor SDK package: `@sdkwork/Mail-sdk-provider-volcengine`
- vendor SDK import path: `@sdkwork/Mail-sdk-provider-volcengine`
- recommended media runtime entrypoint: `installMailProviderPackage`
- smoke command: `npm run smoke`
- smoke mode: `runtime-backed`
- smoke variants: `default`

Use the detailed guide here:

- [`docs/typescript-volcengine-runtime-usage.md`](./typescript-volcengine-runtime-usage.md)

### Flutter Volcengine Media Runtime Baseline

Flutter remains the executable mobile runtime bridge baseline for provider-neutral Mail media operations.

The current Flutter/mobile media runtime runtime path is:

- standard package: `mail_sdk`
- default provider: `volcengine`
- vendor SDK package: `mail_sdk_provider_volcengine`
- vendor SDK import path: `package:mail_sdk_provider_volcengine/mail_sdk_provider_volcengine.dart`
- recommended media runtime entrypoint: `MailDataSource`
- smoke command: `flutter analyze`
- smoke mode: `analysis-backed`
- smoke variants: `default`

Use the detailed guide here:

- [`docs/flutter-volcengine-runtime-usage.md`](./flutter-volcengine-runtime-usage.md)

## 6. Standard Integration Boundary

The correct vendor integration boundary is still the same:

- `sdkwork-mail-sdk` owns the standard contracts and provider-neutral runtime surface
- the vendor SDK owns real media behavior
- the application wires vendor SDK instances into the standard driver/runtime-controller boundary
- IM creates or resolves business call sessions and provider credentials before media join
- Mail runtime code accepts room, participant, and provider token inputs; it does not discover invites
  or manage conversation delivery

For the current runnable baselines, this boundary is already materialized:

- TypeScript binds the standard surface to the official `@sdkwork/Mail-sdk-provider-volcengine` runtime bridge
- Flutter binds the standard surface to the official `package:mail_sdk_provider_volcengine/mail_sdk_provider_volcengine.dart` runtime bridge

## 7. Non-Builtin Provider Packages

For providers such as `zego`, `twilio`, `jitsi`, `janus`, `mediasoup`,
the standard path is package-boundary integration instead of deep root-entrypoint coupling.

That contract stays:

- official provider metadata remains assembly-driven
- package identity, manifest path, README path, and source symbol stay standardized
- runtime code is loaded through the provider-package loader SPI
- runtime bridge ownership stays with the integrating application or provider package

## 8. Error Semantics

Important standardized error codes include:

- `invalid_provider_url`
- `driver_not_found`
- `provider_not_supported`
- `provider_package_not_found`
- `provider_package_identity_mismatch`
- `provider_package_load_failed`
- `provider_module_export_missing`
- `provider_module_contract_mismatch`
- `provider_metadata_mismatch`
- `native_sdk_not_available`
- `vendor_error`

The two most important runtime distinctions are:

- `provider_not_supported`: the provider exists in the official catalog but no runnable driver is
  registered in the current runtime
- `native_sdk_not_available`: the standard surface exists but the actual vendor runtime bridge is
  missing or misconfigured

## 9. Local Verification

Use the following commands in the workspace root:

```powershell
node .\bin\materialize-sdk.mjs
node .\test\verify-sdk-automation.test.mjs
node .\bin\verify-sdk.mjs
cd .\sdkwork-mail-sdk-typescript && npm run smoke
cd .\sdkwork-mail-sdk-flutter && flutter analyze
node .\bin\smoke-sdk.mjs
```

Verification intent:

- `materialize-sdk.mjs` keeps generated catalogs, READMEs, matrices, and this usage guide aligned to the assembly
- `verify-sdk-automation.test.mjs` protects standard assets and materialization behavior
- `verify-sdk.mjs` validates assembly contracts and generated output
- TypeScript smoke mode is `runtime-backed`: `npm run smoke` runs the TypeScript package public API boundary smoke without call signaling.
- Flutter smoke mode is `analysis-backed`: `flutter analyze` uses Flutter analysis for the media runtime bridge baseline.
- `smoke-sdk.mjs` runs the repository regression entrypoint, including TypeScript package tests
  and optional language checks when toolchains are available

## 10. Practical Adoption Guidance

Use this rule of thumb:

- if you need the TypeScript/web media runtime baseline, start from
  [`docs/typescript-volcengine-runtime-usage.md`](./typescript-volcengine-runtime-usage.md)
- if you need the Flutter/mobile media runtime baseline, start from
  [`docs/flutter-volcengine-runtime-usage.md`](./flutter-volcengine-runtime-usage.md)
- if you need to understand the cross-language standard and provider package boundary model, read
  [`docs/package-standards.md`](./package-standards.md) and
  [`docs/provider-adapter-standard.md`](./provider-adapter-standard.md)

Current reality is straightforward:

- `volcengine` is the default provider
- executable language baselines are `typescript` and `flutter`
- IM owns call session lifecycle and realtime business delivery
- Mail owns media runtime provider selection, joining, publishing, muting, and leaving
- the remaining language workspaces stay standardized and extensible without pretending they are
  already executable runtimes
