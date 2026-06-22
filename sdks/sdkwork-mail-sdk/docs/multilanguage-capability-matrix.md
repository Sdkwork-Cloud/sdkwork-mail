# Mail SDK Multilanguage Capability Matrix

This matrix is materialized from `.sdkwork-assembly.json` so the official provider tiers, language
support boundaries, and maturity tiers stay exact and verifiable.

## Provider Tier Semantics

- `tier-a`: Built-in baseline providers
- `tier-b`: Official extension targets with reserved adapter positions
- `tier-c`: Future SPI targets

## Language Maturity Semantics

- `reference`: Executable baseline language workspace
- `reserved`: Official but not yet executable runtime-bridge workspace

## Capability Standard

- `capabilityStandard.categoryTerms`: `required-baseline`, `optional-advanced`
- `capabilityStandard.surfaceTerms`: `control-plane`, `runtime-bridge`, `cross-surface`

## Capability Negotiation Standard

- `capabilityNegotiationStandard.statusTerms`: `supported`, `degraded`, `unsupported`
- `capabilityNegotiationStandard.statusRules.supported`: `all-requested-capabilities-available`
- `capabilityNegotiationStandard.statusRules.degraded`: `all-required-capabilities-available_optional-capabilities-missing`
- `capabilityNegotiationStandard.statusRules.unsupported`: `required-capabilities-missing`

## Runtime Surface Standard

- `runtimeSurfaceStandard.methodTerms`: `join`, `leave`, `publish`, `unpublish`, `startScreenShare`, `stopScreenShare`, `muteAudio`, `muteVideo`
- `runtimeSurfaceStandard.failureCode`: `native_sdk_not_available`
- TypeScript root public constants: `mail_RUNTIME_SURFACE_METHODS`, `mail_RUNTIME_SURFACE_FAILURE_CODE`

## Runtime Immutability Standard

- `runtimeImmutabilityStandard.frozenTerm`: `runtime-frozen`
- `runtimeImmutabilityStandard.snapshotTerm`: `immutable-snapshots`
- `runtimeImmutabilityStandard.controllerContextTerm`: `shallow-immutable-context`
- `runtimeImmutabilityStandard.nativeClientTerm`: `mutable-native-client`
- TypeScript root public constants: `mail_RUNTIME_IMMUTABILITY_FROZEN_TERM`, `mail_RUNTIME_IMMUTABILITY_SNAPSHOT_TERM`, `mail_RUNTIME_IMMUTABILITY_CONTROLLER_CONTEXT_TERM`, `mail_RUNTIME_IMMUTABILITY_NATIVE_CLIENT_TERM`, `mail_RUNTIME_IMMUTABILITY_STANDARD`

## Root Public Surface Standard

- `rootPublicSurfaceStandard.typescriptProviderNeutralExportPaths`: `./errors.js`, `./runtime-surface.js`, `./runtime-immutability.js`, `./root-public-surface.js`, `./types.js`, `./capability-catalog.js`, `./capability-negotiation.js`, `./provider-catalog.js`, `./language-workspace-catalog.js`, `./provider-selection.js`, `./provider-support.js`, `./provider-extension-catalog.js`, `./provider-package-catalog.js`, `./provider-package-loader.js`, `./provider-activation-catalog.js`, `./capabilities.js`, `./client.js`, `./driver.js`, `./driver-manager.js`, `./data-source.js`, `./provider-module.js`
- `rootPublicSurfaceStandard.typescriptBuiltinProviderExportPaths`: `none`
- `rootPublicSurfaceStandard.typescriptInlineHelperNames`: `none`
- `rootPublicSurfaceStandard.reservedSurfaceFamilies`: `standard-contract`, `provider-catalog`, `provider-package-catalog`, `provider-activation-catalog`, `capability-catalog`, `provider-extension-catalog`, `language-workspace-catalog`, `provider-selection`, `provider-package-loader`, `provider-support`, `driver-manager`, `data-source`
- `rootPublicSurfaceStandard.reservedEntryPointKinds.flutter`: `barrel`
- `rootPublicSurfaceStandard.reservedEntryPointKinds.python`: `package-init`
- `rootPublicSurfaceStandard.builtinProviderExposureTerm`: `provider-plugin-package-only`
- `rootPublicSurfaceStandard.nonBuiltinProviderExposureTerm`: `package-boundary-only`
- TypeScript root public module: `sdkwork-mail-sdk-typescript/src/root-public-surface.ts`
- TypeScript root public constants: `mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_PROVIDER_NEUTRAL_EXPORT_PATHS`, `mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_BUILTIN_PROVIDER_EXPORT_PATHS`, `mail_ROOT_PUBLIC_SURFACE_TYPESCRIPT_INLINE_HELPER_NAMES`, `mail_ROOT_PUBLIC_SURFACE_RESERVED_SURFACE_FAMILIES`, `mail_ROOT_PUBLIC_SURFACE_RESERVED_ENTRYPOINT_KINDS`, `mail_ROOT_PUBLIC_SURFACE_STANDARD`

