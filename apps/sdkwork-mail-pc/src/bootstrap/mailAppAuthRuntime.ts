import type { IamDeploymentMode, IamEnvironment } from "@sdkwork/iam-contracts";
import {
  createSdkworkAppbasePcAuthRuntime,
  type SdkworkAppbasePcAuthRuntimeComposition,
} from "@sdkwork/auth-runtime-pc-react";
import {
  applyMailIamSessionTokens,
  clearMailIamSessionTokens,
  getMailGlobalTokenManager,
  readMailIamSessionTokens,
  resetMailAppSdkClient,
  resolveAppSdkBaseUrl,
  type MailIamSession,
} from "@sdkwork/Mail-pc-core";

import { getAppSdkClient } from "./appClient";

export interface CreateMailAppAuthRuntimeOptions {
  appId: string;
  appbaseAppApiBaseUrl: string;
  MailAppApiBaseUrl: string;
  deploymentMode?: IamDeploymentMode;
  environment?: IamEnvironment;
}

let MailAppAuthRuntimeComposition: SdkworkAppbasePcAuthRuntimeComposition | null = null;

export function resetMailAuthenticatedSdkClients(): void {
  resetMailAppSdkClient();
}

export function createMailAppAuthRuntime(
  options: CreateMailAppAuthRuntimeOptions,
): SdkworkAppbasePcAuthRuntimeComposition {
  const composition = createSdkworkAppbasePcAuthRuntime({
    app: {
      appId: options.appId,
      deploymentMode: options.deploymentMode ?? "saas",
      environment: options.environment ?? "dev",
      platform: "pc",
    },
    baseUrls: {
      appbaseAppApiBaseUrl: resolveAppSdkBaseUrl(options.appbaseAppApiBaseUrl),
    },
    hooks: {
      onSessionChanged: () => {
        resetMailAuthenticatedSdkClients();
      },
    },
    sdkClients: [getAppSdkClient()],
    sessionBridge: {
      clearSession: clearMailIamSessionTokens,
      commitSession: (session) => applyMailIamSessionTokens(session as MailIamSession),
      readSession: readMailIamSessionTokens,
    },
    tokenManager: getMailGlobalTokenManager(),
  });

  MailAppAuthRuntimeComposition = composition;
  return composition;
}

export function getMailAppAuthRuntime(): SdkworkAppbasePcAuthRuntimeComposition | null {
  return MailAppAuthRuntimeComposition;
}

export function getMailIamRuntimeForAuth() {
  const composition = getMailAppAuthRuntime();
  if (!composition) {
    throw new Error("Mail IAM runtime is not configured.");
  }
  return composition.getRuntime();
}
