# Java Twilio Video Provider Package

Reserved Java provider package boundary for Twilio Video.

- provider key: `twilio`
- plugin id: `Mail-twilio`
- driver id: `sdkwork-mail-driver-twilio`
- package identity: `com.sdkwork:Mail-sdk-provider-twilio`
- directory path: `providers/Mail-sdk-provider-twilio`
- manifest path: `providers/Mail-sdk-provider-twilio/pom.xml`
- readme path: `providers/Mail-sdk-provider-twilio/README.md`
- source path: `providers/Mail-sdk-provider-twilio/src/main/java/com/sdkwork/Mail/provider/twilio/MailProviderTwilioPackageContract.java`
- source symbol: `MailProviderTwilioPackageContract`
- builtin provider: `false`
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
