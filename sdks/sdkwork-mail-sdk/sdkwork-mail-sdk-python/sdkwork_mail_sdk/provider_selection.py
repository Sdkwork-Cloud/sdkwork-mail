from dataclasses import dataclass
from enum import Enum

from .provider_catalog import DEFAULT_mail_PROVIDER_KEY


class MailProviderSelectionSource(str, Enum):
    provider_url = "provider_url"
    provider_key = "provider_key"
    tenant_override = "tenant_override"
    deployment_profile = "deployment_profile"
    default_provider = "default_provider"


@dataclass(frozen=True)
class ParsedMailProviderUrl:
    providerKey: str
    rawUrl: str


@dataclass(frozen=True)
class MailProviderSelection:
    providerKey: str
    source: MailProviderSelectionSource


@dataclass(frozen=True)
class MailProviderSelectionRequest:
    providerUrl: str | None = None
    providerKey: str | None = None
    tenantOverrideProviderKey: str | None = None
    deploymentProfileProviderKey: str | None = None


mail_PROVIDER_SELECTION_SOURCES = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
]

mail_PROVIDER_SELECTION_PRECEDENCE = [
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
]


def _has_mail_provider_selection_text(value: str | None) -> bool:
    return value is not None and value.strip() != ""


def parse_mail_provider_url(provider_url: str) -> ParsedMailProviderUrl:
    trimmed = provider_url.strip()
    if not trimmed.startswith("Mail:") or "://" not in trimmed:
        raise ValueError(f"Invalid Mail provider URL: {provider_url}")

    return ParsedMailProviderUrl(
        providerKey=trimmed[4:].split("://", 1)[0].lower(),
        rawUrl=provider_url,
    )


def resolve_mail_provider_selection(
    request: MailProviderSelectionRequest | None = None,
    *,
    default_provider_key: str = DEFAULT_mail_PROVIDER_KEY,
) -> MailProviderSelection:
    request = request or MailProviderSelectionRequest()

    if _has_mail_provider_selection_text(request.providerUrl):
        return MailProviderSelection(
            providerKey=parse_mail_provider_url(request.providerUrl).providerKey,
            source=MailProviderSelectionSource.provider_url,
        )

    if _has_mail_provider_selection_text(request.providerKey):
        return MailProviderSelection(
            providerKey=request.providerKey.strip(),
            source=MailProviderSelectionSource.provider_key,
        )

    if _has_mail_provider_selection_text(request.tenantOverrideProviderKey):
        return MailProviderSelection(
            providerKey=request.tenantOverrideProviderKey.strip(),
            source=MailProviderSelectionSource.tenant_override,
        )

    if _has_mail_provider_selection_text(request.deploymentProfileProviderKey):
        return MailProviderSelection(
            providerKey=request.deploymentProfileProviderKey.strip(),
            source=MailProviderSelectionSource.deployment_profile,
        )

    return MailProviderSelection(
        providerKey=default_provider_key,
        source=MailProviderSelectionSource.default_provider,
    )
