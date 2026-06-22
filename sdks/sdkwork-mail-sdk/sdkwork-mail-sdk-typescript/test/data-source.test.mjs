import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createManagerWithProviderPackages,
  loadProviderPackage,
} from './provider-test-helpers.mjs';

test('data source defaults provider selection to smtp after installing the provider package', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
  });

  const client = await dataSource.createClient();
  assert.deepEqual(dataSource.describeSelection(), {
    providerKey: 'smtp',
    source: 'default_provider',
  });
  assert.equal(client.metadata.providerKey, 'smtp');
  assert.equal(client.metadata.defaultSelected, true);
});

test('data source preserves provider metadata and capability declarations', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['imap']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerKey: 'imap',
  });

  const client = await dataSource.createClient();

  assert.equal(client.metadata.providerKey, 'imap');
  assert.equal(sdk.hasCapability(client.capabilities, 'transport.connect'), true);
  assert.equal(sdk.hasCapability(client.capabilities, 'imap.sync'), true);
});

test('data source unwrap returns the native client instance created by the provider package adapter', async () => {
  const nativeClient = { sdk: 'smtp-transport-native' };
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp'], {
    smtp: {
      nativeFactory: async () => nativeClient,
    },
  });
  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
  });

  const client = await dataSource.createClient();
  assert.equal(client.unwrap(), nativeClient);
});

test('data source describe resolves metadata before client creation', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp', 'imap']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerUrl: 'Mail:imap://mailbox-service/default',
  });

  const metadata = dataSource.describe();
  assert.equal(metadata.providerKey, 'imap');
  assert.equal(metadata.pluginId, 'Mail-imap');
});

test('data source exposes stable provider selection introspection', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages([
    'smtp',
    'imap',
  ]);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    deploymentProfileProviderKey: 'imap',
    tenantOverrideProviderKey: 'imap',
  });

  assert.deepEqual(dataSource.describeSelection(), {
    providerKey: 'imap',
    source: 'tenant_override',
  });
  assert.deepEqual(
    dataSource.describeSelection({ providerUrl: 'Mail:smtp://default/main' }),
    {
      providerKey: 'smtp',
      source: 'provider_url',
    },
  );
});

test('data source can describe provider support state without connecting', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages([
    'smtp',
    'imap',
  ]);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerKey: 'imap',
  });

  assert.deepEqual(dataSource.describeProviderSupport(), {
    providerKey: 'imap',
    status: 'builtin_registered',
    builtin: true,
    official: true,
    registered: true,
  });
  assert.deepEqual(
    dataSource.describeProviderSupport({ providerKey: 'smtp' }),
    {
      providerKey: 'smtp',
      status: 'builtin_registered',
      builtin: true,
      official: true,
      registered: true,
    },
  );
});

test('data source can list provider support state matrix without connecting', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages([
    'smtp',
  ]);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
  });
  const providerSupport = dataSource.listProviderSupport();

  assert.equal(Array.isArray(providerSupport), true);
  assert.equal(providerSupport.length, 2);
  assert.deepEqual(
    providerSupport.find((entry) => entry.providerKey === 'smtp'),
    {
      providerKey: 'smtp',
      status: 'builtin_registered',
      builtin: true,
      official: true,
      registered: true,
    },
  );
  assert.deepEqual(
    providerSupport.find((entry) => entry.providerKey === 'imap'),
    {
      providerKey: 'imap',
      status: 'official_unregistered',
      builtin: true,
      official: true,
      registered: false,
    },
  );
});

test('client capability checks use a stable capability_not_supported error', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['imap']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerKey: 'imap',
  });
  const client = await dataSource.createClient();

  assert.deepEqual(client.selection, {
    providerKey: 'imap',
    source: 'provider_key',
  });
  assert.equal(client.supportsCapability('imap.folder-sync'), true);
  assert.equal(client.supportsCapability('smtp.send'), false);
  assert.throws(
    () => client.requireCapability('smtp.send'),
    (error) => {
      assert.ok(error instanceof sdk.MailSdkException);
      assert.equal(error.code, 'capability_not_supported');
      assert.equal(error.providerKey, 'imap');
      return true;
    },
  );
});

