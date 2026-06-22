import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

async function loadSdk() {
  return import('../dist/index.js');
}

async function loadCapabilityCatalog() {
  return import('../dist/capability-catalog.js');
}

function readAssembly() {
  const assemblyPath = path.resolve('..', '.sdkwork-assembly.json');
  return JSON.parse(readFileSync(assemblyPath, 'utf8'));
}

test('materialized Mail capability catalog matches the assembly capability descriptors', async () => {
  const catalog = await loadCapabilityCatalog();
  const assembly = readAssembly();

  assert.deepEqual(
    catalog.mail_CAPABILITY_CATALOG.map((descriptor) => ({
      capabilityKey: descriptor.capabilityKey,
      category: descriptor.category,
      surface: descriptor.surface,
    })),
    assembly.capabilityCatalog.map((descriptor) => ({
      capabilityKey: descriptor.capabilityKey,
      category: descriptor.category,
      surface: descriptor.surface,
    })),
  );

  for (const provider of assembly.providers) {
    for (const capability of provider.requiredCapabilities) {
      assert.equal(
        catalog.getMailCapabilityDescriptor(capability)?.category,
        'required-baseline',
      );
    }

    for (const capability of provider.optionalCapabilities) {
      assert.equal(
        catalog.getMailCapabilityDescriptor(capability)?.category,
        'optional-advanced',
      );
    }
  }
});

test('root sdk re-exports capability catalog helpers and descriptors', async () => {
  const sdk = await loadSdk();
  const catalog = await loadCapabilityCatalog();

  assert.equal(typeof sdk.getMailCapabilityCatalog, 'function');
  assert.equal(typeof sdk.getMailCapabilityDescriptor, 'function');
  assert.deepEqual(sdk.getMailCapabilityCatalog(), catalog.mail_CAPABILITY_CATALOG);
  assert.deepEqual(sdk.getMailCapabilityDescriptor('transport.connect'), {
    capabilityKey: 'transport.connect',
    category: 'required-baseline',
    surface: 'control-plane',
  });
});

test('materialized Mail capability catalog is runtime-frozen', async () => {
  const catalog = await loadCapabilityCatalog();

  assert.equal(Object.isFrozen(catalog.REQUIRED_mail_CAPABILITIES), true);
  assert.equal(Object.isFrozen(catalog.OPTIONAL_mail_CAPABILITIES), true);
  assert.equal(Object.isFrozen(catalog.mail_CAPABILITY_CATALOG), true);
  assert.equal(Object.isFrozen(catalog.TRANSPORT_CONNECT_mail_CAPABILITY_DESCRIPTOR), true);
  assert.throws(() => {
    catalog.TRANSPORT_CONNECT_mail_CAPABILITY_DESCRIPTOR.surface = 'control-plane';
  }, /TypeError/);
});
