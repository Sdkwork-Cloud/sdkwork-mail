export function AdminRoutes() {
  return {
    routes: [
      { path: "#/admin/dashboard", label: "Dashboard" },
      { path: "#/admin/templates", label: "Mail Templates" },
      { path: "#/admin/deliveries", label: "Delivery Audit" },
      { path: "#/admin/provider-accounts", label: "Transport Providers" },
    ],
  };
}
