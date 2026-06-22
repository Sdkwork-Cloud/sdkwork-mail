import assert from 'node:assert/strict';
import test from 'node:test';
import { createManagerWithProviderPackages, loadSdk } from './provider-test-helpers.mjs';

test('capability negotiation standard exports stable statuses, rules, and resolver semantics', async () => {
  const sdk = await loadSdk();

  assert.deepEqual(sdk.mail_CAPABILITY_NEGOTIATION_STATUSES, [
    'supported',
    'degraded',
    'unsupported',
  ]);
  assert.deepEqual(sdk.mail_CAPABILITY_NEGOTIATION_RULES, {
    supported: 'all-requested-capabilities-available',
    degraded: 'all-required-capabilities-available_optional-capabilities-missing',
    unsupported: 'required-capabilities-missing',
  });
  assert.equal(sdk.resolveMailCapabilityNegotiationStatus(0, 0), 'supported');
  assert.equal(sdk.resolveMailCapabilityNegotiationStatus(0, 2), 'degraded');
  assert.equal(sdk.resolveMailCapabilityNegotiationStatus(1, 0), 'unsupported');
  assert.equal(Object.isFrozen(sdk.mail_CAPABILITY_NEGOTIATION_STATUSES), true);
  assert.equal(Object.isFrozen(sdk.mail_CAPABILITY_NEGOTIATION_RULES), true);
});

test('data source negotiates optional capability degradation with surface-aware missing sets', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerKey: 'smtp',
  });

  assert.deepEqual(
    dataSource.negotiateCapabilities({
      required: ['transport.connect', 'transport.authenticate'],
      optional: ['smtp.send', 'imap.sync'],
    }),
    {
      status: 'degraded',
      supportedRequired: ['transport.connect', 'transport.authenticate'],
      missingRequired: [],
      supportedOptional: ['smtp.send'],
      missingOptional: ['imap.sync'],
      missingBySurface: {
        controlPlane: [],
        runtimeBridge: ['imap.sync'],
        crossSurface: [],
      },
    },
  );
});

test('client describes capability support with category and surface metadata', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerKey: 'smtp',
  });
  const client = await dataSource.createClient();

  assert.deepEqual(client.describeCapability('transport.connect'), {
    capabilityKey: 'transport.connect',
    category: 'required-baseline',
    surface: 'control-plane',
    supported: true,
  });
  assert.deepEqual(client.describeCapability('imap.sync'), {
    capabilityKey: 'imap.sync',
    category: 'optional-advanced',
    surface: 'runtime-bridge',
    supported: false,
  });
});

test('client negotiation reports unsupported when required capabilities are missing', async () => {
  const { sdk, manager } = await createManagerWithProviderPackages(['smtp']);

  const dataSource = new sdk.MailDataSource({
    driverManager: manager,
    providerKey: 'smtp',
  });
  const client = await dataSource.createClient();

  assert.deepEqual(
    client.negotiateCapabilities({
      required: ['transport.connect', 'imap.sync'],
      optional: ['smtp.send'],
    }),
    {
      status: 'unsupported',
      supportedRequired: ['transport.connect'],
      missingRequired: ['imap.sync'],
      supportedOptional: ['smtp.send'],
      missingOptional: [],
      missingBySurface: {
        controlPlane: [],
        runtimeBridge: ['imap.sync'],
        crossSurface: [],
      },
    },
  );
});
