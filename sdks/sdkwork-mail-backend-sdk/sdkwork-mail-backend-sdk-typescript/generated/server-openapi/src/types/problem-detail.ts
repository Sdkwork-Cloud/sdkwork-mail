export interface ProblemDetail {
  code?: string;
  message?: string;
  requestId?: string;
  data?: Record<string, unknown>;
}
