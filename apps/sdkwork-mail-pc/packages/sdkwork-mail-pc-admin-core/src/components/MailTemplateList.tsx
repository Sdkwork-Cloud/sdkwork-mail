import type { MailTemplateRecord } from "../services/mailTransactionalAdminService";

interface MailTemplateListProps {
  items: MailTemplateRecord[];
  loading?: boolean;
  error?: string | null;
  onEdit?(item: MailTemplateRecord): void;
  onDisable?(item: MailTemplateRecord): Promise<void>;
}

export function MailTemplateList({
  items,
  loading,
  error,
  onEdit,
  onDisable,
}: MailTemplateListProps) {
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
          {onEdit || onDisable ? <th>Actions</th> : null}
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
            {onEdit || onDisable ? (
              <td>
                {onEdit ? (
                  <button type="button" onClick={() => onEdit(item)}>
                    Edit
                  </button>
                ) : null}
                {onDisable && item.status === "active" ? (
                  <button type="button" onClick={() => void onDisable(item)}>
                    Disable
                  </button>
                ) : null}
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
