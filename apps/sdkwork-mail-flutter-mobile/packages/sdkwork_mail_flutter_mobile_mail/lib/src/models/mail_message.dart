class MailMessage {
  const MailMessage({
    required this.id,
    required this.accountId,
    required this.folderId,
    this.threadId,
    this.fromEmail,
    this.subject,
    this.snippet,
    this.bodyText,
    this.bodyHtml,
    this.isRead,
    this.isStarred,
    this.isDraft,
    this.hasAttachments,
  });

  final String id;
  final String accountId;
  final String folderId;
  final String? threadId;
  final String? fromEmail;
  final String? subject;
  final String? snippet;
  final String? bodyText;
  final String? bodyHtml;
  final bool? isRead;
  final bool? isStarred;
  final bool? isDraft;
  final bool? hasAttachments;

  factory MailMessage.fromJson(Map<String, dynamic> json) {
    return MailMessage(
      id: json['id']?.toString() ?? '',
      accountId: json['accountId']?.toString() ?? '',
      folderId: json['folderId']?.toString() ?? '',
      threadId: json['threadId']?.toString(),
      fromEmail: json['fromEmail']?.toString(),
      subject: json['subject']?.toString(),
      snippet: json['snippet']?.toString(),
      bodyText: json['bodyText']?.toString(),
      bodyHtml: json['bodyHtml']?.toString(),
      isRead: json['isRead'] as bool?,
      isStarred: json['isStarred'] as bool?,
      isDraft: json['isDraft'] as bool?,
      hasAttachments: json['hasAttachments'] as bool?,
    );
  }
}
