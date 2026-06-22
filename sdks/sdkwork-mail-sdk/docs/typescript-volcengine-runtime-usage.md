# SDKWork Mail SDK TypeScript Runtime Usage

This guide describes the executable TypeScript/web media runtime baseline of `sdkwork-mail-sdk`.
IM-owned SDKs and services create business call sessions, deliver invitations, and issue provider
credentials. The Mail SDK consumes media-room inputs and drives provider media behavior.

## Current Runnable Baseline

- Default media provider: `volcengine`
- Default web provider plugin package: `@sdkwork/Mail-sdk-provider-volcengine`
- Default web provider plugin import path: `@sdkwork/Mail-sdk-provider-volcengine`
- Default web vendor SDK package: `@volcengine/Mail`
- Standard media entrypoint: `MailDataSource`
- Recommended runtime entrypoint: `installMailProviderPackage`
- Smoke command: `npm run smoke`
- Smoke mode: `runtime-backed`
- Smoke variants: `default`

## Install

```bash
npm install @sdkwork/Mail-sdk @sdkwork/Mail-sdk-provider-volcengine @volcengine/Mail
```

## Fast Runtime Verification

Run the public TypeScript smoke command inside `sdkwork-mail-sdk-typescript` when you want to validate
the default provider runtime bridge without depending on live credentials:

```bash
npm run smoke
```

The smoke command builds the TypeScript package and verifies the root public API boundary. It guards
against retired call-lifecycle exports reappearing in the Mail SDK surface.

## Media Runtime Flow

```ts
import {
  createMailProviderPackageLoader,
  installMailProviderPackage,
  MailDriverManager,
  MailDataSource,
} from '@sdkwork/Mail-sdk';
import * as volcengineProvider from '@sdkwork/Mail-sdk-provider-volcengine';

const driverManager = await installMailProviderPackage(
  new MailDriverManager(),
  {
    providerKey: 'volcengine',
  },
  createMailProviderPackageLoader(async () => volcengineProvider),
);

const dataSource = new MailDataSource({
  driverManager,
  nativeConfig: {
    appId: 'volc-app-id',
    engineConfig: {
      env: 'production',
    },
    roomConfig: {
      profile: 'communication',
    },
    userExtraInfo: {
      displayName: 'Alice',
    },
    capture: {
      audioDeviceId: 'default-mic',
      videoDeviceId: 'default-camera',
    },
  },
});

const MailClient = await dataSource.createClient();

await MailClient.join({
  sessionId: 'mail-inbox-1',
  roomId: 'provider-room-1',
  participantId: 'user-1',
  token: 'provider-issued-token',
});

await MailClient.publish({
  trackId: 'mail-inbox-1-audio',
  kind: 'audio',
});

await MailClient.publish({
  trackId: 'mail-inbox-1-video',
  kind: 'video',
});
```

## Required Native Config

For the default Volcengine Web runtime, `nativeConfig.appId` is mandatory before `join()`.

Supported Volcengine Web native config shape:

```ts
type MailVolcengineWebNativeConfig = {
  appId?: string;
  engineConfig?: Record<string, unknown>;
  roomConfig?: Record<string, unknown>;
  userExtraInfo?: Record<string, unknown>;
  capture?: {
    audioDeviceId?: string;
    videoDeviceId?: string;
  };
};
```

## Runtime Guarantees

- `MailDataSource` is the standard provider-neutral media client factory
- `installMailProviderPackage(...)` registers provider drivers through explicit plugin packages
- `MailDriverManager` and `MailDataSource` default to `volcengine` only after the
  matching provider package is installed into the manager
- official provider plugin packages and vendor SDKs are not bundled into the Mail standard root package
- provider plugin packages own any vendor SDK peer dependencies
- provider credentials are supplied by the application or IM layer before `join()`
- Mail runtime code does not own user invitation, conversation delivery, or business call lifecycle