## Lookup Helper Naming Standard

- `lookupHelperNamingStandard.profileTerms`: `lower-camel-Mail`, `upper-camel-Mail`, `snake-case-Mail`
- `lookupHelperNamingStandard.familyTerms`: `provider-catalog-by-provider-key`, `provider-package-by-provider-key`, `provider-package-by-package-identity`, `provider-activation-by-provider-key`, `capability-catalog`, `capability-descriptor-by-capability-key`, `provider-extension-catalog`, `provider-extension-descriptor-by-extension-key`, `provider-extensions-for-provider`, `provider-extensions-by-extension-keys`, `provider-extension-membership`, `language-workspace-by-language`, `provider-url-parser`, `provider-selection-resolver`, `provider-support-status-resolver`, `provider-support-state-factory`, `provider-package-loader-factory`, `provider-package-load-target-resolver`, `provider-module-loader`, `single-provider-package-installer`, `batch-provider-package-installer`
- TypeScript root public module: `sdkwork-mail-sdk-typescript/src/lookup-helper-naming.ts`
- TypeScript root public constants: `mail_LOOKUP_HELPER_NAMING_PROFILE_TERMS`, `mail_LOOKUP_HELPER_NAMING_FAMILY_TERMS`, `mail_LOOKUP_HELPER_NAMING_STANDARD`

## Error Code Standard

- `errorCodeStandard.codeTerms`: `provider_package_not_found`, `provider_package_identity_mismatch`, `provider_package_load_failed`, `provider_module_export_missing`, `provider_module_contract_mismatch`, `driver_already_registered`, `driver_not_found`, `provider_not_official`, `provider_not_supported`, `provider_metadata_mismatch`, `provider_selection_failed`, `capability_not_supported`, `invalid_provider_url`, `invalid_native_config`, `native_sdk_not_available`, `vendor_error`
- `errorCodeStandard.fallbackCode`: `vendor_error`

## Provider Extension Standard

- `providerExtensionStandard.accessTerms`: `unwrap-only`, `extension-object`
- `providerExtensionStandard.statusTerms`: `reference-baseline`, `reserved`

## TypeScript Adapter Standard

- `typescriptAdapterStandard.sdkProvisioningTerms`: `consumer-supplied`
- `typescriptAdapterStandard.bindingStrategyTerms`: `native-factory`
- `typescriptAdapterStandard.bundlePolicyTerms`: `must-not-bundle`
- `typescriptAdapterStandard.runtimeBridgeStatusTerms`: `reference-baseline`, `reserved`
- `typescriptAdapterStandard.officialVendorSdkRequirementTerms`: `required`, `not-declared-until-bridge`
- `typescriptAdapterStandard.referenceContract.sdkProvisioning`: `consumer-supplied`
- `typescriptAdapterStandard.referenceContract.bindingStrategy`: `native-factory`
- `typescriptAdapterStandard.referenceContract.bundlePolicy`: `must-not-bundle`
- `typescriptAdapterStandard.referenceContract.runtimeBridgeStatus`: `reference-baseline`
- `typescriptAdapterStandard.referenceContract.officialVendorSdkRequirement`: `required`

## TypeScript Package Standard

- `typescriptPackageStandard.packageNamePattern`: `@sdkwork/Mail-sdk-provider-{providerKey}`
- `typescriptPackageStandard.sourceModulePattern`: `./index.js`
- `typescriptPackageStandard.driverFactoryPattern`: `create{providerPascal}MailDriver`
- `typescriptPackageStandard.metadataSymbolPattern`: `{providerUpperSnake}_mail_PROVIDER_METADATA`
- `typescriptPackageStandard.moduleSymbolPattern`: `{providerUpperSnake}_mail_PROVIDER_MODULE`
- `typescriptPackageStandard.rootPublicRule`: `plugin-package-only`

## Capability Catalog

