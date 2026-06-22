from .provider_activation_catalog import get_mail_provider_activation_by_provider_key
from .provider_catalog import (
    DEFAULT_mail_PROVIDER_KEY,
    MailProviderCatalog,
    get_mail_provider_by_provider_key,
)
from .provider_selection import (
    MailProviderSelection,
    MailProviderSelectionRequest,
    resolve_mail_provider_selection,
)
from .provider_support import (
    MailProviderSupport,
    MailProviderSupportStateRequest,
    create_mail_provider_support_state,
)


class MailDriverManager:
    def resolveSelection(
        self,
        request: MailProviderSelectionRequest | None = None,
        *,
        defaultProviderKey: str = DEFAULT_mail_PROVIDER_KEY,
    ) -> MailProviderSelection:
        return resolve_mail_provider_selection(
            request,
            default_provider_key=defaultProviderKey,
        )

    def describeProviderSupport(self, providerKey: str) -> MailProviderSupport:
        official = get_mail_provider_by_provider_key(providerKey) is not None
        activation = get_mail_provider_activation_by_provider_key(providerKey)

        return create_mail_provider_support_state(
            MailProviderSupportStateRequest(
                providerKey=providerKey,
                builtin=activation.builtin if activation is not None else False,
                official=official,
                registered=activation.runtimeBridge if activation is not None else False,
            )
        )

    def listProviderSupport(self) -> list[MailProviderSupport]:
        return [
            self.describeProviderSupport(entry.providerKey)
            for entry in MailProviderCatalog.entries
        ]
