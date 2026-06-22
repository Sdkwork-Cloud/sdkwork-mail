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

class MailMarketingConsentRecord {
  const MailMarketingConsentRecord({
    required this.id,
    required this.recipientEmail,
    required this.status,
    required this.consentSource,
    required this.grantedAt,
    this.revokedAt,
  });

  final String id;
  final String recipientEmail;
  final String status;
  final String consentSource;
  final String grantedAt;
  final String? revokedAt;

  factory MailMarketingConsentRecord.fromJson(Map<String, dynamic> json) {
    return MailMarketingConsentRecord(
      id: json['id']?.toString() ?? '',
      recipientEmail: json['recipientEmail']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      consentSource: json['consentSource']?.toString() ?? '',
      grantedAt: json['grantedAt']?.toString() ?? '',
      revokedAt: json['revokedAt']?.toString(),
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

class CreateMailProviderCredentialInput {
  const CreateMailProviderCredentialInput({
    required this.username,
    required this.secretRef,
  });

  final String username;
  final String secretRef;

  Map<String, dynamic> toJson() => {
        'username': username,
        'secretRef': secretRef,
      };
}

class CreateMailProviderAccountCommand {
  const CreateMailProviderAccountCommand({
    required this.providerKind,
    required this.name,
    required this.host,
    required this.port,
    required this.useTls,
    this.credential,
  });

  final String providerKind;
  final String name;
  final String host;
  final int port;
  final bool useTls;
  final CreateMailProviderCredentialInput? credential;

  Map<String, dynamic> toJson() => {
        'providerKind': providerKind,
        'name': name,
        'host': host,
        'port': port,
        'useTls': useTls,
        if (credential != null) 'credential': credential!.toJson(),
      };
}

class MailProviderPingResult {
  const MailProviderPingResult({
    required this.providerKind,
    required this.accountId,
    required this.ok,
    required this.message,
  });

  final String providerKind;
  final String accountId;
  final bool ok;
  final String message;

  factory MailProviderPingResult.fromJson(Map<String, dynamic> json) {
    return MailProviderPingResult(
      providerKind: json['providerKind']?.toString() ?? '',
      accountId: json['accountId']?.toString() ?? '',
      ok: json['ok'] == true,
      message: json['message']?.toString() ?? '',
    );
  }
}

class MailProviderSyncResult {
  const MailProviderSyncResult({
    required this.providerKind,
    required this.providerAccountId,
    required this.mailAccountId,
    required this.folderId,
    required this.syncedCount,
    required this.message,
    this.highestUid,
    this.uidValidity,
  });

  final String providerKind;
  final String providerAccountId;
  final String mailAccountId;
  final String folderId;
  final int syncedCount;
  final String message;
  final int? highestUid;
  final int? uidValidity;

  factory MailProviderSyncResult.fromJson(Map<String, dynamic> json) {
    return MailProviderSyncResult(
      providerKind: json['providerKind']?.toString() ?? '',
      providerAccountId: json['providerAccountId']?.toString() ?? '',
      mailAccountId: json['mailAccountId']?.toString() ?? '',
      folderId: json['folderId']?.toString() ?? '',
      syncedCount: json['syncedCount'] is int
          ? json['syncedCount'] as int
          : int.tryParse('${json['syncedCount']}') ?? 0,
      message: json['message']?.toString() ?? '',
      highestUid: json['highestUid'] is int
          ? json['highestUid'] as int
          : int.tryParse('${json['highestUid']}'),
      uidValidity: json['uidValidity'] is int
          ? json['uidValidity'] as int
          : int.tryParse('${json['uidValidity']}'),
    );
  }
}
