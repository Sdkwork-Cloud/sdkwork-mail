# SDKWork Mail Apps

Application surfaces for SDKWork Mail.

## Application Roots

| App Root | Architecture | Framework | Surface |
|----------|-------------|-----------|---------|
| `sdkwork-mail-pc/` | PC | React/TypeScript | Browser + Desktop |
| `sdkwork-mail-h5/` | H5 | React/TypeScript | Mobile Browser + Capacitor |
| `sdkwork-mail-flutter-mobile/` | Flutter Mobile | Dart/Flutter | iOS + Android |

## Cross-Client Alignment

All three app roots share:
- Same Mail app-api (`/app/v3/api/Mail/`)
- Same generated Mail app SDK (`sdkwork-mail-app-sdk`)
- Same route identity (`Mail.rooms.*`, `Mail.MailInboxs.*`, etc.)
- Same appbase IAM runtime integration
- Same provider profile and mail inbox domain model
