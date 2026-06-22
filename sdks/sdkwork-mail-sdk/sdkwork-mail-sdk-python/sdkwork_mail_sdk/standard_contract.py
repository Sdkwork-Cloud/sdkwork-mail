from __future__ import annotations

from typing import Protocol, TypeVar


NativeClientT = TypeVar("NativeClientT")


class MailStandardContract:
    symbol = "MailStandardContract"


class MailProviderDriver(Protocol[NativeClientT]):
    @property
    def provider_key(self) -> str:
        ...

    def create_client(self) -> "MailClient[NativeClientT]":
        ...


class MailDriverManager(Protocol[NativeClientT]):
    def resolve_driver(self, provider_key: str) -> MailProviderDriver[NativeClientT]:
        ...


class MailDataSource(Protocol[NativeClientT]):
    def create_client(self) -> "MailClient[NativeClientT]":
        ...


class MailClient(Protocol[NativeClientT]):
    def connect_transport(self) -> None:
        ...

    def authenticate_transport(self) -> None:
        ...

    def disconnect_transport(self) -> None:
        ...

    def send_mail(self) -> None:
        ...

    def probe_mailbox(self) -> None:
        ...

    def sync_mailbox(self) -> None:
        ...

    def health_check(self) -> None:
        ...

    def unwrap(self) -> NativeClientT | None:
        ...


class MailRuntimeController(Protocol[NativeClientT]):
    def connect_transport(self) -> None:
        ...

    def authenticate_transport(self) -> None:
        ...

    def disconnect_transport(self) -> None:
        ...

    def send_mail(self) -> None:
        ...

    def probe_mailbox(self) -> None:
        ...

    def sync_mailbox(self) -> None:
        ...

    def health_check(self) -> None:
        ...