| Capability key | Category | Surface |
| --- | --- | --- |
| `session` | `required-baseline` | `cross-surface` |
| `credential` | `required-baseline` | `control-plane` |
| `provider.webhook` | `required-baseline` | `control-plane` |
| `provider.event-normalization` | `required-baseline` | `control-plane` |
| `health` | `required-baseline` | `control-plane` |
| `media.audio` | `required-baseline` | `runtime-bridge` |
| `media.video` | `required-baseline` | `runtime-bridge` |
| `live.broadcast` | `required-baseline` | `cross-surface` |
| `live.audience` | `required-baseline` | `cross-surface` |
| `screen-share` | `optional-advanced` | `runtime-bridge` |
| `recording` | `optional-advanced` | `control-plane` |
| `artifact` | `optional-advanced` | `control-plane` |
| `cloud-mix` | `optional-advanced` | `control-plane` |
| `cdn-relay` | `optional-advanced` | `control-plane` |
| `data-channel` | `optional-advanced` | `runtime-bridge` |
| `transcription` | `optional-advanced` | `control-plane` |
| `beauty` | `optional-advanced` | `runtime-bridge` |
| `spatial-audio` | `optional-advanced` | `runtime-bridge` |
| `e2ee` | `optional-advanced` | `runtime-bridge` |
| `provider.active-query` | `optional-advanced` | `control-plane` |

## Provider Extension Catalog

| Extension key | Provider key | Display name | Surface | Access | Status |
| --- | --- | --- | --- | --- | --- |
| `volcengine.native-client` | `volcengine` | Volcengine Native Client | `runtime-bridge` | `unwrap-only` | `reference-baseline` |
| `aliyun.native-client` | `aliyun` | Aliyun Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |
| `tencent.native-client` | `tencent` | Tencent Native Client | `runtime-bridge` | `unwrap-only` | `reference-baseline` |
| `agora.native-client` | `agora` | Agora Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |
| `zego.native-client` | `zego` | ZEGO Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |
| `livekit.native-client` | `livekit` | LiveKit Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |
| `twilio.native-client` | `twilio` | Twilio Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |
| `jitsi.native-client` | `jitsi` | Jitsi Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |
| `janus.native-client` | `janus` | Janus Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |
| `mediasoup.native-client` | `mediasoup` | mediasoup Native Client | `runtime-bridge` | `unwrap-only` | `reserved` |

## Provider Matrix

| Provider key | Tier | Builtin | Default selected | Display name |
| --- | --- | --- | --- | --- |
| `volcengine` | `tier-a` | Yes | Yes | Volcengine Mail |
| `aliyun` | `tier-a` | Yes | No | Aliyun Mail |
| `tencent` | `tier-a` | Yes | No | Tencent Mail |
| `agora` | `tier-a` | Yes | No | Agora Mail |
| `zego` | `tier-b` | No | No | ZEGO Mail |
| `livekit` | `tier-a` | Yes | No | LiveKit Mail |
| `twilio` | `tier-b` | No | No | Twilio Video |
| `jitsi` | `tier-b` | No | No | Jitsi Meet |
| `janus` | `tier-c` | No | No | Janus Mail |
| `mediasoup` | `tier-c` | No | No | mediasoup Mail |

## Provider Capability Matrix

| Provider key | Required capabilities | Optional capabilities |
| --- | --- | --- |
| `volcengine` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `cloud-mix`, `provider.active-query` |
| `aliyun` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `cloud-mix`, `provider.active-query` |
| `tencent` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `cdn-relay`, `provider.active-query` |
| `agora` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `cloud-mix`, `data-channel`, `spatial-audio`, `e2ee`, `provider.active-query` |
| `zego` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `cloud-mix`, `beauty`, `provider.active-query` |
| `livekit` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `data-channel`, `transcription`, `e2ee`, `provider.active-query` |
| `twilio` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `data-channel`, `provider.active-query` |
| `jitsi` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `screen-share`, `recording`, `artifact`, `transcription`, `provider.active-query` |
| `janus` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `data-channel`, `provider.active-query` |
| `mediasoup` | `session`, `credential`, `provider.webhook`, `health`, `media.audio`, `media.video`, `live.broadcast`, `live.audience`, `provider.event-normalization` | `data-channel`, `provider.active-query` |

## TypeScript Provider Runtime Baseline

| Provider key | Runtime bridge status | Vendor SDK requirement | SDK provisioning | Binding strategy | Bundle policy |
| --- | --- | --- | --- | --- | --- |
| `volcengine` | `reference-baseline` | `required` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `aliyun` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `tencent` | `reference-baseline` | `required` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `agora` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `zego` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `livekit` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `twilio` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `jitsi` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `janus` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |
| `mediasoup` | `reserved` | `not-declared-until-bridge` | `consumer-supplied` | `native-factory` | `must-not-bundle` |

## Language Matrix

