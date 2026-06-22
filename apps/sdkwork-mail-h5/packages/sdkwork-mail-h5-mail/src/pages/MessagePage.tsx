import { useEffect, useState } from "react";

import type { MailAppServices } from "../services/mailAppServices";
import type { MailMessage } from "../types/appApi";

interface MessagePageProps {
  services: MailAppServices;
  messageId: string;
}

export function MessagePage({ services, messageId }: MessagePageProps) {
  const [message, setMessage] = useState<MailMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMessage() {
      setError(null);
      try {
        const nextMessage = await services.retrieveMessage(messageId);
        if (!cancelled) {
          setMessage(nextMessage);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load message");
        }
      }
    }
    void loadMessage();
    return () => {
      cancelled = true;
    };
  }, [messageId, services]);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!message) {
    return <p>Loading message...</p>;
  }

  return (
    <article className="mail-message-page">
      <header>
        <h1>{message.subject ?? "(no subject)"}</h1>
        <p>{message.fromEmail}</p>
      </header>
      <section>
        {message.bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: message.bodyHtml }} />
        ) : (
          <pre>{message.bodyText ?? message.snippet ?? ""}</pre>
        )}
      </section>
    </article>
  );
}
