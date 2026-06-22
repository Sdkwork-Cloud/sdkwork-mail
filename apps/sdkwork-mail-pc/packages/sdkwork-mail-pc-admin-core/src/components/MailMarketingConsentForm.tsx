import { useState } from "react";

import type { GrantMailMarketingConsentCommand } from "../services/mailMarketingConsentAdminService";

interface MailMarketingConsentFormProps {
  onSubmit(command: GrantMailMarketingConsentCommand): Promise<void>;
}

const defaultForm: GrantMailMarketingConsentCommand = {
  recipientEmail: "",
  consentSource: "admin",
};

export function MailMarketingConsentForm({ onSubmit }: MailMarketingConsentFormProps) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      setForm(defaultForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to grant marketing consent",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={(event) => void handleSubmit(event)}>
      <h3>Grant Marketing Consent</h3>
      {error ? <div className="admin-error">{error}</div> : null}
      <label>
        Recipient Email
        <input
          required
          type="email"
          value={form.recipientEmail}
          onChange={(event) => setForm({ ...form, recipientEmail: event.target.value })}
        />
      </label>
      <label>
        Consent Source
        <input
          value={form.consentSource ?? "admin"}
          onChange={(event) => setForm({ ...form, consentSource: event.target.value })}
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Granting..." : "Grant Consent"}
      </button>
    </form>
  );
}