| Language | Public package | Control SDK | Runtime bridge | Maturity tier | Current role |
| --- | --- | --- | --- | --- | --- |
| TypeScript | `@sdkwork/Mail-sdk` | Yes | Yes | `reference` | Executable reference implementation |
| Flutter | `mail_sdk` | Yes | Yes | `reference` | Executable mobile runtime baseline |
| Rust | `mail_sdk` | Yes | No | `reserved` | Reserved workspace skeleton |
| Java | `com.sdkwork:Mail-sdk` | Yes | No | `reserved` | Reserved workspace skeleton |
| C# | `Sdkwork.Mail.Sdk` | Yes | No | `reserved` | Reserved workspace skeleton |
| Swift | `MailSdk` | Yes | No | `reserved` | Reserved workspace skeleton |
| Kotlin | `com.sdkwork:Mail-sdk` | Yes | No | `reserved` | Reserved workspace skeleton |
| Go | `github.com/sdkwork/Mail-sdk` | Yes | No | `reserved` | Reserved workspace skeleton |
| Python | `sdkwork-mail-sdk` | Yes | No | `reserved` | Reserved workspace skeleton |

## Language Workspace Catalog Matrix

| Language | Workspace catalog | Public package | Control SDK | Runtime bridge | Maturity tier |
| --- | --- | --- | --- | --- | --- |
| TypeScript | `src/language-workspace-catalog.ts` | `@sdkwork/Mail-sdk` | Yes | Yes | `reference` |
| Flutter | `lib/src/mail_language_workspace_catalog.dart` | `mail_sdk` | Yes | Yes | `reference` |
| Rust | `src/language_workspace_catalog.rs` | `mail_sdk` | Yes | No | `reserved` |
| Java | `src/main/java/com/sdkwork/Mail/metadata/MailLanguageWorkspaceCatalog.java` | `com.sdkwork:Mail-sdk` | Yes | No | `reserved` |
| C# | `src/SDKWork.Mail.Sdk/MailLanguageWorkspaceCatalog.cs` | `Sdkwork.Mail.Sdk` | Yes | No | `reserved` |
| Swift | `Sources/MailSdk/MailLanguageWorkspaceCatalog.swift` | `MailSdk` | Yes | No | `reserved` |
| Kotlin | `src/main/kotlin/com/sdkwork/Mail/metadata/MailLanguageWorkspaceCatalog.kt` | `com.sdkwork:Mail-sdk` | Yes | No | `reserved` |
| Go | `Mailstandard/language_workspace_catalog.go` | `github.com/sdkwork/Mail-sdk` | Yes | No | `reserved` |
| Python | `sdkwork_mail_sdk/language_workspace_catalog.py` | `sdkwork-mail-sdk` | Yes | No | `reserved` |

## Language Provider Package Boundary Matrix

| Language | Mode | Root public policy | Lifecycle status terms | Runtime bridge status terms | Concrete scaffold path |
| --- | --- | --- | --- | --- | --- |
| TypeScript | `catalog-governed-mixed` | `none` | `package_reference_boundary` | `reference-baseline`, `reserved` | `<none>` |
| Flutter | `scaffold-per-provider-package` | `none` | `package_reference_boundary`, `future-runtime-bridge-only` | `reference-baseline`, `reserved` | `providers/provider-package-scaffold.md` |
| Rust | `scaffold-per-provider-package` | `none` | `future-runtime-bridge-only` | `reserved` | `providers/provider-package-scaffold.md` |
| Java | `scaffold-per-provider-package` | `none` | `future-runtime-bridge-only` | `reserved` | `providers/provider-package-scaffold.md` |
| C# | `scaffold-per-provider-package` | `none` | `future-runtime-bridge-only` | `reserved` | `providers/provider-package-scaffold.md` |
| Swift | `scaffold-per-provider-package` | `none` | `future-runtime-bridge-only` | `reserved` | `providers/provider-package-scaffold.md` |
| Kotlin | `scaffold-per-provider-package` | `none` | `future-runtime-bridge-only` | `reserved` | `providers/provider-package-scaffold.md` |
| Go | `scaffold-per-provider-package` | `none` | `future-runtime-bridge-only` | `reserved` | `providers/provider-package-scaffold.md` |
| Python | `scaffold-per-provider-package` | `none` | `future-runtime-bridge-only` | `reserved` | `providers/provider-package-scaffold.md` |

## Reserved Language Package Scaffold Matrix

| Language | Build system | Manifest path | Contract scaffold |
| --- | --- | --- | --- |
| Flutter | `flutter-pub` | `pubspec.yaml` | `lib/src/mail_standard_contract.dart` |
| Rust | `cargo` | `Cargo.toml` | `src/lib.rs` |
| Java | `maven` | `pom.xml` | `src/main/java/com/sdkwork/Mail/standard/MailStandardContract.java` |
| C# | `dotnet-sdk` | `src/SDKWork.Mail.Sdk/SDKWork.Mail.Sdk.csproj` | `src/SDKWork.Mail.Sdk/MailStandardContract.cs` |
| Swift | `swift-package-manager` | `Package.swift` | `Sources/MailSdk/MailStandardContract.swift` |
| Kotlin | `gradle-kotlin-dsl` | `build.gradle.kts` | `src/main/kotlin/com/sdkwork/Mail/standard/MailStandardContract.kt` |
| Go | `go-modules` | `go.mod` | `Mailstandard/contract.go` |
| Python | `pyproject` | `pyproject.toml` | `sdkwork_mail_sdk/standard_contract.py` |