test('client delegates runtime bridge operations through the provider-neutral runtime surface', async () => {
  const nativeClient = { sdk: 'smtp-transport-native' };
  const calls = [];
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp'], {
    smtp: {
      nativeFactory: async () => nativeClient,
      runtimeController: {
        async connectTransport(options, context) {
          calls.push(['connectTransport', options, context.selection.providerKey]);
          assert.equal(context.nativeClient, nativeClient);
          return {
            accountId: options.accountId,
            providerKey: context.metadata.providerKey,
            connectionState: 'connected',
          };
        },
        async authenticateTransport(options, context) {
          calls.push(['authenticateTransport', options.username, context.selection.providerKey]);
          return {
            accountId: 'account-1',
            providerKey: context.metadata.providerKey,
            connectionState: 'connected',
          };
        },
        async disconnectTransport(context) {
          calls.push(['disconnectTransport', context.selection.providerKey]);
          return {
            accountId: 'account-1',
            providerKey: context.metadata.providerKey,
            connectionState: 'disconnected',
          };
        },
        async sendMail(options, context) {
          calls.push(['sendMail', options.subject, context.selection.providerKey]);
          return {
            messageId: options.messageId ?? 'msg-1',
            accepted: options.to,
          };
        },
        async healthCheck(context) {
          calls.push(['healthCheck', context.selection.providerKey]);
          return { healthy: true };
        },
      },
    },
  });

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
  });
  const client = await dataSource.createClient();

  assert.deepEqual(
    await client.connectTransport({
      accountId: 'account-1',
    }),
    {
      accountId: 'account-1',
      providerKey: 'smtp',
      connectionState: 'connected',
    },
  );
  assert.deepEqual(
    await client.authenticateTransport({
      username: 'user@example.test',
    }),
    {
      accountId: 'account-1',
      providerKey: 'smtp',
      connectionState: 'connected',
    },
  );
  assert.deepEqual(
    await client.sendMail({
      from: 'sender@example.test',
      to: ['recipient@example.test'],
      subject: 'Hello',
      bodyText: 'Mail body',
    }),
    {
      messageId: 'msg-1',
      accepted: ['recipient@example.test'],
    },
  );
  assert.deepEqual(await client.healthCheck(), { healthy: true });
  assert.deepEqual(await client.disconnectTransport(), {
    accountId: 'account-1',
    providerKey: 'smtp',
    connectionState: 'disconnected',
  });
  assert.deepEqual(calls, [
    ['connectTransport', { accountId: 'account-1' }, 'smtp'],
    ['authenticateTransport', 'user@example.test', 'smtp'],
    ['sendMail', 'Hello', 'smtp'],
    ['healthCheck', 'smtp'],
    ['disconnectTransport', 'smtp'],
  ]);
});

test('default smtp provider runtime reports native_sdk_not_available without a runtime controller', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
  });
  const client = await dataSource.createClient();

  await assert.rejects(
    async () =>
      client.connectTransport({
        accountId: 'account-1',
      }),
    (error) => {
      assert.ok(error instanceof sdk.MailSdkException);
      assert.equal(error.code, 'native_sdk_not_available');
      assert.equal(error.providerKey, 'smtp');
      assert.equal(error.details?.methodName, 'connectTransport');
      return true;
    },
  );
});

test('root data source without installed provider package does not create runtime clients', async () => {
  const { sdk } = await loadProviderPackage('smtp');
  const dataSource = new sdk.MailDataSource();

  assert.deepEqual(dataSource.describeProviderSupport(), {
    providerKey: 'smtp',
    status: 'official_unregistered',
    builtin: true,
    official: true,
    registered: false,
  });

  await assert.rejects(
    async () => dataSource.createClient(),
    (error) =>
      error instanceof sdk.MailSdkException &&
      error.code === 'provider_not_supported' &&
      error.providerKey === 'smtp',
  );
});
