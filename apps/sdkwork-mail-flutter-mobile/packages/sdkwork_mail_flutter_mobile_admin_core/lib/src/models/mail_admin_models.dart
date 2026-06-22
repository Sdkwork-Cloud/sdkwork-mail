class MailTemplateRecord {
  const MailTemplateRecord({
    required this.id,
    required this.templateKey,
    required this.name,
    required this.category,
    required this.purpose,
    required this.locale,
    required this.subjectTemplate,
    required this.status,
    this.bodyHtmlTemplate,
    this.bodyTextTemplate,
  });

  final String id;
  final String templateKey;
  final String name;
  final String category;
  final String purpose;
  final String locale;
  final String subjectTemplate;
  final String status;
  final String? bodyHtmlTemplate;
  final String? bodyTextTemplate;

  factory MailTemplateRecord.fromJson(Map<String, dynamic> json) {
    return MailTemplateRecord(
      id: json['id']?.toString() ?? '',
      templateKey: json['templateKey']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      purpose: json['purpose']?.toString() ?? '',
      locale: json['locale']?.toString() ?? '',
      subjectTemplate: json['subjectTemplate']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      bodyHtmlTemplate: json['bodyHtmlTemplate']?.toString(),
      bodyTextTemplate: json['bodyTextTemplate']?.toString(),
    );
  }
}

class MailTransactionalDeliveryRecord {
  const MailTransactionalDeliveryRecord({
    required this.id,
    required this.templateKey,
    required this.businessKind,
    required this.recipientEmail,
    required this.subject,
    required this.status,
    required this.createdAt,
    this.sentAt,
  });

  final String id;
  final String templateKey;
  final String businessKind;
  final String recipientEmail;
  final String subject;
  final String status;
  final String createdAt;
  final String? sentAt;

  factory MailTransactionalDeliveryRecord.fromJson(Map<String, dynamic> json) {
    return MailTransactionalDeliveryRecord(
      id: json['id']?.toString() ?? '',
      templateKey: json['templateKey']?.toString() ?? '',
      businessKind: json['businessKind']?.toString() ?? '',
      recipientEmail: json['recipientEmail']?.toString() ?? '',
      subject: json['subject']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      createdAt: json['createdAt']?.toString() ?? '',
      sentAt: json['sentAt']?.toString(),
    );
  }
}

class MailTransportProviderAccount {
  const MailTransportProviderAccount({
    required this.id,
    required this.providerKind,
    required this.name,
    required this.host,
    required this.port,
    required this.useTls,
    required this.status,
  });

  final String id;
  final String providerKind;
  final String name;
  final String host;
  final int port;
  final bool useTls;
  final String status;

  factory MailTransportProviderAccount.fromJson(Map<String, dynamic> json) {
    return MailTransportProviderAccount(
      id: json['id']?.toString() ?? '',
      providerKind: json['providerKind']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      host: json['host']?.toString() ?? '',
      port: json['port'] is int ? json['port'] as int : int.tryParse('${json['port']}') ?? 0,
      useTls: json['useTls'] == true,
      status: json['status']?.toString() ?? '',
    );
  }
}
