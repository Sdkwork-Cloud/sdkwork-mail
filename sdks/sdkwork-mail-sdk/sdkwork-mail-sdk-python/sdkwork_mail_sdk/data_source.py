from dataclasses import dataclass

from .driver_manager import MailDriverManager
from .provider_catalog import DEFAULT_mail_PROVIDER_KEY
from .provider_selection import MailProviderSelection, MailProviderSelectionRequest
from .provider_support import MailProviderSupport


@dataclass(frozen=True)
class MailDataSourceOptions:
    providerUrl: str | None = None
    providerKey: str | None = None
    tenantOverrideProviderKey: str | None = None
    deploymentProfileProviderKey: str | None = None
    defaultProviderKey: str = DEFAULT_mail_PROVIDER_KEY


def _prefer(overrideValue: str | None, baseValue: str | None) -> str | None:
    return overrideValue if overrideValue is not None else baseValue


def _merge_options(
    base: MailDataSourceOptions,
    overrides: MailDataSourceOptions | None,
) -> MailDataSourceOptions:
    if overrides is None:
        return base

    return MailDataSourceOptions(
        providerUrl=_prefer(overrides.providerUrl, base.providerUrl),
        providerKey=_prefer(overrides.providerKey, base.providerKey),
        tenantOverrideProviderKey=_prefer(
            overrides.tenantOverrideProviderKey,
            base.tenantOverrideProviderKey,
        ),
        deploymentProfileProviderKey=_prefer(
            overrides.deploymentProfileProviderKey,
            base.deploymentProfileProviderKey,
        ),
        defaultProviderKey=overrides.defaultProviderKey or base.defaultProviderKey,
    )


class MailDataSource:
    def __init__(
        self,
        options: MailDataSourceOptions | None = None,
        driverManager: MailDriverManager | None = None,
    ) -> None:
        self._options = options or MailDataSourceOptions()
        self._driverManager = driverManager or MailDriverManager()

    def describeSelection(
        self,
        overrides: MailDataSourceOptions | None = None,
    ) -> MailProviderSelection:
        merged = _merge_options(self._options, overrides)
        return self._driverManager.resolveSelection(
            MailProviderSelectionRequest(
                providerUrl=merged.providerUrl,
                providerKey=merged.providerKey,
                tenantOverrideProviderKey=merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey=merged.deploymentProfileProviderKey,
            ),
            defaultProviderKey=merged.defaultProviderKey,
        )

    def describeProviderSupport(
        self,
        overrides: MailDataSourceOptions | None = None,
    ) -> MailProviderSupport:
        selection = self.describeSelection(overrides)
        return self._driverManager.describeProviderSupport(selection.providerKey)

    def listProviderSupport(self) -> list[MailProviderSupport]:
        return self._driverManager.listProviderSupport()
