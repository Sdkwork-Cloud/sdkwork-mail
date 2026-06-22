import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
  MailResolvedClientConfig,
  MailSessionDescriptor,
} from '@sdkwork/Mail-sdk';

export interface MailVolcengineWebSdkModule {
  createEngine(appId: string, config?: Record<string, unknown>): MailVolcengineWebEngineLike;
  destroyEngine(engine: MailVolcengineWebEngineLike): void;
}

export interface MailVolcengineWebSdkModuleNamespace {
  default?: MailVolcengineWebSdkModule;
}

export type MailVolcengineWebSdkModuleLoadResult =
  | MailVolcengineWebSdkModule
  | MailVolcengineWebSdkModuleNamespace;

export interface MailVolcengineWebEngineLike {
  joinRoom(
    token: string | null,
    roomId: string,
    userInfo: {
      userId: string;
      extraInfo?: string;
    },
    roomConfig?: Record<string, unknown>,
  ): Promise<void>;
  leaveRoom(waitAck?: boolean): Promise<void>;
  publishStream(mediaType: 'audio' | 'video'): Promise<void>;
  unpublishStream(mediaType: 'audio' | 'video'): Promise<void>;
  startScreenCapture(config?: Record<string, unknown>): Promise<unknown>;
  stopScreenCapture(): Promise<void>;
  publishScreen(): Promise<void>;
  unpublishScreen(): Promise<void>;
  startVideoCapture(deviceId?: string): Promise<unknown>;
  stopVideoCapture(): Promise<void>;
  startAudioCapture(deviceId?: string): Promise<unknown>;
  stopAudioCapture(): Promise<void>;
}

export interface MailVolcengineWebNativeConfig {
  appId?: string;
  engineConfig?: Record<string, unknown>;
  roomConfig?: Record<string, unknown>;
  userExtraInfo?: Record<string, unknown>;
  capture?: {
    audioDeviceId?: string;
    videoDeviceId?: string;
    screen?: Record<string, unknown>;
  };
}

export interface MailVolcengineOfficialWebNativeClient {
  readonly resolvedConfig: MailResolvedClientConfig;
  readonly loadSdk: () => Promise<MailVolcengineWebSdkModuleLoadResult>;
  sdkModule?: MailVolcengineWebSdkModule;
  engine?: MailVolcengineWebEngineLike;
  joinedSession?: MailSessionDescriptor;
  publishedTracks: Map<string, 'audio' | 'video' | 'screen-share'>;
  mutedMediaKinds: Set<'audio' | 'video'>;
}

export interface CreateOfficialVolcengineWebMailDriverOptions {
  loadSdk?: () => Promise<MailVolcengineWebSdkModuleLoadResult>;
}

export const VOLCENGINE_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export function createOfficialVolcengineWebMailDriver(
  options?: CreateOfficialVolcengineWebMailDriverOptions,
): MailProviderDriver<MailVolcengineOfficialWebNativeClient>;

export type CreateVolcengineMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
> &
  CreateOfficialVolcengineWebMailDriverOptions;

export function createVolcengineMailDriver<TNativeClient = unknown>(
  options?: CreateVolcengineMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient | MailVolcengineOfficialWebNativeClient>;

export const VOLCENGINE_mail_PROVIDER_MODULE: MailProviderModule;
