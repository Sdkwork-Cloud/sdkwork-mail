export interface CreateMailAttachmentInput {
  /** Drive node id produced by sdkwork-drive-app-sdk upload flow. */
  driveNodeId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  checksumSha256?: string;
}
