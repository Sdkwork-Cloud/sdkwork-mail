import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loadProviderPackage,
  loadSdk,
} from './provider-test-helpers.mjs';

const executableProviderKeys = ['smtp', 'imap'];

test('provider package modules keep stable package boundaries', async () => {
  const modules = [];

  for (const providerKey of executableProviderKeys) {
    const { packageEntry, providerModule } = await loadProviderPackage(providerKey);
    modules.push({
      packageEntry,
      providerModule,
    });
  }

  assert.deepEqual(
    modules.map(({ packageEntry, providerModule }) => ({
      providerKey: providerModule.metadata.providerKey,
      packageName: providerModule.packageName,
      metadataPackageName: providerModule.metadata.typescriptPackage.packageName,
      builtin: providerModule.builtin,
      rootPublic: packageEntry.rootPublic,
      status: packageEntry.status,
      typescriptAdapter: providerModule.typescriptAdapter,
    })),
    modules.map(({ packageEntry, providerModule }) => ({
      providerKey: packageEntry.providerKey,
      packageName: packageEntry.packageIdentity,
      metadataPackageName: packageEntry.packageIdentity,
      builtin: providerModule.metadata.builtin,
      rootPublic: packageEntry.rootPublic,
      status: 'package_reference_boundary',
      typescriptAdapter: providerModule.metadata.typescriptAdapter,
    })),
  );

  for (const { packageEntry, providerModule } of modules) {
    assert.equal(Object.isFrozen(providerModule), true);
    assert.equal(providerModule.packageName, providerModule.metadata.typescriptPackage.packageName);
    assert.equal(providerModule.packageName, packageEntry.packageIdentity);
    assert.equal(providerModule.builtin, providerModule.metadata.builtin);
    assert.equal(packageEntry.rootPublic, true);
  }
});

test('registerMailProviderModule registers provider packages through the module contract', async () => {
  const { MailDriverManager, registerMailProviderModule } = await loadSdk();
  const { providerModule } = await loadProviderPackage('smtp');

  const nativeClient = { sdk: 'smtp-transport-native' };
  const manager = registerMailProviderModule(new MailDriverManager(), providerModule, {
    nativeFactory: async () => nativeClient,
  });

  const client = await manager.connect({ providerKey: 'smtp' });
  assert.equal(client.unwrap(), nativeClient);
});

test('registerMailProviderModules registers provider packages through the batch module contract', async () => {
  const { MailDriverManager, registerMailProviderModules } = await loadSdk();
  const { providerModule } = await loadProviderPackage('imap');

  const nativeClient = { sdk: 'imap-sync-native' };
  const manager = registerMailProviderModules(new MailDriverManager(), [
    {
      providerModule,
      options: {
        nativeFactory: async () => nativeClient,
      },
    },
  ]);

  const client = await manager.connect({ providerKey: 'imap' });
  assert.equal(client.unwrap(), nativeClient);
  assert.deepEqual(manager.describeProviderSupport('imap'), {
    providerKey: 'imap',
    status: 'builtin_registered',
    builtin: true,
    official: true,
    registered: true,
  });
});

test('registerMailProviderModules keeps driver manager unchanged when any registration fails', async () => {
  const { MailDriverManager, MailSdkException, registerMailProviderModules } = await loadSdk();
  const { namespace, packageEntry, providerModule } = await loadProviderPackage('imap');
  const createDriver = namespace[packageEntry.driverFactory];
  const metadata = namespace[packageEntry.metadataSymbol];

  const manager = new MailDriverManager();

  assert.throws(
    () =>
      registerMailProviderModules(manager, [
        {
          providerModule,
          options: {
            nativeFactory: async () => ({ sdk: 'imap-sync-native' }),
          },
        },
        {
          providerModule: {
            packageName: '@sdkwork/Mail-sdk-provider-imap-drift',
            metadata,
            builtin: metadata.builtin,
            typescriptAdapter: metadata.typescriptAdapter,
            createDriver(options = {}) {
              return createDriver(options);
            },
          },
        },
      ]),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_module_contract_mismatch' &&
      /package/i.test(error.message),
  );

  assert.deepEqual(manager.describeProviderSupport('imap'), {
    providerKey: 'imap',
    status: 'official_unregistered',
    builtin: true,
    official: true,
    registered: false,
  });
});

test('registerMailProviderModule rejects provider module package contract drift', async () => {
  const { MailDriverManager, MailSdkException, registerMailProviderModule } = await loadSdk();
  const { namespace, packageEntry } = await loadProviderPackage('imap');
  const createDriver = namespace[packageEntry.driverFactory];
  const metadata = namespace[packageEntry.metadataSymbol];

  assert.throws(
    () =>
      registerMailProviderModule(
        new MailDriverManager(),
        {
          packageName: '@sdkwork/Mail-sdk-provider-imap-drift',
          metadata,
          builtin: metadata.builtin,
          typescriptAdapter: metadata.typescriptAdapter,
          createDriver(options = {}) {
            return createDriver(options);
          },
        },
      ),
    (error) =>
      error instanceof MailSdkException &&
      error.code === 'provider_module_contract_mismatch' &&
      /package/i.test(error.message),
  );
});
