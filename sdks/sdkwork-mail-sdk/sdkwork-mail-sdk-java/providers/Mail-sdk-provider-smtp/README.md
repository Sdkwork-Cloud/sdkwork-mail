# Java SMTP Mail Transport Provider Package

Reserved Java provider package boundary for SMTP Mail Transport.

- provider key: `smtp`
- plugin id: `Mail-smtp`
- driver id: `sdkwork-mail-driver-smtp`
- package identity: `com.sdkwork:Mail-sdk-provider-smtp`
- directory path: `providers/Mail-sdk-provider-smtp`
- manifest path: `providers/Mail-sdk-provider-smtp/pom.xml`
- readme path: `providers/Mail-sdk-provider-smtp/README.md`
- source path: `providers/Mail-sdk-provider-smtp/src/main/java/com/sdkwork/Mail/provider/smtp/MailProviderSmtpPackageContract.java`
- source symbol: `MailProviderSmtpPackageContract`
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
