import type { MailTransactionalDeliveryRecord } from "../services/mailTransactionalAdminService";

interface MailTransactionalDeliveryListProps {
  items: MailTransactionalDeliveryRecord[];
  loading?: boolean;
  error?: string | null;
}

export function MailTransactionalDeliveryList({
  items,
  loading,
  error,
}: MailTransactionalDeliveryListProps) {
  if (loading) {
    return <p>Loading delivery audit...</p>;
  }
  if (error) {
    return <div className="admin-error">{error}</div>;
  }
  if (items.length === 0) {
    return <p>No transactional deliveries recorded yet.</p>;
  }
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Recipient</th>
          <th>Template</th>
          <th>Business</th>
          <th>Subject</th>
          <th>Status</th>
          <th>Sent At</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.recipientEmail}</td>
            <td>{item.templateKey}</td>
            <td>{item.businessKind}</td>
            <td>{item.subject}</td>
            <td>{item.status}</td>
            <td>{item.sentAt ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
