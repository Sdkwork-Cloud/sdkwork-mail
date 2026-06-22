export interface CreateMailTemplateRequest {
  templateKey: string;
  name: string;
  category: string;
  purpose: string;
  locale?: string;
  subjectTemplate: string;
  bodyHtmlTemplate?: string;
  bodyTextTemplate?: string;
  variableSchema?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
