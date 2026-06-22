import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createManagerWithProviderPackages,
  loadSdk,
} from './provider-test-helpers.mjs';

test('capability sets are immutable runtime snapshots', async () => {
  const { createCapabilitySet } = await loadSdk();

  const required = ['transport.connect', 'transport.authenticate'];
  const optional = ['smtp.send'];
  const capabilities = createCapabilitySet({
    required,
    optional,
  });

  required.push('health');
  optional.push('transport.pool');

  assert.equal(Object.isFrozen(capabilities), true);
  assert.equal(Object.isFrozen(capabilities.required), true);
  assert.equal(Object.isFrozen(capabilities.optional), true);
  assert.deepEqual(capabilities.required, ['transport.connect', 'transport.authenticate']);
  assert.deepEqual(capabilities.optional, ['smtp.send']);
  assert.throws(() => capabilities.required.push('health'), TypeError);
  assert.throws(() => {
    capabilities.optional = [];
  }, TypeError);
});

test('provider drivers snapshot metadata and expose immutable contracts', async () => {
  const { createMailProviderDriver } = await loadSdk();

  const metadata = {
    providerKey: 'smtp',
    pluginId: 'Mail-smtp',
    driverId: 'sdkwork-mail-driver-smtp',
    displayName: 'SMTP Mail Transport',
    defaultSelected: true,
    urlSchemes: ['mail:smtp'],
    requiredCapabilities: ['transport.connect', 'transport.authenticate', 'health'],
    optionalCapabilities: ['smtp.send', 'transport.retry', 'transport.pool'],
    extensionKeys: ['smtp.transport'],
  };
  const driver = createMailProviderDriver({
    metadata,
  });

  metadata.urlSchemes.push('mail:smtp-drift');
  metadata.requiredCapabilities.push('health');
  metadata.extensionKeys.push('smtp.transport-drift');

  assert.equal(Object.isFrozen(driver), true);
  assert.equal(Object.isFrozen(driver.metadata), true);
  assert.equal(Object.isFrozen(driver.metadata.urlSchemes), true);
  assert.equal(Object.isFrozen(driver.metadata.requiredCapabilities), true);
  assert.equal(Object.isFrozen(driver.metadata.extensionKeys), true);
  assert.deepEqual(driver.metadata.urlSchemes, ['mail:smtp']);
  assert.deepEqual(driver.metadata.requiredCapabilities, [
    'transport.connect',
    'transport.authenticate',
    'health',
  ]);
  assert.deepEqual(driver.metadata.extensionKeys, ['smtp.transport']);
  assert.throws(() => driver.metadata.urlSchemes.push('mail:smtp-bad'), TypeError);
  assert.throws(() => {
    driver.metadata = metadata;
  }, TypeError);
});

test('driver-manager runtime descriptors are immutable snapshots', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages([
    'smtp',
    'imap',
  ]);

  const parsedUrl = sdk.parseMailProviderUrl('Mail:imap://app/default');
  const selection = manager.resolveSelection({
    providerUrl: 'Mail:imap://app/default',
  });
  const listedMetadata = manager.list();
  const providerSupport = manager.describeProviderSupport('imap');
  const providerSupportList = manager.listProviderSupport();

  assert.equal(Object.isFrozen(parsedUrl), true);
  assert.equal(Object.isFrozen(selection), true);
  assert.equal(Object.isFrozen(listedMetadata), true);
  assert.equal(Object.isFrozen(providerSupport), true);
  assert.equal(Object.isFrozen(providerSupportList), true);
  assert.equal(Object.isFrozen(providerSupportList[0]), true);
  assert.equal(Object.isFrozen(manager.getMetadata({ providerKey: 'imap' })), true);
  assert.throws(() => {
    selection.providerKey = 'smtp';
  }, TypeError);
  assert.throws(() => providerSupportList.push(providerSupport), TypeError);
});

test('client runtime surfaces are immutable while native sdk instances stay mutable', async () => {
  const nativeClient = {
    sdk: 'smtp-transport-native',
    mutableFlag: false,
  };
  let observedContext;
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp'], {
    smtp: {
      nativeFactory: async () => nativeClient,
      runtimeController: {
        async connectTransport(options, context) {
          observedContext = context;
          context.nativeClient.mutableFlag = true;
          return {
            accountId: options.accountId,
            providerKey: context.metadata.providerKey,
            connectionState: 'connected',
          };
        },
        async authenticateTransport() {
          return {
            accountId: 'account-1',
            providerKey: 'smtp',
            connectionState: 'connected',
          };
        },
        async disconnectTransport() {
          return {
            accountId: 'account-1',
            providerKey: 'smtp',
            connectionState: 'disconnected',
          };
        },
        async healthCheck() {
          return { healthy: true };
        },
      },
    },
  });
  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
  });

  const client = await dataSource.createClient();
  const selection = dataSource.describeSelection();
  const providerSupport = dataSource.describeProviderSupport();
  const capabilityState = dataSource.describeCapability('transport.connect');
  const negotiation = dataSource.negotiateCapabilities({
    required: ['transport.connect'],
    optional: ['imap.sync'],
  });

  assert.equal(Object.isFrozen(client.metadata), true);
  assert.equal(Object.isFrozen(client.capabilities), true);
  assert.equal(Object.isFrozen(client.selection), true);
  assert.equal(Object.isFrozen(selection), true);
  assert.equal(Object.isFrozen(providerSupport), true);
  assert.equal(Object.isFrozen(capabilityState), true);
  assert.equal(Object.isFrozen(negotiation), true);
  assert.equal(Object.isFrozen(negotiation.supportedRequired), true);
  assert.equal(Object.isFrozen(negotiation.missingOptional), true);
  assert.equal(Object.isFrozen(negotiation.missingBySurface), true);
  assert.throws(() => {
    client.metadata = null;
  }, TypeError);
  assert.throws(() => {
    client.selection.providerKey = 'imap';
  }, TypeError);

  await client.connectTransport({
    accountId: 'account-1',
  });

  assert.ok(observedContext);
  assert.equal(Object.isFrozen(observedContext), true);
  assert.equal(Object.isFrozen(observedContext.metadata), true);
  assert.equal(Object.isFrozen(observedContext.capabilities), true);
  assert.equal(Object.isFrozen(observedContext.selection), true);
  assert.equal(Object.isFrozen(observedContext.nativeClient), false);
  assert.equal(nativeClient.mutableFlag, true);
});
