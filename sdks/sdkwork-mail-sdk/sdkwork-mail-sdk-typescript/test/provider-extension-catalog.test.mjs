import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { createManagerWithProviderPackages } from './provider-test-helpers.mjs';

async function loadSdk() {
  return import('../dist/index.js');
}

async function loadExtensionCatalog() {
  return import('../dist/provider-extension-catalog.js');
}

function readAssembly() {
  const assemblyPath = path.resolve('..', 'sdk-manifest.json');
  return JSON.parse(readFileSync(assemblyPath, 'utf8'));
}

test('materialized provider extension catalog matches the assembly extension registry snapshot', async () => {
  const catalog = await loadExtensionCatalog();
  const assembly = readAssembly();

  assert.deepEqual(
    catalog.mail_PROVIDER_EXTENSION_CATALOG.map((descriptor) => ({
      extensionKey: descriptor.extensionKey,
      providerKey: descriptor.providerKey,
      displayName: descriptor.displayName,
      surface: descriptor.surface,
      access: descriptor.access,
      status: descriptor.status,
    })),
    assembly.providerExtensionCatalog.map((descriptor) => ({
      extensionKey: descriptor.extensionKey,
      providerKey: descriptor.providerKey,
      displayName: descriptor.displayName,
      surface: descriptor.surface,
      access: descriptor.access,
      status: descriptor.status,
    })),
  );
});

test('data source and client expose provider extension descriptors through standard metadata helpers', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerKey: 'smtp',
  });

  assert.deepEqual(dataSource.describeProviderExtensions(), [
    {
      extensionKey: 'smtp.transport',
      providerKey: 'smtp',
      displayName: 'SMTP Transport',
      surface: 'runtime-bridge',
      access: 'unwrap-only',
      status: 'reserved',
    },
  ]);
  assert.equal(dataSource.supportsProviderExtension('smtp.transport'), true);
  assert.equal(dataSource.supportsProviderExtension('imap.sync'), false);

  const client = await dataSource.createClient();

  assert.deepEqual(client.getProviderExtensions(), [
    {
      extensionKey: 'smtp.transport',
      providerKey: 'smtp',
      displayName: 'SMTP Transport',
      surface: 'runtime-bridge',
      access: 'unwrap-only',
      status: 'reserved',
    },
  ]);
  assert.equal(client.supportsProviderExtension('smtp.transport'), true);
  assert.equal(client.supportsProviderExtension('imap.sync'), false);
});

test('materialized provider extension catalog is runtime-frozen', async () => {
  const catalog = await loadExtensionCatalog();

  assert.equal(Object.isFrozen(catalog.mail_PROVIDER_EXTENSION_KEYS), true);
  assert.equal(Object.isFrozen(catalog.mail_PROVIDER_EXTENSION_CATALOG), true);
  assert.equal(
    Object.isFrozen(catalog.SMTP_TRANSPORT_mail_PROVIDER_EXTENSION_DESCRIPTOR),
    true,
  );
  assert.equal(
    Object.isFrozen(catalog.getMailProviderExtensionsForProvider('smtp')),
    true,
  );
  assert.throws(() => {
    catalog.SMTP_TRANSPORT_mail_PROVIDER_EXTENSION_DESCRIPTOR.status = 'reference-baseline';
  }, /TypeError/);
});
