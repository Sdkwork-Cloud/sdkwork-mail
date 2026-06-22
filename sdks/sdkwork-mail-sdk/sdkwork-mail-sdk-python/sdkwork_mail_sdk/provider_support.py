from dataclasses import dataclass
from enum import Enum


class MailProviderSupportStatus(str, Enum):
    builtin_registered = "builtin_registered"
    official_registered = "official_registered"
    official_unregistered = "official_unregistered"
    unknown = "unknown"


@dataclass(frozen=True)
class MailProviderSupport:
    providerKey: str
    status: MailProviderSupportStatus
    builtin: bool
    official: bool
    registered: bool


@dataclass(frozen=True)
class MailProviderSupportStateRequest:
    providerKey: str
    builtin: bool
    official: bool
    registered: bool


mail_PROVIDER_SUPPORT_STATUSES = [
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
]


def resolve_mail_provider_support_status(
    request: MailProviderSupportStateRequest,
) -> MailProviderSupportStatus:
    if request.official and request.registered:
        return (
            MailProviderSupportStatus.builtin_registered
            if request.builtin
            else MailProviderSupportStatus.official_registered
        )

    if request.official:
        return MailProviderSupportStatus.official_unregistered

    return MailProviderSupportStatus.unknown


def create_mail_provider_support_state(
    request: MailProviderSupportStateRequest,
) -> MailProviderSupport:
    return MailProviderSupport(
        providerKey=request.providerKey,
        status=resolve_mail_provider_support_status(request),
        builtin=request.builtin,
        official=request.official,
        registered=request.registered,
    )
