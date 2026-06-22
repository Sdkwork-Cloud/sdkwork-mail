import type { MailTemplateRecord } from "../services/mailTransactionalAdminService";

interface MailTemplateListProps {
  items: MailTemplateRecord[];
  loading?: boolean;
  error?: string | null;
}

export function MailTemplateList({ items, loading, error }: MailTemplateListProps) {
  if (loading) {
    return <p>Loading mail templates...</p>;
  }
  if (error) {
    return <div className="admin-error">{error}</div>;
  }
  if (items.length === 0) {
    return <p>No mail templates configured yet.</p>;
  }
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Name</th>
          <th>Category</th>
          <th>Purpose</th>
          <th>Locale</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.templateKey}</td>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.purpose}</td>
            <td>{item.locale}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
