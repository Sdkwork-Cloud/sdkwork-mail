import { useState } from "react";

import type { CreateMailTemplateCommand } from "../services/mailTransactionalAdminService";

interface MailTemplateFormProps {
  onSubmit(command: CreateMailTemplateCommand): Promise<void>;
}

const defaultForm: CreateMailTemplateCommand = {
  templateKey: "",
  name: "",
  category: "transactional",
  purpose: "login_verification",
  locale: "zh-CN",
  subjectTemplate: "",
  bodyHtmlTemplate: "",
  bodyTextTemplate: "",
};

export function MailTemplateForm({ onSubmit }: MailTemplateFormProps) {
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
        bodyHtmlTemplate: form.bodyHtmlTemplate?.trim() || undefined,
        bodyTextTemplate: form.bodyTextTemplate?.trim() || undefined,
      });
      setForm(defaultForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create template");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={(event) => void handleSubmit(event)}>
      <h3>Create Template</h3>
      {error ? <div className="admin-error">{error}</div> : null}
      <label>
        Template Key
        <input
          required
          value={form.templateKey}
          onChange={(event) => setForm({ ...form, templateKey: event.target.value })}
        />
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
        Category
        <select
          value={form.category}
          onChange={(event) =>
            setForm({
              ...form,
              category: event.target.value as CreateMailTemplateCommand["category"],
            })
          }
        >
          <option value="transactional">transactional</option>
          <option value="marketing">marketing</option>
        </select>
      </label>
      <label>
        Purpose
        <input
          required
          value={form.purpose}
          onChange={(event) => setForm({ ...form, purpose: event.target.value })}
        />
      </label>
      <label>
        Locale
        <input
          value={form.locale ?? "zh-CN"}
          onChange={(event) => setForm({ ...form, locale: event.target.value })}
        />
      </label>
      <label>
        Subject Template
        <input
          required
          value={form.subjectTemplate}
          onChange={(event) => setForm({ ...form, subjectTemplate: event.target.value })}
        />
      </label>
      <label>
        HTML Body Template
        <textarea
          rows={4}
          value={form.bodyHtmlTemplate ?? ""}
          onChange={(event) => setForm({ ...form, bodyHtmlTemplate: event.target.value })}
        />
      </label>
      <label>
        Text Body Template
        <textarea
          rows={4}
          value={form.bodyTextTemplate ?? ""}
          onChange={(event) => setForm({ ...form, bodyTextTemplate: event.target.value })}
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Template"}
      </button>
    </form>
  );
}
