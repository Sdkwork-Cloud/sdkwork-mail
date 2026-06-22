# Python Provider Package Scaffold

Reserved provider package scaffold for future Python Mail adapters.

- directory pattern: `providers/sdkwork_mail_sdk_provider_{providerKey}`
- package pattern: `sdkwork-mail-sdk-provider-{providerKey}`
- manifest file name: `pyproject.toml`
- readme file name: `README.md`
- source file pattern: `sdkwork_mail_sdk_provider_{providerKey}/__init__.py`
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
| `smtp` | `Smtp` | `sdkwork-mail-sdk-provider-smtp` | `providers/sdkwork_mail_sdk_provider_smtp` | `providers/sdkwork_mail_sdk_provider_smtp/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_smtp/README.md` | `providers/sdkwork_mail_sdk_provider_smtp/sdkwork_mail_sdk_provider_smtp/__init__.py` | `MailProviderSmtpPackageContract` |
| `imap` | `Imap` | `sdkwork-mail-sdk-provider-imap` | `providers/sdkwork_mail_sdk_provider_imap` | `providers/sdkwork_mail_sdk_provider_imap/pyproject.toml` | `providers/sdkwork_mail_sdk_provider_imap/README.md` | `providers/sdkwork_mail_sdk_provider_imap/sdkwork_mail_sdk_provider_imap/__init__.py` | `MailProviderImapPackageContract` |
