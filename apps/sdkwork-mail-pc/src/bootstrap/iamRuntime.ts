import {
  applyMailIamSessionTokens,
  parseAppbaseCallbackSession,
  stripAppbaseCallbackFromLocation,
} from "@sdkwork/mail-pc-core";

import { createMailAppAuthRuntime } from "./mailAppAuthRuntime";
import { resolveEnvironment } from "./environment";

export function createIamRuntime() {
  const environment = resolveEnvironment();
  const composition = createMailAppAuthRuntime({
    appId: "sdkwork-mail-pc",
    appbaseAppApiBaseUrl: environment.appbaseAppApiBaseUrl,
    MailAppApiBaseUrl: environment.apiBaseUrl,
  });

  const callbackSession = parseAppbaseCallbackSession();
  if (callbackSession) {
    stripAppbaseCallbackFromLocation();
    applyMailIamSessionTokens({
      accessToken: callbackSession.accessToken,
      authToken: callbackSession.authToken,
      context: {
        appId: "sdkwork-mail-pc",
        authLevel: "password",
        dataScope: [],
        deploymentMode: "saas",
        environment: "dev",
        organizationId: callbackSession.organizationId,
        permissionScope: [],
        sessionId: "appbase-callback",
        tenantId: callbackSession.tenantId,
        userId: callbackSession.userId,
      },
    });
  }

  return {
    composition,
    runtime: composition.getRuntime(),
    session: callbackSession,
  };
}
