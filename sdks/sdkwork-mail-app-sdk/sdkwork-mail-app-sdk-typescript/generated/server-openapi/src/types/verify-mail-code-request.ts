export interface VerifyMailCodeRequest {
  recipientEmail: string;
  purpose: string;
  code: string;
  challengeId?: string;
}
