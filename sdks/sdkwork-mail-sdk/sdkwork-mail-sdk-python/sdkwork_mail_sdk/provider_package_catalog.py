from dataclasses import dataclass


@dataclass(frozen=True)
class MailProviderPackageCatalogEntry:
    providerKey: str
    pluginId: str
    driverId: str
    packageIdentity: str
    manifestPath: str
    readmePath: str
    sourcePath: str
    sourceSymbol: str
    builtin: bool
    rootPublic: bool
    status: str
    runtimeBridgeStatus: str


class MailProviderPackageCatalog:
    entries = [
        MailProviderPackageCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "sdkwork-mail-sdk-provider-smtp", "providers/sdkwork_mail_sdk_provider_smtp/pyproject.toml", "providers/sdkwork_mail_sdk_provider_smtp/README.md", "providers/sdkwork_mail_sdk_provider_smtp/sdkwork_mail_sdk_provider_smtp/__init__.py", "MailProviderSmtpPackageContract", True, False, "future-runtime-bridge-only", "reserved"),
        MailProviderPackageCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", "sdkwork-mail-sdk-provider-imap", "providers/sdkwork_mail_sdk_provider_imap/pyproject.toml", "providers/sdkwork_mail_sdk_provider_imap/README.md", "providers/sdkwork_mail_sdk_provider_imap/sdkwork_mail_sdk_provider_imap/__init__.py", "MailProviderImapPackageContract", True, False, "future-runtime-bridge-only", "reserved"),
    ]


def get_mail_provider_package_by_provider_key(provider_key: str) -> Optional[MailProviderPackageCatalogEntry]:
    for entry in MailProviderPackageCatalog.entries:
        if entry.providerKey == provider_key:
            return entry

    return None


def get_mail_provider_package_by_package_identity(package_identity: str) -> Optional[MailProviderPackageCatalogEntry]:
    for entry in MailProviderPackageCatalog.entries:
        if entry.packageIdentity == package_identity:
            return entry

    return None
