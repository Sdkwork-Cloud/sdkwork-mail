export interface MailTemplate {
  id?: string;
  templateKey?: string;
  name?: string;
  category?: string;
  purpose?: string;
  locale?: string;
  subjectTemplate?: string;
  bodyHtmlTemplate?: string;
  bodyTextTemplate?: string;
  status?: string;
}
