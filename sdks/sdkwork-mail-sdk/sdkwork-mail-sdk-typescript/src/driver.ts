import { createCapabilitySet } from './capabilities.js';
import { StandardMailClient, type MailClient } from './client.js';
import { cloneMailProviderMetadata, freezeMailRuntimeValue } from './runtime-freeze.js';
import type {
  MailResolvedClientConfig,
  MailProviderMetadata,
  MailRuntimeController,
} from './types.js';

export interface MailProviderDriver<TNativeClient = unknown> {
  readonly metadata: MailProviderMetadata;
  connect(config: MailResolvedClientConfig): Promise<MailClient<TNativeClient>>;
}

export interface CreateMailProviderDriverOptions<TNativeClient = unknown> {
  metadata: MailProviderMetadata;
  nativeFactory?: (config: MailResolvedClientConfig) => Promise<TNativeClient> | TNativeClient;
  runtimeController?: MailRuntimeController<TNativeClient>;
}

export function createMailProviderDriver<TNativeClient = unknown>(
  options: CreateMailProviderDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient> {
  const metadata = cloneMailProviderMetadata(options.metadata);

  return freezeMailRuntimeValue({
    metadata,
    async connect(config: MailResolvedClientConfig): Promise<MailClient<TNativeClient>> {
      const nativeClient = await (options.nativeFactory?.(config) ?? ({
        providerKey: metadata.providerKey,
        driverId: metadata.driverId,
        nativeConfig: config.nativeConfig ?? null,
      } as TNativeClient));

      return new StandardMailClient(
        metadata,
        createCapabilitySet({
          required: metadata.requiredCapabilities,
          optional: metadata.optionalCapabilities,
        }),
        {
          providerKey: config.providerKey,
          source: config.selectionSource,
        },
        nativeClient,
        options.runtimeController,
      );
    },
  });
}
