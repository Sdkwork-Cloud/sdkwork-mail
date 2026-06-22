# SDKWork Mail SDK TypeScript Runtime Usage

This guide describes the executable TypeScript/web mail transport runtime baseline of `sdkwork-mail-sdk`.
Backend services and application layers resolve SMTP/IMAP provider credentials. The Mail SDK consumes
those credentials and drives provider transport behavior through the standard runtime surface.

## Current Runnable Baseline

- Default transport provider: `smtp`
- Default web provider plugin package: `@sdkwork/Mail-sdk-provider-smtp`
- Default web provider plugin import path: `@sdkwork/Mail-sdk-provider-smtp`
- Standard transport entrypoint: `MailDataSource`
- Recommended runtime entrypoint: `installMailProviderPackage`
- Smoke command: `npm run smoke`
- Smoke mode: `runtime-backed`
- Smoke variants: `default`

## Install

```bash
npm install @sdkwork/Mail-sdk @sdkwork/Mail-sdk-provider-smtp
```

## Fast Runtime Verification

Run the public TypeScript smoke command inside `sdkwork-mail-sdk-typescript` when you want to validate
the default provider runtime bridge without depending on live credentials:

```bash
npm run smoke
```

The smoke command builds the TypeScript package and verifies the root public API boundary. It guards
against retired RTC exports reappearing in the Mail SDK surface.

## Mail Transport Runtime Flow

```ts
import {
  createMailProviderPackageLoader,
  installMailProviderPackage,
  MailDriverManager,
  MailDataSource,
} from '@sdkwork/Mail-sdk';
import * as smtpProvider from '@sdkwork/Mail-sdk-provider-smtp';

const driverManager = await installMailProviderPackage(
  new MailDriverManager(),
  {
    providerKey: 'smtp',
  },
  createMailProviderPackageLoader(async () => smtpProvider),
);

const dataSource = new MailDataSource({
  driverManager,
  nativeConfig: {
    host: 'smtp.example.com',
    port: 587,
    useTls: true,
    username: 'noreply@example.com',
    password: 'secret',
    fromEmail: 'noreply@example.com',
  },
});

const mailClient = await dataSource.createClient();

await mailClient.connectTransport({
  host: 'smtp.example.com',
  port: 587,
  useTls: true,
});

await mailClient.sendMail({
  toEmail: 'user@example.com',
  subject: 'Verification code',
  bodyText: 'Your code is 123456',
});

await mailClient.healthCheck();
```

## Required Native Config

For the default SMTP transport runtime, `nativeConfig.host`, `nativeConfig.port`, and
`nativeConfig.fromEmail` are mandatory before `connectTransport()`.

Supported SMTP native config shape:

```ts
type MailSmtpNativeConfig = {
  host?: string;
  port?: number;
  useTls?: boolean;
  username?: string;
  password?: string;
  fromEmail?: string;
};
```

## Runtime Guarantees

- `MailDataSource` is the standard provider-neutral mail transport client factory
- `installMailProviderPackage(...)` registers provider drivers through explicit plugin packages
- `MailDriverManager` and `MailDataSource` default to `smtp` only after the
  matching provider package is installed into the manager
- official provider plugin packages and vendor SDKs are not bundled into the Mail standard root package
- provider plugin packages own any vendor SDK peer dependencies
- provider credentials are supplied by the application or backend service before `connectTransport()`
- Mail runtime code does not own user invitation, conversation delivery, or business lifecycle
