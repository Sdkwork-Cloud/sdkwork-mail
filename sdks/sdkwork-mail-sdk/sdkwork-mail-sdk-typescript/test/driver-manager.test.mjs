import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createManagerWithProviderPackages,
  loadProviderPackage,
  loadSdk,
} from './provider-test-helpers.mjs';

test('driver manager resolves a provider package by explicit provider key', async () => {
  const { manager } = await createManagerWithProviderPackages(['smtp', 'imap']);

  const driver = manager.resolve({ providerKey: 'imap' });
  assert.equal(driver.metadata.providerKey, 'imap');
  assert.equal(driver.metadata.pluginId, 'Mail-imap');
});

test('driver manager resolves a provider package by Mail provider url', async () => {
  const { manager } = await createManagerWithProviderPackages(['smtp', 'imap']);

  const driver = manager.resolve({ providerUrl: 'Mail:imap://app/default' });
  assert.equal(driver.metadata.providerKey, 'imap');
  assert.equal(driver.metadata.driverId, 'sdkwork-mail-driver-imap');
});

test('driver manager throws a stable invalid_provider_url error for malformed Mail urls', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  await assert.rejects(
    async () => manager.connect({ providerUrl: 'https://example.test/not-an-Mail-url' }),
    (error) => {
      assert.ok(error instanceof sdk.MailSdkException);
      assert.equal(error.code, 'invalid_provider_url');
      return true;
    },
  );
});

test('driver manager throws a stable driver_not_found error for unknown providers', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  await assert.rejects(
    async () => manager.connect({ providerKey: 'vendor-x' }),
    (error) => {
      assert.ok(error instanceof sdk.MailSdkException);
      assert.equal(error.code, 'driver_not_found');
      return true;
    },
  );
});

test('driver manager can inspect provider metadata without creating a client', async () => {
  const { manager } = await createManagerWithProviderPackages(['smtp', 'imap']);

  assert.equal(manager.hasDriver('smtp'), true);
  assert.equal(manager.hasDriver('vendor-x'), false);
  assert.equal(manager.getMetadata({ providerUrl: 'Mail:imap://cluster/prod' }).providerKey, 'imap');
  assert.equal(manager.getDefaultMetadata().providerKey, 'smtp');
});

test('driver manager rejects duplicate provider registration', async () => {
  const { sdk, namespace, packageEntry } = await loadProviderPackage('smtp');
  const createDriver = namespace[packageEntry.driverFactory];
  const manager = new sdk.MailDriverManager({
    drivers: [createDriver()],
  });

  assert.throws(
    () => manager.register(createDriver()),
    (error) => {
      assert.ok(error instanceof sdk.MailSdkException);
      assert.equal(error.code, 'driver_already_registered');
      assert.equal(error.providerKey, 'smtp');
      return true;
    },
  );
});

test('driver manager rejects registering drivers for unknown providers', async () => {
  const { MailDriverManager, MailSdkException, createMailProviderDriver } = await loadSdk();

  const manager = new MailDriverManager();
  const driver = createMailProviderDriver({
    metadata: {
      providerKey: 'vendor-x',
      pluginId: 'Mail-vendor-x',
      driverId: 'sdkwork-mail-driver-vendor-x',
      displayName: 'Vendor X Mail',
      defaultSelected: false,
      urlSchemes: ['Mail:vendor-x'],
      requiredCapabilities: ['transport.connect', 'transport.authenticate', 'health'],
      optionalCapabilities: ['smtp.send'],
      extensionKeys: ['vendor-x.transport'],
    },
  });

  assert.throws(
    () => manager.register(driver),
    (error) => {
      assert.ok(error instanceof MailSdkException);
      assert.equal(error.code, 'provider_not_official');
      assert.equal(error.providerKey, 'vendor-x');
      return true;
    },
  );
});

test('driver manager rejects registering official providers with metadata drift', async () => {
  const {
    MailDriverManager,
    MailSdkException,
    createMailProviderDriver,
    getOfficialMailProviderMetadataByKey,
  } = await loadSdk();

  const officialImap = getOfficialMailProviderMetadataByKey('imap');
  assert.ok(officialImap);

  const manager = new MailDriverManager();
  const driftedDriver = createMailProviderDriver({
    metadata: {
      ...officialImap,
      pluginId: 'Mail-imap-custom',
    },
  });

  assert.throws(
    () => manager.register(driftedDriver),
    (error) => {
      assert.ok(error instanceof MailSdkException);
      assert.equal(error.code, 'provider_metadata_mismatch');
      assert.equal(error.providerKey, 'imap');
      assert.equal(error.pluginId, 'Mail-imap-custom');
      return true;
    },
  );
});

test('driver manager distinguishes official-but-unregistered providers from unknown providers', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  assert.equal(manager.getMetadata({ providerKey: 'imap' }).providerKey, 'imap');

  await assert.rejects(
    async () => manager.connect({ providerKey: 'imap' }),
    (error) => {
      assert.ok(error instanceof sdk.MailSdkException);
      assert.equal(error.code, 'provider_not_supported');
      assert.equal(error.providerKey, 'imap');
      return true;
    },
  );
});

test('driver manager exposes stable provider selection precedence', async () => {
  const { manager } = await createManagerWithProviderPackages([
    'smtp',
    'imap',
  ]);

  assert.deepEqual(
    manager.resolveSelection({
      tenantOverrideProviderKey: 'imap',
      deploymentProfileProviderKey: 'imap',
    }),
    {
      providerKey: 'imap',
      source: 'tenant_override',
    },
  );

  assert.deepEqual(
    manager.resolveSelection({
      providerKey: 'imap',
      tenantOverrideProviderKey: 'imap',
      deploymentProfileProviderKey: 'smtp',
    }),
    {
      providerKey: 'imap',
      source: 'provider_key',
    },
  );

  assert.deepEqual(
    manager.resolveSelection({
      providerUrl: 'Mail:imap://cluster/main',
      providerKey: 'imap',
      tenantOverrideProviderKey: 'smtp',
    }),
    {
      providerKey: 'imap',
      source: 'provider_url',
    },
  );

  assert.deepEqual(
    manager.resolveSelection({
      deploymentProfileProviderKey: 'imap',
    }),
    {
      providerKey: 'imap',
      source: 'deployment_profile',
    },
  );

  assert.deepEqual(manager.resolveSelection({}), {
    providerKey: 'smtp',
    source: 'default_provider',
  });
});

test('driver manager exposes provider support-state introspection', async () => {
  const { manager } = await createManagerWithProviderPackages(['smtp', 'imap']);

  assert.deepEqual(manager.describeProviderSupport('smtp'), {
    providerKey: 'smtp',
    status: 'builtin_registered',
    builtin: true,
    official: true,
    registered: true,
  });

  assert.deepEqual(manager.describeProviderSupport('imap'), {
    providerKey: 'imap',
    status: 'builtin_registered',
    builtin: true,
    official: true,
    registered: true,
  });

  assert.deepEqual(manager.describeProviderSupport('vendor-x'), {
    providerKey: 'vendor-x',
    status: 'unknown',
    builtin: false,
    official: false,
    registered: false,
  });
});

test('driver manager lists provider support-state across the official provider catalog', async () => {
  const { manager } = await createManagerWithProviderPackages(['smtp']);
  const providerSupport = manager.listProviderSupport();

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
  assert.equal(
    providerSupport.some((entry) => entry.providerKey === 'vendor-x'),
    false,
  );
});
