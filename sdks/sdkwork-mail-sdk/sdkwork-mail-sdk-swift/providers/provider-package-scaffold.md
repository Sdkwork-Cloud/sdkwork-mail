# Swift Provider Package Scaffold

Reserved provider package scaffold for future Swift Mail adapters.

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

Rules:

- one provider per package boundary
- bind each package to one official providerKey from the assembly-driven provider catalog
- preserve providerKey, pluginId, and driverId alignment with the official provider catalog
- wrap the official vendor SDK instead of re-implementing media runtime
- materialize one metadata-only source stub per provider package boundary before runtime bridge work lands
- keep the package outside the workspace root public API until a verified runtime bridge lands
- keep the status fixed at `future-runtime-bridge-only` until a language-specific runtime bridge is verified
- keep runtime bridge status fixed at `reserved` until the provider package becomes executable
- keep root public exposure fixed at `false` until the provider becomes a verified builtin baseline

| Provider key | Provider pascal | Package identity | Directory path | Manifest path | README path | Source path | Source symbol |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `smtp` | `Smtp` | `MailSdkProviderSmtp` | `Providers/MailSdkProviderSmtp` | `Providers/MailSdkProviderSmtp/Package.swift` | `Providers/MailSdkProviderSmtp/README.md` | `Providers/MailSdkProviderSmtp/Sources/MailSdkProviderSmtp/MailProviderSmtpPackageContract.swift` | `MailProviderSmtpPackageContract` |
| `imap` | `Imap` | `MailSdkProviderImap` | `Providers/MailSdkProviderImap` | `Providers/MailSdkProviderImap/Package.swift` | `Providers/MailSdkProviderImap/README.md` | `Providers/MailSdkProviderImap/Sources/MailSdkProviderImap/MailProviderImapPackageContract.swift` | `MailProviderImapPackageContract` |
