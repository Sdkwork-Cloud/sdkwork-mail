export interface UpdateMailTemplateRequest {
  name?: string;
  category?: string;
  purpose?: string;
  subjectTemplate?: string;
  bodyHtmlTemplate?: string;
  bodyTextTemplate?: string;
  variableSchema?: Record<string, unknown>;
  status?: string;
  metadata?: Record<string, unknown>;
}
