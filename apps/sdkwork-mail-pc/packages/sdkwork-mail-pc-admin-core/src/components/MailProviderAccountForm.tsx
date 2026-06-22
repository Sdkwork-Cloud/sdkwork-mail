import { useState } from "react";

import type { CreateMailProviderAccountCommand } from "../services/mailProviderAccountService";

interface MailProviderAccountFormProps {
  onSubmit(command: CreateMailProviderAccountCommand): Promise<void>;
}

const defaultForm: CreateMailProviderAccountCommand = {
  providerKind: "smtp",
  name: "",
  host: "",
  port: 587,
  useTls: true,
  credential: {
    username: "",
    secretRef: "env:SDKWORK_MAIL_SMTP_PASSWORD",
  },
};

export function MailProviderAccountForm({ onSubmit }: MailProviderAccountFormProps) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        credential:
          form.credential?.username.trim() && form.credential.secretRef.trim()
            ? form.credential
            : undefined,
      });
      setForm(defaultForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to create provider account",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={(event) => void handleSubmit(event)}>
      <h3>Create Transport Provider</h3>
      {error ? <div className="admin-error">{error}</div> : null}
      <label>
        Kind
        <select
          value={form.providerKind}
          onChange={(event) =>
            setForm({
              ...form,
              providerKind: event.target.value as CreateMailProviderAccountCommand["providerKind"],
              port: event.target.value === "imap" ? 993 : 587,
              credential: {
                username: form.credential?.username ?? "",
                secretRef:
                  event.target.value === "imap"
                    ? "env:SDKWORK_MAIL_IMAP_PASSWORD"
                    : "env:SDKWORK_MAIL_SMTP_PASSWORD",
              },
            })
          }
        >
          <option value="smtp">smtp</option>
          <option value="imap">imap</option>
        </select>
      </label>
      <label>
        Name
        <input
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
      </label>
      <label>
        Host
        <input
          required
          value={form.host}
          onChange={(event) => setForm({ ...form, host: event.target.value })}
        />
      </label>
      <label>
        Port
        <input
          required
          type="number"
          value={form.port}
          onChange={(event) => setForm({ ...form, port: Number(event.target.value) })}
        />
      </label>
      <label>
        Use TLS
        <input
          type="checkbox"
          checked={form.useTls}
          onChange={(event) => setForm({ ...form, useTls: event.target.checked })}
        />
      </label>
      <label>
        Credential Username
        <input
          value={form.credential?.username ?? ""}
          onChange={(event) =>
            setForm({
              ...form,
              credential: {
                username: event.target.value,
                secretRef: form.credential?.secretRef ?? "",
              },
            })
          }
        />
      </label>
      <label>
        Secret Ref
        <input
          value={form.credential?.secretRef ?? ""}
          onChange={(event) =>
            setForm({
              ...form,
              credential: {
                username: form.credential?.username ?? "",
                secretRef: event.target.value,
              },
            })
          }
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Provider"}
      </button>
    </form>
  );
}
