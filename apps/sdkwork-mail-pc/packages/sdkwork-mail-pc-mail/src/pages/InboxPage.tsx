import { useEffect, useState } from "react";

import { MailMessageList } from "../components/MailMessageList";
import type { MailAppServices } from "../services/mailAppServices";
import type { MailAccount, MailFolder, MailMessage } from "../types/appApi";

interface InboxPageProps {
  services: MailAppServices;
  onOpenMessage(messageId: string): void;
}

export function InboxPage({ services, onOpenMessage }: InboxPageProps) {
  const [accounts, setAccounts] = useState<MailAccount[]>([]);
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadAccounts() {
      setLoading(true);
      setError(null);
      try {
        const nextAccounts = await services.listAccounts();
        if (cancelled) {
          return;
        }
        setAccounts(nextAccounts);
        setSelectedAccountId(nextAccounts[0]?.id ?? "");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load accounts");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void loadAccounts();
    return () => {
      cancelled = true;
    };
  }, [services]);

  useEffect(() => {
    if (!selectedAccountId) {
      setFolders([]);
      setSelectedFolderId("");
      return;
    }
    let cancelled = false;
    async function loadFolders() {
      try {
        const nextFolders = await services.listFolders(selectedAccountId);
        if (cancelled) {
          return;
        }
        setFolders(nextFolders);
        setSelectedFolderId(nextFolders[0]?.id ?? "");
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load folders");
        }
      }
    }
    void loadFolders();
    return () => {
      cancelled = true;
    };
  }, [selectedAccountId, services]);

  useEffect(() => {
    if (!selectedFolderId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    async function loadMessages() {
      try {
        const nextMessages = await services.listMessages(selectedFolderId);
        if (!cancelled) {
          setMessages(nextMessages);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load messages");
        }
      }
    }
    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [selectedFolderId, services]);

  if (loading) {
    return <p>Loading mail...</p>;
  }

  return (
    <section className="mail-inbox-page">
      <header className="mail-inbox-header">
        <h1>Inbox</h1>
        {error ? <p role="alert">{error}</p> : null}
      </header>
      <div className="mail-inbox-layout">
        <aside className="mail-folder-panel">
          <label htmlFor="mail-account-select">Account</label>
          <select
            id="mail-account-select"
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.displayName ?? account.emailAddress}
              </option>
            ))}
          </select>
          <ul className="mail-folder-list">
            {folders.map((folder) => (
              <li key={folder.id}>
                <button
                  type="button"
                  className={
                    selectedFolderId === folder.id
                      ? "mail-folder-item mail-folder-item-active"
                      : "mail-folder-item"
                  }
                  onClick={() => setSelectedFolderId(folder.id ?? "")}
                >
                  {folder.name} ({folder.unreadCount ?? 0})
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="mail-message-panel">
          <MailMessageList
            messages={messages}
            onSelect={onOpenMessage}
          />
        </main>
      </div>
    </section>
  );
}
