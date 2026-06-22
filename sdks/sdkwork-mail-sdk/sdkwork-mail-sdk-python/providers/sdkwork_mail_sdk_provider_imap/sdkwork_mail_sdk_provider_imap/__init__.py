"""Metadata-only provider package scaffold. No runtime bridge is implemented here yet."""


class MailProviderImapPackageContract:
    provider_key = "imap"
    plugin_id = "Mail-imap"
    driver_id = "sdkwork-mail-driver-imap"
    package_identity = "sdkwork-mail-sdk-provider-imap"
    status = "future-runtime-bridge-only"
    runtime_bridge_status = "reserved"
    root_public = False


__all__ = ["MailProviderImapPackageContract"]
