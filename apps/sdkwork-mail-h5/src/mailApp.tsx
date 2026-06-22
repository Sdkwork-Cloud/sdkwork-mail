import { useMemo } from "react";
import { AppLayout } from "@sdkwork/Mail-h5-shell";
import {
  InboxPage,
  MessagePage,
  createMailInboxWorkspaceManifest,
} from "@sdkwork/Mail-h5-Mail";

import { createAppServices } from "./bootstrap/appServices";

interface MailAppProps {
  route: string;
}

function parseMessageRoute(route: string): string | null {
  const match = route.match(/^\/mail\/messages\/([^/]+)$/u);
  return match?.[1] ?? null;
}

export function MailApp({ route }: MailAppProps) {
  const services = useMemo(() => createAppServices(), []);
  const workspace = useMemo(() => createMailInboxWorkspaceManifest(), []);
  const messageId = parseMessageRoute(route);
  const activePath = route.startsWith("/mail") ? route : workspace.routePath;

  const renderRoute = () => {
    if (messageId) {
      return <MessagePage services={services} messageId={messageId} />;
    }

    if (route === "/mail/inbox" || route === workspace.routePath) {
      return (
        <InboxPage
          services={services}
          onOpenMessage={(id) => {
            window.location.hash = `#/mail/messages/${id}`;
          }}
        />
      );
    }

    return (
      <div>
        <h2>Page Not Found</h2>
        <p>Unknown mail route: {route}</p>
        <a href="#/mail/inbox">Go to inbox</a>
      </div>
    );
  };

  return <AppLayout activePath={activePath}>{renderRoute()}</AppLayout>;
}
