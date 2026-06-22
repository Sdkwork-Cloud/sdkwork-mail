import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  SdkworkIamAuthRoutes,
  type SdkworkIamAuthRoutesProps,
} from "@sdkwork/auth-pc-react";
import {
  isMailIamSessionAuthenticated,
  readMailIamSessionTokens,
  mail_IAM_SESSION_CHANGED_EVENT,
  type MailIamSession,
} from "@sdkwork/Mail-pc-core";

import { getMailIamRuntimeForAuth } from "./bootstrap/MailAppAuthRuntime";
import {
  resolveMailAuthAppearance,
  resolveMailAuthLocale,
  resolveMailAuthRuntimeConfig,
} from "./bootstrap/MailAuthConfig";

const AUTH_BASE_PATH = "/auth";
export const mail_APP_HOME_PATH = "/mail/inbox";

interface AppAuthGateProps {
  children: ReactNode;
  homePath?: string;
}

function isAuthRoute(pathname: string): boolean {
  return pathname === AUTH_BASE_PATH || pathname.startsWith(`${AUTH_BASE_PATH}/`);
}

function resolveRedirectTarget(pathname: string, search: string, hash: string, homePath: string): string {
  const target = `${pathname}${search}${hash}`;
  if (isAuthRoute(pathname)) {
    return homePath;
  }
  return target || homePath;
}

function buildAuthLoginPath(redirectTarget: string): string {
  const params = new URLSearchParams();
  params.set("redirect", redirectTarget || mail_APP_HOME_PATH);
  return `${AUTH_BASE_PATH}/login?${params.toString()}`;
}

export function AppAuthGate({ children, homePath = mail_APP_HOME_PATH }: AppAuthGateProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<MailIamSession | null>(() => readMailIamSessionTokens());

  const redirectTarget = useMemo(
    () => resolveRedirectTarget(location.pathname, location.search, location.hash, homePath),
    [homePath, location.hash, location.pathname, location.search],
  );
  const isAuthenticated = isMailIamSessionAuthenticated(session);
  const isAuthPath = isAuthRoute(location.pathname);

  useEffect(() => {
    setSession(readMailIamSessionTokens());
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleSessionChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ session?: MailIamSession | null }>).detail;
      setSession(detail?.session ?? readMailIamSessionTokens());
    };

    window.addEventListener(mail_IAM_SESSION_CHANGED_EVENT, handleSessionChanged);
    return () => window.removeEventListener(mail_IAM_SESSION_CHANGED_EVENT, handleSessionChanged);
  }, []);

  useEffect(() => {
    if (isAuthenticated || isAuthPath) {
      return;
    }
    navigate(buildAuthLoginPath(redirectTarget), { replace: true });
  }, [isAuthPath, isAuthenticated, navigate, redirectTarget]);

  if (isAuthenticated && isAuthPath) {
    return <Navigate replace to={redirectTarget} />;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <SdkworkIamAuthRoutes
      appearance={resolveMailAuthAppearance()}
      basePath={AUTH_BASE_PATH}
      getRuntime={getMailIamRuntimeForAuth as SdkworkIamAuthRoutesProps["getRuntime"]}
      homePath={homePath}
      locale={resolveMailAuthLocale()}
      routerContextMode="external"
      runtimeConfig={resolveMailAuthRuntimeConfig()}
      viewportMode="flow"
    />
  );
}
