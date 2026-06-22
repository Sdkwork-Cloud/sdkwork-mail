# SDKWork Mail SDK Usage Guide

This document is the entrypoint for adopting `sdkwork-mail-sdk`.

It focuses on provider-neutral Mail transport runtime contracts, current runnable baselines, default
`smtp` selection, and runtime-specific guides. IM owns user lifecycle,
invite delivery, conversation discovery, and business orchestration.

## 1. Positioning

`sdkwork-mail-sdk` is not a reimplementation of vendor mail transport engines.

Its responsibility is to provide one provider-neutral Mail transport runtime standard:

- JDBC-style `DriverManager` / `DataSource` / `Client` contracts
- standardized provider selection and default-provider resolution
- standardized capability negotiation, error semantics, and extension metadata
- pluggable provider integration through official catalogs and package boundaries
- one consistent mail transport runtime surface across web, mobile, and future language workspaces

The standard intentionally keeps vendor SDK ownership on the application side:

- official vendor SDKs remain consumer-supplied
- `sdkwork-mail-sdk` provides the standard contracts and adapter boundaries
- runtime bridges map vendor behavior into the standard surface instead of hiding vendor engines
- application and service layers provide SMTP/IMAP credentials before transport operations

## 2. Official Providers

The current official provider catalog is:

| Provider key | Display name | Tier | Builtin | Current role |
| --- | --- | --- | --- | --- |
| `smtp` | SMTP Mail Transport | `tier-a` | `true` | default provider and current runnable baseline across `TypeScript` and `Flutter` executable workspaces |
| `imap` | IMAP Mail Sync | `tier-a` | `true` | official builtin catalog entry; runtime activation remains language-matrix driven |

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

- TypeScript remains the executable web runtime bridge baseline for provider-neutral Mail mail transport operations
- Flutter remains the executable mobile runtime bridge baseline for provider-neutral Mail mail transport operations
- current runnable baselines default to `smtp`
- remaining languages preserve standardized metadata, provider selection, lookup helpers, and
  package-boundary scaffolds for future runtime-bridge landings

## 4. Default Provider Contract

The default provider remains `smtp`.

Canonical defaults:

- `DEFAULT_mail_PROVIDER_KEY = 'smtp'`
- `DEFAULT_mail_PROVIDER_PLUGIN_ID = 'Mail-smtp'`
- `DEFAULT_mail_PROVIDER_DRIVER_ID = 'sdkwork-mail-driver-smtp'`

Provider selection precedence remains:

1. `providerUrl`
2. `providerKey`
3. `tenantOverrideProviderKey`
4. `deploymentProfileProviderKey`
5. `defaultProvider`

That means the TypeScript/web mail transport runtime and Flutter/mobile mail transport runtime baselines fall back to `smtp` when the caller does not explicitly override provider selection.

## 5. Runnable Baselines

### TypeScript SMTP Mail Transport Runtime Baseline

TypeScript remains the executable web runtime bridge baseline for provider-neutral Mail mail transport operations.

The current TypeScript/web mail transport runtime runtime path is:

- standard package: `@sdkwork/Mail-sdk`
- default provider: `smtp`
- vendor SDK package: `@sdkwork/Mail-sdk-provider-smtp`
- vendor SDK import path: `@sdkwork/Mail-sdk-provider-smtp`
- recommended media runtime entrypoint: `installMailProviderPackage`
- smoke command: `npm run smoke`
- smoke mode: `runtime-backed`
- smoke variants: `default`

Use the detailed guide here:

- [`docs/typescript-smtp-runtime-usage.md`](./typescript-smtp-runtime-usage.md)

### Flutter SMTP Mail Transport Runtime Baseline

Flutter remains the executable mobile runtime bridge baseline for provider-neutral Mail mail transport operations.

The current Flutter/mobile mail transport runtime runtime path is:

- standard package: `mail_sdk`
- default provider: `smtp`
- vendor SDK package: `mail_sdk_provider_smtp`
- vendor SDK import path: `package:mail_sdk_provider_smtp/mail_sdk_provider_smtp.dart`
- recommended media runtime entrypoint: `MailDataSource`
- smoke command: `flutter analyze`
- smoke mode: `analysis-backed`
- smoke variants: `default`

Use the detailed guide here:

- [`docs/flutter-smtp-runtime-usage.md`](./flutter-smtp-runtime-usage.md)

## 6. Standard Integration Boundary

The correct vendor integration boundary is still the same:

- `sdkwork-mail-sdk` owns the standard contracts and provider-neutral runtime surface
- the vendor SDK or native transport plugin owns real mail transport behavior
- the application wires transport credentials into the standard driver/runtime-controller boundary
- IM or backend services resolve provider credentials before send, probe, or sync operations
- Mail runtime code accepts transport credentials and message payloads; it does not discover invites
  or manage conversation delivery

For the current runnable baselines, this boundary is already materialized:

- TypeScript binds the standard surface to the official `@sdkwork/Mail-sdk-provider-smtp` runtime bridge
- Flutter binds the standard surface to the official `package:mail_sdk_provider_smtp/mail_sdk_provider_smtp.dart` runtime bridge

## 7. Non-Builtin Provider Packages

For providers such as `none`,
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
- TypeScript smoke mode is `runtime-backed`: `npm run smoke` runs the TypeScript package public API boundary smoke without transport bootstrap.
- Flutter smoke mode is `analysis-backed`: `flutter analyze` uses Flutter analysis for the mail transport runtime bridge baseline.
- `smoke-sdk.mjs` runs the repository regression entrypoint, including TypeScript package tests
  and optional language checks when toolchains are available

## 10. Practical Adoption Guidance

Use this rule of thumb:

- if you need the TypeScript/web mail transport runtime baseline, start from
  [`docs/typescript-smtp-runtime-usage.md`](./typescript-smtp-runtime-usage.md)
- if you need the Flutter/mobile mail transport runtime baseline, start from
  [`docs/flutter-smtp-runtime-usage.md`](./flutter-smtp-runtime-usage.md)
- if you need to understand the cross-language standard and provider package boundary model, read
  [`docs/package-standards.md`](./package-standards.md) and
  [`docs/provider-adapter-standard.md`](./provider-adapter-standard.md)

Current reality is straightforward:

- `smtp` is the default provider
- executable language baselines are `typescript` and `flutter`
- IM owns business lifecycle and realtime business delivery
- Mail owns transport provider selection, connect, send, probe, sync, and health-check operations
- the remaining language workspaces stay standardized and extensible without pretending they are
  already executable runtimes