## Reserved Language Metadata Scaffold Matrix

| Language | Provider catalog | Provider package catalog | Provider activation catalog | Capability catalog | Provider extension catalog | Provider selection |
| --- | --- | --- | --- | --- | --- | --- |
| Flutter | `lib/src/mail_provider_catalog.dart` | `lib/src/mail_provider_package_catalog.dart` | `lib/src/mail_provider_activation_catalog.dart` | `lib/src/mail_capability_catalog.dart` | `lib/src/mail_provider_extension_catalog.dart` | `lib/src/mail_provider_selection.dart` |
| Rust | `src/provider_catalog.rs` | `src/provider_package_catalog.rs` | `src/provider_activation_catalog.rs` | `src/capability_catalog.rs` | `src/provider_extension_catalog.rs` | `src/provider_selection.rs` |
| Java | `src/main/java/com/sdkwork/Mail/metadata/MailProviderCatalog.java` | `src/main/java/com/sdkwork/Mail/metadata/MailProviderPackageCatalog.java` | `src/main/java/com/sdkwork/Mail/metadata/MailProviderActivationCatalog.java` | `src/main/java/com/sdkwork/Mail/metadata/MailCapabilityCatalog.java` | `src/main/java/com/sdkwork/Mail/metadata/MailProviderExtensionCatalog.java` | `src/main/java/com/sdkwork/Mail/metadata/MailProviderSelection.java` |
| C# | `src/SDKWork.Mail.Sdk/MailProviderCatalog.cs` | `src/SDKWork.Mail.Sdk/MailProviderPackageCatalog.cs` | `src/SDKWork.Mail.Sdk/MailProviderActivationCatalog.cs` | `src/SDKWork.Mail.Sdk/MailCapabilityCatalog.cs` | `src/SDKWork.Mail.Sdk/MailProviderExtensionCatalog.cs` | `src/SDKWork.Mail.Sdk/MailProviderSelection.cs` |
| Swift | `Sources/MailSdk/MailProviderCatalog.swift` | `Sources/MailSdk/MailProviderPackageCatalog.swift` | `Sources/MailSdk/MailProviderActivationCatalog.swift` | `Sources/MailSdk/MailCapabilityCatalog.swift` | `Sources/MailSdk/MailProviderExtensionCatalog.swift` | `Sources/MailSdk/MailProviderSelection.swift` |
| Kotlin | `src/main/kotlin/com/sdkwork/Mail/metadata/MailProviderCatalog.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailProviderPackageCatalog.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailProviderActivationCatalog.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailCapabilityCatalog.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailProviderExtensionCatalog.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailProviderSelection.kt` |
| Go | `Mailstandard/provider_catalog.go` | `Mailstandard/provider_package_catalog.go` | `Mailstandard/provider_activation_catalog.go` | `Mailstandard/capability_catalog.go` | `Mailstandard/provider_extension_catalog.go` | `Mailstandard/provider_selection.go` |
| Python | `sdkwork_mail_sdk/provider_catalog.py` | `sdkwork_mail_sdk/provider_package_catalog.py` | `sdkwork_mail_sdk/provider_activation_catalog.py` | `sdkwork_mail_sdk/capability_catalog.py` | `sdkwork_mail_sdk/provider_extension_catalog.py` | `sdkwork_mail_sdk/provider_selection.py` |

## Reserved Language Resolution Scaffold Matrix

