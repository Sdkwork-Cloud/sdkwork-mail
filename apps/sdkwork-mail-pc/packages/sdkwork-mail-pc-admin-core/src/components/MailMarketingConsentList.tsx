import type { MailMarketingConsentRecord } from "../services/mailMarketingConsentAdminService";

interface MailMarketingConsentListProps {
  items: MailMarketingConsentRecord[];
  loading?: boolean;
  error?: string | null;
  onRevoke?(item: MailMarketingConsentRecord): Promise<void>;
}

export function MailMarketingConsentList({
  items,
  loading,
  error,
  onRevoke,
}: MailMarketingConsentListProps) {
  if (loading) {
    return <p>Loading marketing consents...</p>;
  }
  if (error) {
    return <div className="admin-error">{error}</div>;
  }
  if (items.length === 0) {
    return <p>No marketing consents recorded yet.</p>;
  }
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Recipient</th>
          <th>Status</th>
          <th>Source</th>
          <th>Granted At</th>
          <th>Revoked At</th>
          {onRevoke ? <th>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.recipientEmail}</td>
            <td>{item.status}</td>
            <td>{item.consentSource}</td>
            <td>{item.grantedAt}</td>
            <td>{item.revokedAt ?? "-"}</td>
            {onRevoke && item.status === "active" ? (
              <td>
                <button type="button" onClick={() => void onRevoke(item)}>
                  Revoke
                </button>
              </td>
            ) : onRevoke ? (
              <td>-</td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
