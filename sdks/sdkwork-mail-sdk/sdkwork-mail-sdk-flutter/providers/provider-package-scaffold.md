# Flutter Provider Package Scaffold

Reserved provider package scaffold for future Flutter Mail adapters.

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
| `smtp` | `Smtp` | `mail_sdk_provider_smtp` | `providers/mail_sdk_provider_smtp` | `providers/mail_sdk_provider_smtp/pubspec.yaml` | `providers/mail_sdk_provider_smtp/README.md` | `providers/mail_sdk_provider_smtp/lib/src/mail_provider_smtp_package_contract.dart` | `MailProviderSmtpPackageContract` |
| `imap` | `Imap` | `mail_sdk_provider_imap` | `providers/mail_sdk_provider_imap` | `providers/mail_sdk_provider_imap/pubspec.yaml` | `providers/mail_sdk_provider_imap/README.md` | `providers/mail_sdk_provider_imap/lib/src/mail_provider_imap_package_contract.dart` | `MailProviderImapPackageContract` |
