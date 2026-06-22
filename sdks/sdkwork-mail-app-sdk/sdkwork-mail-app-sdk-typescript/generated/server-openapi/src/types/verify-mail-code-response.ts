export interface VerifyMailCodeResponse {
  verified?: boolean;
  challengeId?: string;
  consumedAt?: string;
}
