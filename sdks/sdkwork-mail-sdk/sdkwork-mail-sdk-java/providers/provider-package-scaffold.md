# Java Provider Package Scaffold

Reserved provider package scaffold for future Java Mail adapters.

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
| `smtp` | `Smtp` | `com.sdkwork:Mail-sdk-provider-smtp` | `providers/Mail-sdk-provider-smtp` | `providers/Mail-sdk-provider-smtp/pom.xml` | `providers/Mail-sdk-provider-smtp/README.md` | `providers/Mail-sdk-provider-smtp/src/main/java/com/sdkwork/Mail/provider/smtp/MailProviderSmtpPackageContract.java` | `MailProviderSmtpPackageContract` |
| `imap` | `Imap` | `com.sdkwork:Mail-sdk-provider-imap` | `providers/Mail-sdk-provider-imap` | `providers/Mail-sdk-provider-imap/pom.xml` | `providers/Mail-sdk-provider-imap/README.md` | `providers/Mail-sdk-provider-imap/src/main/java/com/sdkwork/Mail/provider/imap/MailProviderImapPackageContract.java` | `MailProviderImapPackageContract` |
