export interface SendMailVerificationResponse {
  challengeId?: string;
  deliveryId?: string;
  expiresAt?: string;
  recipientEmail?: string;
}
