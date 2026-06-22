class MailAccount {
  const MailAccount({
    required this.id,
    required this.emailAddress,
    this.displayName,
    this.providerKind,
    this.status,
    this.syncEnabled,
  });

  final String id;
  final String emailAddress;
  final String? displayName;
  final String? providerKind;
  final String? status;
  final bool? syncEnabled;

  factory MailAccount.fromJson(Map<String, dynamic> json) {
    return MailAccount(
      id: json['id']?.toString() ?? '',
      emailAddress: json['emailAddress']?.toString() ?? '',
      displayName: json['displayName']?.toString(),
      providerKind: json['providerKind']?.toString(),
      status: json['status']?.toString(),
      syncEnabled: json['syncEnabled'] as bool?,
    );
  }
}
