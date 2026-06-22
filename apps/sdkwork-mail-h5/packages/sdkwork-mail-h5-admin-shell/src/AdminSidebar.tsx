export function AdminSidebar() {
  return (
    <nav className="admin-sidebar">
      <h2>Mail Admin</h2>
      <ul>
        <li><a href="#/admin/dashboard">Dashboard</a></li>
        <li><a href="#/admin/templates">Mail Templates</a></li>
        <li><a href="#/admin/deliveries">Delivery Audit</a></li>
        <li><a href="#/admin/provider-accounts">Transport Providers</a></li>
        <li><a href="#/mail/inbox">App: Inbox</a></li>
      </ul>
    </nav>
  );
}
