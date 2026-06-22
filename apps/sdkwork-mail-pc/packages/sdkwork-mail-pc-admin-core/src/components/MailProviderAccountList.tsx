import type { MailTransportProviderAccount } from "../services/mailProviderAccountService";

interface Props {
  accounts: MailTransportProviderAccount[];
  loading?: boolean;
  error?: string | null;
}

export function MailProviderAccountList({ accounts, loading, error }: Props) {
  if (loading) {
    return <p>Loading transport provider accounts...</p>;
  }
  if (error) {
    return <div className="admin-error">{error}</div>;
  }
  if (accounts.length === 0) {
    return <p>No SMTP/IMAP provider accounts configured yet.</p>;
  }
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Kind</th>
          <th>Host</th>
          <th>Port</th>
          <th>TLS</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <tr key={account.id}>
            <td>{account.name}</td>
            <td>{account.providerKind}</td>
            <td>{account.host}</td>
            <td>{account.port}</td>
            <td>{account.useTls ? "yes" : "no"}</td>
            <td>{account.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