| Language | Driver manager | Data source | Provider support | Provider package loader |
| --- | --- | --- | --- | --- |
| Flutter | `lib/src/mail_driver_manager.dart` | `lib/src/mail_data_source.dart` | `lib/src/mail_provider_support.dart` | `lib/src/mail_provider_package_loader.dart` |
| Rust | `src/driver_manager.rs` | `src/data_source.rs` | `src/provider_support.rs` | `src/provider_package_loader.rs` |
| Java | `src/main/java/com/sdkwork/Mail/metadata/MailDriverManager.java` | `src/main/java/com/sdkwork/Mail/metadata/MailDataSource.java` | `src/main/java/com/sdkwork/Mail/metadata/MailProviderSupport.java` | `src/main/java/com/sdkwork/Mail/metadata/MailProviderPackageLoader.java` |
| C# | `src/SDKWork.Mail.Sdk/MailDriverManager.cs` | `src/SDKWork.Mail.Sdk/MailDataSource.cs` | `src/SDKWork.Mail.Sdk/MailProviderSupport.cs` | `src/SDKWork.Mail.Sdk/MailProviderPackageLoader.cs` |
| Swift | `Sources/MailSdk/MailDriverManager.swift` | `Sources/MailSdk/MailDataSource.swift` | `Sources/MailSdk/MailProviderSupport.swift` | `Sources/MailSdk/MailProviderPackageLoader.swift` |
| Kotlin | `src/main/kotlin/com/sdkwork/Mail/metadata/MailDriverManager.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailDataSource.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailProviderSupport.kt` | `src/main/kotlin/com/sdkwork/Mail/metadata/MailProviderPackageLoader.kt` |
| Go | `Mailstandard/driver_manager.go` | `Mailstandard/data_source.go` | `Mailstandard/provider_support.go` | `Mailstandard/provider_package_loader.go` |
| Python | `sdkwork_mail_sdk/driver_manager.py` | `sdkwork_mail_sdk/data_source.py` | `sdkwork_mail_sdk/provider_support.py` | `sdkwork_mail_sdk/provider_package_loader.py` |

## Reserved Language Provider Package Scaffold Matrix

| Language | Scaffold path | Directory pattern | Package pattern | Manifest file name | Readme file name | Source file pattern | Source symbol pattern | Template tokens | Source template tokens | Status | Runtime bridge status | Root public | Default provider package identity | Default provider manifest path | Default provider README path | Default provider source path | Default provider source symbol |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Flutter | `providers/provider-package-scaffold.md` | `providers/mail_sdk_provider_{providerKey}` | `mail_sdk_provider_{providerKey}` | `pubspec.yaml` | `README.md` | `lib/src/mail_provider_{providerKey}_package_contract.dart` | `MailProvider{providerPascal}PackageContract` | `{providerKey}` | `{providerKey}`, `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `mail_sdk_provider_volcengine` | `providers/mail_sdk_provider_volcengine/pubspec.yaml` | `providers/mail_sdk_provider_volcengine/README.md` | `providers/mail_sdk_provider_volcengine/lib/src/mail_provider_volcengine_package_contract.dart` | `MailProviderVolcenginePackageContract` |
| Rust | `providers/provider-package-scaffold.md` | `providers/Mail-sdk-provider-{providerKey}` | `Mail-sdk-provider-{providerKey}` | `Cargo.toml` | `README.md` | `src/lib.rs` | `MailProvider{providerPascal}PackageContract` | `{providerKey}` | `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/Cargo.toml` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/src/lib.rs` | `MailProviderVolcenginePackageContract` |
| Java | `providers/provider-package-scaffold.md` | `providers/Mail-sdk-provider-{providerKey}` | `com.sdkwork:Mail-sdk-provider-{providerKey}` | `pom.xml` | `README.md` | `src/main/java/com/sdkwork/Mail/provider/{providerKey}/MailProvider{providerPascal}PackageContract.java` | `MailProvider{providerPascal}PackageContract` | `{providerKey}` | `{providerKey}`, `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `com.sdkwork:Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/pom.xml` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/src/main/java/com/sdkwork/Mail/provider/volcengine/MailProviderVolcenginePackageContract.java` | `MailProviderVolcenginePackageContract` |
| C# | `providers/provider-package-scaffold.md` | `providers/Sdkwork.Mail.Sdk.Provider.{providerPascal}` | `Sdkwork.Mail.Sdk.Provider.{providerPascal}` | `Sdkwork.Mail.Sdk.Provider.{providerPascal}.csproj` | `README.md` | `src/MailProvider{providerPascal}PackageContract.cs` | `MailProvider{providerPascal}PackageContract` | `{providerPascal}` | `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `Sdkwork.Mail.Sdk.Provider.Volcengine` | `providers/Sdkwork.Mail.Sdk.Provider.Volcengine/Sdkwork.Mail.Sdk.Provider.Volcengine.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Volcengine/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Volcengine/src/MailProviderVolcenginePackageContract.cs` | `MailProviderVolcenginePackageContract` |
| Swift | `providers/provider-package-scaffold.md` | `Providers/MailSdkProvider{providerPascal}` | `MailSdkProvider{providerPascal}` | `Package.swift` | `README.md` | `Sources/MailSdkProvider{providerPascal}/MailProvider{providerPascal}PackageContract.swift` | `MailProvider{providerPascal}PackageContract` | `{providerPascal}` | `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `MailSdkProviderVolcengine` | `Providers/MailSdkProviderVolcengine/Package.swift` | `Providers/MailSdkProviderVolcengine/README.md` | `Providers/MailSdkProviderVolcengine/Sources/MailSdkProviderVolcengine/MailProviderVolcenginePackageContract.swift` | `MailProviderVolcenginePackageContract` |
| Kotlin | `providers/provider-package-scaffold.md` | `providers/Mail-sdk-provider-{providerKey}` | `com.sdkwork:Mail-sdk-provider-{providerKey}` | `build.gradle.kts` | `README.md` | `src/main/kotlin/com/sdkwork/Mail/provider/{providerKey}/MailProvider{providerPascal}PackageContract.kt` | `MailProvider{providerPascal}PackageContract` | `{providerKey}` | `{providerKey}`, `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `com.sdkwork:Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/build.gradle.kts` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/src/main/kotlin/com/sdkwork/Mail/provider/volcengine/MailProviderVolcenginePackageContract.kt` | `MailProviderVolcenginePackageContract` |
| Go | `providers/provider-package-scaffold.md` | `providers/Mail-sdk-provider-{providerKey}` | `github.com/sdkwork/Mail-sdk-provider-{providerKey}` | `go.mod` | `README.md` | `provider_package_contract.go` | `MailProvider{providerPascal}PackageContract` | `{providerKey}` | `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `github.com/sdkwork/Mail-sdk-provider-volcengine` | `providers/Mail-sdk-provider-volcengine/go.mod` | `providers/Mail-sdk-provider-volcengine/README.md` | `providers/Mail-sdk-provider-volcengine/provider_package_contract.go` | `MailProviderVolcenginePackageContract` |
| Python | `providers/provider-package-scaffold.md` | `providers/sdkwork_mail_sdk_provider_{providerKey}` | `sdkwork-mail-sdk-provider-{providerKey}` | `pyproject.toml` | `README.md` | `sdkwork_mail_sdk_provider_{providerKey}/__init__.py` | `MailProvider{providerPascal}PackageContract` | `{providerKey}` | `{providerKey}`, `{providerPascal}` | `future-runtime-bridge-only` | `reserved` | `false` | `sdkwork-mail-sdk-provider-volcengine` | `providers/sdkwork_mail_sdk_provider_volcengine/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_volcengine/README.md` | `providers/sdkwork_mail_sdk_provider_volcengine/sdkwork_mail_sdk_provider_volcengine/__init__.py` | `MailProviderVolcenginePackageContract` |

