from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MailCapabilityCatalogEntry:
    capabilityKey: str
    category: str
    surface: str


class MailCapabilityCatalog:
    entries = [
        MailCapabilityCatalogEntry("transport.connect", "required-baseline", "control-plane"),
        MailCapabilityCatalogEntry("transport.authenticate", "required-baseline", "control-plane"),
        MailCapabilityCatalogEntry("health", "required-baseline", "control-plane"),
        MailCapabilityCatalogEntry("smtp.send", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("imap.sync", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("imap.folder-sync", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("imap.message-sync", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("transport.retry", "optional-advanced", "control-plane"),
        MailCapabilityCatalogEntry("transport.pool", "optional-advanced", "control-plane"),
    ]


def get_mail_capability_catalog() -> list[MailCapabilityCatalogEntry]:
    return MailCapabilityCatalog.entries


def get_mail_capability_descriptor(capability_key: str) -> Optional[MailCapabilityCatalogEntry]:
    for entry in MailCapabilityCatalog.entries:
        if entry.capabilityKey == capability_key:
            return entry

    return None
