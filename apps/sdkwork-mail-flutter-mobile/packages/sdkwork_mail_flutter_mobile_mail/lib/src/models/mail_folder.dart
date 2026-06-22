class MailFolder {
  const MailFolder({
    required this.id,
    required this.accountId,
    required this.name,
    this.folderKind,
    this.unreadCount,
    this.totalCount,
  });

  final String id;
  final String accountId;
  final String name;
  final String? folderKind;
  final int? unreadCount;
  final int? totalCount;

  factory MailFolder.fromJson(Map<String, dynamic> json) {
    return MailFolder(
      id: json['id']?.toString() ?? '',
      accountId: json['accountId']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      folderKind: json['folderKind']?.toString(),
      unreadCount: json['unreadCount'] as int?,
      totalCount: json['totalCount'] as int?,
    );
  }
}
