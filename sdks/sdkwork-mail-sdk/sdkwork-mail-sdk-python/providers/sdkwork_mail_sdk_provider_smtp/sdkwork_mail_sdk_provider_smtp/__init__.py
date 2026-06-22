"""Metadata-only provider package scaffold. No runtime bridge is implemented here yet."""


class MailProviderSmtpPackageContract:
    provider_key = "smtp"
    plugin_id = "Mail-smtp"
    driver_id = "sdkwork-mail-driver-smtp"
    package_identity = "sdkwork-mail-sdk-provider-smtp"
    status = "future-runtime-bridge-only"
    runtime_bridge_status = "reserved"
    root_public = False


__all__ = ["MailProviderSmtpPackageContract"]
