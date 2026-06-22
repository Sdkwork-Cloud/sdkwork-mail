export interface AppRouteDefinition {
  path: string;
  label: string;
}

export function createMailAppRoutes(): AppRouteDefinition[] {
  return [
    { path: "#/Mail/mail-inboxs", label: "mail inboxs" },
  ];
}
