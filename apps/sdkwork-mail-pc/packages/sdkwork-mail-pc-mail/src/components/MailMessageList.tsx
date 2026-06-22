import type { MailMessage } from "../types/appApi";

interface MailMessageListProps {
  messages: readonly MailMessage[];
  selectedMessageId?: string;
  onSelect(messageId: string): void;
}

export function MailMessageList({
  messages,
  selectedMessageId,
  onSelect,
}: MailMessageListProps) {
  if (messages.length === 0) {
    return <p className="mail-empty-state">No messages in this folder.</p>;
  }

  return (
    <ul className="mail-message-list">
      {messages.map((message) => (
        <li key={message.id}>
          <button
            type="button"
            className={
              selectedMessageId === message.id
                ? "mail-message-item mail-message-item-active"
                : "mail-message-item"
            }
            onClick={() => onSelect(message.id ?? "")}
          >
            <strong>{message.subject ?? "(no subject)"}</strong>
            <span>{message.fromEmail}</span>
            <span>{message.snippet}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
