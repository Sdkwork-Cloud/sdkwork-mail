# Mail transport plugins

SDKWork Mail uses transport plugins under `plugins/` for outbound delivery and mailbox sync.

| Plugin | ID | Role |
| --- | --- | --- |
| `mail-smtp` | `mail-smtp` | SMTP outbound delivery for transactional and verification mail |
| `mail-imap` | `mail-imap` | IMAP sync for inbox ingestion |

Both plugins are registered as `communication/mail` capability components. Runtime SMTP/IMAP protocol logic is implemented incrementally in each plugin crate; the service host routes transactional sends through the configured provider account.

Do not add RTC or realtime media provider plugins to this repository. Media runtime belongs in `sdkwork-im`, not `sdkwork-mail`.
