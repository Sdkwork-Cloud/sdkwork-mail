import type {
  CreateMailProviderDriverOptions,
  MailProviderCatalogEntry,
  MailProviderDriver,
  MailProviderModule,
  MailResolvedClientConfig,
  MailSessionDescriptor,
} from '@sdkwork/Mail-sdk';

export interface MailTencentWebSdkModule {
  create(): MailTencentWebTMailLike;
}

export interface MailTencentWebSdkModuleNamespace {
  default?: MailTencentWebSdkModule;
}

export type MailTencentWebSdkModuleLoadResult =
  | MailTencentWebSdkModule
  | MailTencentWebSdkModuleNamespace;

export interface MailTencentWebTMailLike {
  enterRoom(options: MailTencentWebEnterRoomOptions): Promise<void>;
  exitRoom(): Promise<void>;
  destroy?(): Promise<void> | void;
  startLocalAudio(options?: MailTencentWebAudioOptions): Promise<void>;
  stopLocalAudio(): Promise<void>;
  startLocalVideo(options?: MailTencentWebVideoOptions): Promise<void>;
  stopLocalVideo(): Promise<void>;
  startScreenShare(options?: MailTencentWebScreenShareOptions): Promise<void>;
  stopScreenShare(): Promise<void>;
}

export interface MailTencentWebEnterRoomOptions {
  sdkAppId: number;
  roomId: number | string;
  userId: string;
  userSig: string;
  scene?: string;
  role?: string;
  privateMapKey?: string;
}

export interface MailTencentWebAudioOptions {
  microphoneId?: string;
  profile?: string;
  [key: string]: unknown;
}

export interface MailTencentWebVideoOptions {
  cameraId?: string;
  view?: unknown;
  profile?: string;
  [key: string]: unknown;
}

export interface MailTencentWebScreenShareOptions {
  option?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MailTencentWebNativeConfig {
  sdkAppId?: number | string;
  userSig?: string;
  scene?: string;
  role?: string;
  privateMapKey?: string;
  audio?: MailTencentWebAudioOptions;
  video?: MailTencentWebVideoOptions;
  screen?: MailTencentWebScreenShareOptions;
}

export interface MailTencentOfficialWebNativeClient {
  readonly resolvedConfig: MailResolvedClientConfig;
  readonly loadSdk: () => Promise<MailTencentWebSdkModuleLoadResult>;
  sdkModule?: MailTencentWebSdkModule;
  tMail?: MailTencentWebTMailLike;
  joinedSession?: MailSessionDescriptor;
  publishedTracks: Map<string, 'audio' | 'video' | 'screen-share'>;
  mutedMediaKinds: Set<'audio' | 'video'>;
}

export interface CreateOfficialTencentWebMailDriverOptions {
  loadSdk?: () => Promise<MailTencentWebSdkModuleLoadResult>;
}

export const TENCENT_mail_PROVIDER_METADATA: MailProviderCatalogEntry;

export function createOfficialTencentWebMailDriver(
  options?: CreateOfficialTencentWebMailDriverOptions,
): MailProviderDriver<MailTencentOfficialWebNativeClient>;

export type CreateTencentMailDriverOptions<TNativeClient = unknown> = Omit<
  CreateMailProviderDriverOptions<TNativeClient>,
  'metadata'
> &
  CreateOfficialTencentWebMailDriverOptions;

export function createTencentMailDriver<TNativeClient = unknown>(
  options?: CreateTencentMailDriverOptions<TNativeClient>,
): MailProviderDriver<TNativeClient | MailTencentOfficialWebNativeClient>;

export const TENCENT_mail_PROVIDER_MODULE: MailProviderModule;
