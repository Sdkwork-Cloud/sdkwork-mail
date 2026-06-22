# C# Provider Package Scaffold

Reserved provider package scaffold for future C# Mail adapters.

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
| `smtp` | `Smtp` | `Sdkwork.Mail.Sdk.Provider.Smtp` | `providers/Sdkwork.Mail.Sdk.Provider.Smtp` | `providers/Sdkwork.Mail.Sdk.Provider.Smtp/Sdkwork.Mail.Sdk.Provider.Smtp.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Smtp/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Smtp/src/MailProviderSmtpPackageContract.cs` | `MailProviderSmtpPackageContract` |
| `imap` | `Imap` | `Sdkwork.Mail.Sdk.Provider.Imap` | `providers/Sdkwork.Mail.Sdk.Provider.Imap` | `providers/Sdkwork.Mail.Sdk.Provider.Imap/Sdkwork.Mail.Sdk.Provider.Imap.csproj` | `providers/Sdkwork.Mail.Sdk.Provider.Imap/README.md` | `providers/Sdkwork.Mail.Sdk.Provider.Imap/src/MailProviderImapPackageContract.cs` | `MailProviderImapPackageContract` |
