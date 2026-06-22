# SDKWork Mail SDK Swift Workspace

Language: `swift`

Planned public package:

- `MailSdk`

Current boundary:

- control SDK support: yes
- runtime bridge support: reserved
- maturity tier: reserved

Current role:

- Reserved workspace skeleton
- provider metadata and driver selection standards
- reserved Swift language boundary for iOS or macOS runtime bridge integration
- no runtime bridge is claimed in the current landing
- code-level MailStandardContract scaffold keeps provider-neutral core abstractions fixed before runtime bridge landing
- metadata scaffold fixes provider catalog, capability catalog, provider extension catalog, and provider selection skeleton boundaries before runtime bridge landing
- resolution scaffold fixes metadata-only driver manager, data source, provider support, and provider package loader boundaries before runtime bridge landing

This workspace is the reserved Swift standard boundary for provider metadata, driver selection, and future iOS or macOS runtime bridge integration.

Default provider contract:

- default provider key: `volcengine`
- default plugin id: `Mail-volcengine`
- default driver id: `sdkwork-mail-driver-volcengine`
- language metadata and selection scaffolds must preserve that assembly-driven default
  provider identity for future runtime bridge landings


Language workspace catalog:

- workspace catalog: `Sources/MailSdk/MailLanguageWorkspaceCatalog.swift`
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



Provider package boundary:

- mode: `scaffold-per-provider-package`
- root public policy: `none`
- lifecycle status terms: `future-runtime-bridge-only`
- runtime bridge status terms: `reserved`


Package scaffold:

- build system: swift-package-manager
- manifest: `Package.swift`
- contract scaffold: `Sources/MailSdk/MailStandardContract.swift`


Metadata scaffold:

- provider catalog: `Sources/MailSdk/MailProviderCatalog.swift`
- provider package catalog: `Sources/MailSdk/MailProviderPackageCatalog.swift`
- provider activation catalog: `Sources/MailSdk/MailProviderActivationCatalog.swift`
- capability catalog: `Sources/MailSdk/MailCapabilityCatalog.swift`
- provider extension catalog: `Sources/MailSdk/MailProviderExtensionCatalog.swift`
- provider selection: `Sources/MailSdk/MailProviderSelection.swift`
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

- driver manager: `Sources/MailSdk/MailDriverManager.swift`
- data source: `Sources/MailSdk/MailDataSource.swift`
- provider support: `Sources/MailSdk/MailProviderSupport.swift`
- provider package loader: `Sources/MailSdk/MailProviderPackageLoader.swift`


Provider package scaffold:

- scaffold: `providers/provider-package-scaffold.md`
- directory pattern: `Providers/MailSdkProvider{providerPascal}`
- package pattern: `MailSdkProvider{providerPascal}`
- manifest file name: `Package.swift`
- readme file name: `README.md`
- source file pattern: `Sources/MailSdkProvider{providerPascal}/MailProvider{providerPascal}PackageContract.swift`
- source symbol pattern: `MailProvider{providerPascal}PackageContract`
- template tokens: `{providerPascal}`
- source template tokens: `{providerPascal}`
- status: `future-runtime-bridge-only`
- runtime bridge status: `reserved`
- root public exposure: `false`


Standards references:

- `../docs/provider-adapter-standard.md`
- `../docs/multilanguage-capability-matrix.md`
