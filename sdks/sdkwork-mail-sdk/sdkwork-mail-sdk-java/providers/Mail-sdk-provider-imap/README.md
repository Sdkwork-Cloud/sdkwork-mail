# Java IMAP Mail Sync Provider Package

Reserved Java provider package boundary for IMAP Mail Sync.

- provider key: `imap`
- plugin id: `Mail-imap`
- driver id: `sdkwork-mail-driver-imap`
- package identity: `com.sdkwork:Mail-sdk-provider-imap`
- directory path: `providers/Mail-sdk-provider-imap`
- manifest path: `providers/Mail-sdk-provider-imap/pom.xml`
- readme path: `providers/Mail-sdk-provider-imap/README.md`
- source path: `providers/Mail-sdk-provider-imap/src/main/java/com/sdkwork/Mail/provider/imap/MailProviderImapPackageContract.java`
- source symbol: `MailProviderImapPackageContract`
- builtin provider: `true`
- status: `future-runtime-bridge-only`
- runtime bridge status: `reserved`
- root public exposure: `false`

Rules:

- one provider per package boundary
- preserve providerKey, pluginId, and driverId alignment with the official provider catalog
- wrap the official vendor SDK instead of re-implementing media runtime
- keep the source scaffold metadata-only until a verified runtime bridge lands
- do not expose this package through the root public API in the current landing
- no runtime bridge ships in the current reserved package boundary