## Language Provider Activation Matrix

| Language | Provider key | Activation status | Runtime bridge | Root public | Package boundary |
| --- | --- | --- | --- | --- | --- |
| TypeScript | `volcengine` | `package-boundary` | Yes | No | Yes |
| TypeScript | `aliyun` | `package-boundary` | Yes | No | Yes |
| TypeScript | `tencent` | `package-boundary` | Yes | No | Yes |
| TypeScript | `agora` | `package-boundary` | Yes | No | Yes |
| TypeScript | `zego` | `package-boundary` | Yes | No | Yes |
| TypeScript | `livekit` | `package-boundary` | Yes | No | Yes |
| TypeScript | `twilio` | `package-boundary` | Yes | No | Yes |
| TypeScript | `jitsi` | `package-boundary` | Yes | No | Yes |
| TypeScript | `janus` | `package-boundary` | Yes | No | Yes |
| TypeScript | `mediasoup` | `package-boundary` | Yes | No | Yes |
| Flutter | `volcengine` | `package-boundary` | Yes | No | Yes |
| Flutter | `aliyun` | `control-metadata-only` | No | No | No |
| Flutter | `tencent` | `control-metadata-only` | No | No | No |
| Flutter | `agora` | `control-metadata-only` | No | No | No |
| Flutter | `zego` | `control-metadata-only` | No | No | No |
| Flutter | `livekit` | `control-metadata-only` | No | No | No |
| Flutter | `twilio` | `control-metadata-only` | No | No | No |
| Flutter | `jitsi` | `control-metadata-only` | No | No | No |
| Flutter | `janus` | `control-metadata-only` | No | No | No |
| Flutter | `mediasoup` | `control-metadata-only` | No | No | No |
| Rust | `volcengine` | `control-metadata-only` | No | No | No |
| Rust | `aliyun` | `control-metadata-only` | No | No | No |
| Rust | `tencent` | `control-metadata-only` | No | No | No |
| Rust | `agora` | `control-metadata-only` | No | No | No |
| Rust | `zego` | `control-metadata-only` | No | No | No |
| Rust | `livekit` | `control-metadata-only` | No | No | No |
| Rust | `twilio` | `control-metadata-only` | No | No | No |
| Rust | `jitsi` | `control-metadata-only` | No | No | No |
| Rust | `janus` | `control-metadata-only` | No | No | No |
| Rust | `mediasoup` | `control-metadata-only` | No | No | No |
| Java | `volcengine` | `control-metadata-only` | No | No | No |
| Java | `aliyun` | `control-metadata-only` | No | No | No |
| Java | `tencent` | `control-metadata-only` | No | No | No |
| Java | `agora` | `control-metadata-only` | No | No | No |
| Java | `zego` | `control-metadata-only` | No | No | No |
| Java | `livekit` | `control-metadata-only` | No | No | No |
| Java | `twilio` | `control-metadata-only` | No | No | No |
| Java | `jitsi` | `control-metadata-only` | No | No | No |
| Java | `janus` | `control-metadata-only` | No | No | No |
| Java | `mediasoup` | `control-metadata-only` | No | No | No |
| C# | `volcengine` | `control-metadata-only` | No | No | No |
| C# | `aliyun` | `control-metadata-only` | No | No | No |
| C# | `tencent` | `control-metadata-only` | No | No | No |
| C# | `agora` | `control-metadata-only` | No | No | No |
| C# | `zego` | `control-metadata-only` | No | No | No |
| C# | `livekit` | `control-metadata-only` | No | No | No |
| C# | `twilio` | `control-metadata-only` | No | No | No |
| C# | `jitsi` | `control-metadata-only` | No | No | No |
| C# | `janus` | `control-metadata-only` | No | No | No |
| C# | `mediasoup` | `control-metadata-only` | No | No | No |
| Swift | `volcengine` | `control-metadata-only` | No | No | No |
| Swift | `aliyun` | `control-metadata-only` | No | No | No |
| Swift | `tencent` | `control-metadata-only` | No | No | No |
| Swift | `agora` | `control-metadata-only` | No | No | No |
| Swift | `zego` | `control-metadata-only` | No | No | No |
| Swift | `livekit` | `control-metadata-only` | No | No | No |
| Swift | `twilio` | `control-metadata-only` | No | No | No |
| Swift | `jitsi` | `control-metadata-only` | No | No | No |
| Swift | `janus` | `control-metadata-only` | No | No | No |
| Swift | `mediasoup` | `control-metadata-only` | No | No | No |
| Kotlin | `volcengine` | `control-metadata-only` | No | No | No |
| Kotlin | `aliyun` | `control-metadata-only` | No | No | No |
| Kotlin | `tencent` | `control-metadata-only` | No | No | No |
| Kotlin | `agora` | `control-metadata-only` | No | No | No |
| Kotlin | `zego` | `control-metadata-only` | No | No | No |
| Kotlin | `livekit` | `control-metadata-only` | No | No | No |
| Kotlin | `twilio` | `control-metadata-only` | No | No | No |
| Kotlin | `jitsi` | `control-metadata-only` | No | No | No |
| Kotlin | `janus` | `control-metadata-only` | No | No | No |
| Kotlin | `mediasoup` | `control-metadata-only` | No | No | No |
| Go | `volcengine` | `control-metadata-only` | No | No | No |
| Go | `aliyun` | `control-metadata-only` | No | No | No |
| Go | `tencent` | `control-metadata-only` | No | No | No |
| Go | `agora` | `control-metadata-only` | No | No | No |
| Go | `zego` | `control-metadata-only` | No | No | No |
| Go | `livekit` | `control-metadata-only` | No | No | No |
| Go | `twilio` | `control-metadata-only` | No | No | No |
| Go | `jitsi` | `control-metadata-only` | No | No | No |
| Go | `janus` | `control-metadata-only` | No | No | No |
| Go | `mediasoup` | `control-metadata-only` | No | No | No |
| Python | `volcengine` | `control-metadata-only` | No | No | No |
| Python | `aliyun` | `control-metadata-only` | No | No | No |
| Python | `tencent` | `control-metadata-only` | No | No | No |
| Python | `agora` | `control-metadata-only` | No | No | No |
| Python | `zego` | `control-metadata-only` | No | No | No |
| Python | `livekit` | `control-metadata-only` | No | No | No |
| Python | `twilio` | `control-metadata-only` | No | No | No |
| Python | `jitsi` | `control-metadata-only` | No | No | No |
| Python | `janus` | `control-metadata-only` | No | No | No |
| Python | `mediasoup` | `control-metadata-only` | No | No | No |

## Reading Rules

- TypeScript and Flutter are the executable reference baselines in the current landing.
- The remaining official language workspaces are materialized reserved boundaries so the standard stays explicit.
- A provider package boundary may stay reserved even when the root workspace already has a verified runtime bridge.
- A workspace or provider package must not advertise runtime bridge support until it has a verified native bridge.
