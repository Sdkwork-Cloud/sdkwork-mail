# SDKWork Mail SDK Java Workspace

Language: `java`

Planned public package:

- `com.sdkwork:Mail-sdk`

Current boundary:

- control SDK support: yes
- runtime bridge support: reserved
- maturity tier: reserved

Current role:

- Reserved workspace skeleton
- provider metadata and driver selection standards
- reserved Java language boundary for future enterprise runtime integration
- no runtime bridge is claimed in the current landing
- code-level MailStandardContract scaffold keeps provider-neutral core abstractions fixed before runtime bridge landing
- metadata scaffold fixes provider catalog, capability catalog, provider extension catalog, and provider selection skeleton boundaries before runtime bridge landing
- resolution scaffold fixes metadata-only driver manager, data source, provider support, and provider package loader boundaries before runtime bridge landing

This workspace is the reserved Java standard boundary for provider metadata, driver selection, and future enterprise runtime integration.

Default provider contract:

- default provider key: `smtp`
- default plugin id: `Mail-smtp`
- default driver id: `sdkwork-mail-driver-smtp`
- language metadata and selection scaffolds must preserve that assembly-driven default
  provider identity for future runtime bridge landings


Language workspace catalog:

- workspace catalog: `src/main/java/com/sdkwork/Mail/metadata/MailLanguageWorkspaceCatalog.java`
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

- build system: maven
- manifest: `pom.xml`
- contract scaffold: `src/main/java/com/sdkwork/Mail/standard/MailStandardContract.java`


Metadata scaffold:

- provider catalog: `src/main/java/com/sdkwork/Mail/metadata/MailProviderCatalog.java`
- provider package catalog: `src/main/java/com/sdkwork/Mail/metadata/MailProviderPackageCatalog.java`
- provider activation catalog: `src/main/java/com/sdkwork/Mail/metadata/MailProviderActivationCatalog.java`
- capability catalog: `src/main/java/com/sdkwork/Mail/metadata/MailCapabilityCatalog.java`
- provider extension catalog: `src/main/java/com/sdkwork/Mail/metadata/MailProviderExtensionCatalog.java`
- provider selection: `src/main/java/com/sdkwork/Mail/metadata/MailProviderSelection.java`
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

- driver manager: `src/main/java/com/sdkwork/Mail/metadata/MailDriverManager.java`
- data source: `src/main/java/com/sdkwork/Mail/metadata/MailDataSource.java`
- provider support: `src/main/java/com/sdkwork/Mail/metadata/MailProviderSupport.java`
- provider package loader: `src/main/java/com/sdkwork/Mail/metadata/MailProviderPackageLoader.java`


Provider package scaffold:

- scaffold: `providers/provider-package-scaffold.md`
- directory pattern: `providers/Mail-sdk-provider-{providerKey}`
- package pattern: `com.sdkwork:Mail-sdk-provider-{providerKey}`
- manifest file name: `pom.xml`
- readme file name: `README.md`
- source file pattern: `src/main/java/com/sdkwork/Mail/provider/{providerKey}/MailProvider{providerPascal}PackageContract.java`
- source symbol pattern: `MailProvider{providerPascal}PackageContract`
- template tokens: `{providerKey}`
- source template tokens: `{providerKey}`, `{providerPascal}`
- status: `future-runtime-bridge-only`
- runtime bridge status: `reserved`
- root public exposure: `false`


Standards references:

- `../docs/provider-adapter-standard.md`
- `../docs/multilanguage-capability-matrix.md`
