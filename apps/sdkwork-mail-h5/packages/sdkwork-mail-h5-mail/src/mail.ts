export interface MailWorkspaceManifest {
  routePath: string;
  messageRoutePattern: string;
  title: string;
}

export function createMailInboxWorkspaceManifest(): MailWorkspaceManifest {
  return {
    routePath: "/mail/inbox",
    messageRoutePattern: "/mail/messages/:messageId",
    title: "Mail",
  };
}

export const MailPackageMeta = {
  architecture: "pc-react",
  domain: "communication",
  package: "sdkwork-mail-pc-mail",
  status: "ready",
} as const;
