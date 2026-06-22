import type { MailTransportProviderAccount } from "../services/mailProviderAccountService";

interface Props {
  accounts: MailTransportProviderAccount[];
  loading?: boolean;
  error?: string | null;
  pingMessage?: string | null;
  syncMessage?: string | null;
  onPing?(account: MailTransportProviderAccount): Promise<void>;
  onSync?(account: MailTransportProviderAccount): Promise<void>;
}

export function MailProviderAccountList({
  accounts,
  loading,
  error,
  pingMessage,
  syncMessage,
  onPing,
  onSync,
}: Props) {
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
    <>
      {pingMessage ? <p className="admin-info">{pingMessage}</p> : null}
      {syncMessage ? <p className="admin-info">{syncMessage}</p> : null}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Kind</th>
            <th>Host</th>
            <th>Port</th>
            <th>TLS</th>
            <th>Status</th>
            {onPing || onSync ? <th>Actions</th> : null}
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
              {onPing || onSync ? (
                <td>
                  {onPing ? (
                    <button type="button" onClick={() => void onPing(account)}>
                      Ping
                    </button>
                  ) : null}
                  {onSync && account.providerKind === "imap" ? (
                    <button type="button" onClick={() => void onSync(account)}>
                      Sync
                    </button>
                  ) : null}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
