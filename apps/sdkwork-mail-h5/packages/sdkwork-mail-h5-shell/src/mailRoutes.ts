export interface AppRouteDefinition {
  path: string;
  label: string;
}

export function createMailAppRoutes(): AppRouteDefinition[] {
  return [
    { path: "#/mail/inbox", label: "Inbox" },
  ];
}
