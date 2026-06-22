# SDKWork Mail SDK C# Workspace

Language: `csharp`

Planned public package:

- `Sdkwork.Mail.Sdk`

Current boundary:

- control SDK support: yes
- runtime bridge support: reserved
- maturity tier: reserved

Current role:

- Reserved workspace skeleton
- provider metadata and driver selection standards
- reserved C# language boundary for desktop or server-side control integration
- no runtime bridge is claimed in the current landing
- code-level MailStandardContract scaffold keeps provider-neutral core abstractions fixed before runtime bridge landing
- metadata scaffold fixes provider catalog, capability catalog, provider extension catalog, and provider selection skeleton boundaries before runtime bridge landing
- resolution scaffold fixes metadata-only driver manager, data source, provider support, and provider package loader boundaries before runtime bridge landing

This workspace is the reserved C# standard boundary for provider metadata, driver selection, and future desktop or server-side control integration.

Default provider contract:

- default provider key: `volcengine`
- default plugin id: `Mail-volcengine`
- default driver id: `sdkwork-mail-driver-volcengine`
- language metadata and selection scaffolds must preserve that assembly-driven default
  provider identity for future runtime bridge landings


Language workspace catalog:

- workspace catalog: `src/SDKWork.Mail.Sdk/MailLanguageWorkspaceCatalog.cs`
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

- build system: dotnet-sdk
- manifest: `src/SDKWork.Mail.Sdk/SDKWork.Mail.Sdk.csproj`
- contract scaffold: `src/SDKWork.Mail.Sdk/MailStandardContract.cs`


Metadata scaffold:

- provider catalog: `src/SDKWork.Mail.Sdk/MailProviderCatalog.cs`
- provider package catalog: `src/SDKWork.Mail.Sdk/MailProviderPackageCatalog.cs`
- provider activation catalog: `src/SDKWork.Mail.Sdk/MailProviderActivationCatalog.cs`
- capability catalog: `src/SDKWork.Mail.Sdk/MailCapabilityCatalog.cs`
- provider extension catalog: `src/SDKWork.Mail.Sdk/MailProviderExtensionCatalog.cs`
- provider selection: `src/SDKWork.Mail.Sdk/MailProviderSelection.cs`
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

- driver manager: `src/SDKWork.Mail.Sdk/MailDriverManager.cs`
- data source: `src/SDKWork.Mail.Sdk/MailDataSource.cs`
- provider support: `src/SDKWork.Mail.Sdk/MailProviderSupport.cs`
- provider package loader: `src/SDKWork.Mail.Sdk/MailProviderPackageLoader.cs`


Provider package scaffold:

- scaffold: `providers/provider-package-scaffold.md`
- directory pattern: `providers/Sdkwork.Mail.Sdk.Provider.{providerPascal}`
- package pattern: `Sdkwork.Mail.Sdk.Provider.{providerPascal}`
- manifest file name: `Sdkwork.Mail.Sdk.Provider.{providerPascal}.csproj`
- readme file name: `README.md`
- source file pattern: `src/MailProvider{providerPascal}PackageContract.cs`
- source symbol pattern: `MailProvider{providerPascal}PackageContract`
- template tokens: `{providerPascal}`
- source template tokens: `{providerPascal}`
- status: `future-runtime-bridge-only`
- runtime bridge status: `reserved`
- root public exposure: `false`


Standards references:

- `../docs/provider-adapter-standard.md`
- `../docs/multilanguage-capability-matrix.md`
