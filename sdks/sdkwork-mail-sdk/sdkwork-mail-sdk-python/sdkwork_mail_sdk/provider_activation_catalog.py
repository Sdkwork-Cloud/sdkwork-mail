from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MailProviderActivationCatalogEntry:
    providerKey: str
    pluginId: str
    driverId: str
    activationStatus: str
    runtimeBridge: bool
    rootPublic: bool
    packageBoundary: bool
    builtin: bool
    packageIdentity: str


class MailProviderActivationCatalog:
    recognizedActivationStatuses = [
        "package-boundary",
        "control-metadata-only",
    ]

    entries = [
        MailProviderActivationCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "package-boundary", True, False, True, True, "sdkwork-mail-sdk-provider-smtp"),
        MailProviderActivationCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", "package-boundary", True, False, True, True, "sdkwork-mail-sdk-provider-imap"),
    ]


def get_mail_provider_activation_by_provider_key(provider_key: str) -> Optional[MailProviderActivationCatalogEntry]:
    for entry in MailProviderActivationCatalog.entries:
        if entry.providerKey == provider_key:
            return entry

    return None
