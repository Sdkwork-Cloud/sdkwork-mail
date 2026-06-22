import assert from 'node:assert/strict';
import test from 'node:test';

async function loadSdk() {
  return import('../dist/index.js');
}

test('built-in provider metadata exports the mail transport provider key set', async () => {
  const { BUILTIN_mail_PROVIDER_KEYS, getBuiltinMailProviderMetadata } = await loadSdk();

  assert.deepEqual(BUILTIN_mail_PROVIDER_KEYS, ['smtp', 'imap']);

  const metadata = getBuiltinMailProviderMetadata();
  assert.deepEqual(
    metadata.map((entry) => entry.providerKey),
    BUILTIN_mail_PROVIDER_KEYS,
  );
});

test('built-in provider metadata keeps smtp as the default-selected provider', async () => {
  const { getBuiltinMailProviderMetadata } = await loadSdk();

  const metadata = getBuiltinMailProviderMetadata();
  const defaultSelected = metadata.filter((entry) => entry.defaultSelected);

  assert.equal(defaultSelected.length, 1);
  assert.equal(defaultSelected[0].providerKey, 'smtp');
});

test('built-in providers advertise the mail transport capability baseline', async () => {
  const { getBuiltinMailProviderMetadata, REQUIRED_mail_CAPABILITIES } = await loadSdk();

  for (const metadata of getBuiltinMailProviderMetadata()) {
    assert.deepEqual(metadata.requiredCapabilities, REQUIRED_mail_CAPABILITIES);
    assert.ok(metadata.optionalCapabilities.includes('smtp.send') || metadata.optionalCapabilities.includes('imap.sync'));
  }
});
