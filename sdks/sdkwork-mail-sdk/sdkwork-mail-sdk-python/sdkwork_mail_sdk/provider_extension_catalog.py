from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class MailProviderExtensionCatalogEntry:
    extensionKey: str
    providerKey: str
    displayName: str
    surface: str
    access: str
    status: str


class MailProviderExtensionCatalog:
    recognizedSurfaces = [
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    ]

    recognizedAccessModes = [
        "unwrap-only",
        "extension-object",
    ]

    recognizedStatuses = [
        "reference-baseline",
        "reserved",
    ]

    entries = [
        MailProviderExtensionCatalogEntry("smtp.transport", "smtp", "SMTP Transport", "runtime-bridge", "unwrap-only", "reserved"),
        MailProviderExtensionCatalogEntry("imap.sync", "imap", "IMAP Sync", "runtime-bridge", "unwrap-only", "reserved"),
    ]


def get_mail_provider_extension_catalog() -> list[MailProviderExtensionCatalogEntry]:
    return MailProviderExtensionCatalog.entries


def get_mail_provider_extension_descriptor(
    extension_key: str,
) -> Optional[MailProviderExtensionCatalogEntry]:
    for entry in MailProviderExtensionCatalog.entries:
        if entry.extensionKey == extension_key:
            return entry

    return None


def get_mail_provider_extensions_for_provider(
    provider_key: str,
) -> list[MailProviderExtensionCatalogEntry]:
    return [
        entry for entry in MailProviderExtensionCatalog.entries if entry.providerKey == provider_key
    ]


def get_mail_provider_extensions(
    extension_keys: list[str],
) -> list[MailProviderExtensionCatalogEntry]:
    entries: list[MailProviderExtensionCatalogEntry] = []
    for extension_key in extension_keys:
        entry = get_mail_provider_extension_descriptor(extension_key)
        if entry is not None:
            entries.append(entry)

    return entries


def has_mail_provider_extension(extension_keys: list[str], extension_key: str) -> bool:
    return extension_key in extension_keys and get_mail_provider_extension_descriptor(extension_key) is not None
