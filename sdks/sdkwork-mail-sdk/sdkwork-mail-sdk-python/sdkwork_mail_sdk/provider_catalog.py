from dataclasses import dataclass
from typing import Optional


DEFAULT_mail_PROVIDER_KEY = "smtp"


@dataclass(frozen=True)
class MailProviderCatalogEntry:
    providerKey: str
    pluginId: str
    driverId: str
    defaultSelected: bool


class MailProviderCatalog:
    entries = [
        MailProviderCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", True),
        MailProviderCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", False),
    ]


def get_mail_provider_by_provider_key(provider_key: str) -> Optional[MailProviderCatalogEntry]:
    for entry in MailProviderCatalog.entries:
        if entry.providerKey == provider_key:
            return entry

    return None
