import '../models/mail_admin_models.dart';
import 'backend_api_client.dart';

List<T> _readItems<T>(
  Map<String, dynamic> payload,
  T Function(Map<String, dynamic>) fromJson,
) {
  final items = payload['items'];
  if (items is! List<dynamic>) {
    return [];
  }
  return items.whereType<Map<String, dynamic>>().map(fromJson).toList();
}

class MailTemplateAdminService {
  MailTemplateAdminService(this._client);

  final BackendApiClient _client;

  Future<List<MailTemplateRecord>> list({
    String? category,
    String? purpose,
  }) async {
    final query = <String, String>{};
    if (category != null) query['category'] = category;
    if (purpose != null) query['purpose'] = purpose;
    final data = await _client.getJson(
      '/mail/templates',
      query: query.isEmpty ? null : query,
    );
    return _readItems(data, MailTemplateRecord.fromJson);
  }
}

class MailTransactionalDeliveryAdminService {
  MailTransactionalDeliveryAdminService(this._client);

  final BackendApiClient _client;

  Future<List<MailTransactionalDeliveryRecord>> list({
    String? businessKind,
    String? recipientEmail,
  }) async {
    final query = <String, String>{};
    if (businessKind != null) query['businessKind'] = businessKind;
    if (recipientEmail != null) query['recipientEmail'] = recipientEmail;
    final data = await _client.getJson(
      '/mail/transactional_deliveries',
      query: query.isEmpty ? null : query,
    );
    return _readItems(data, MailTransactionalDeliveryRecord.fromJson);
  }
}

class MailProviderAccountService {
  MailProviderAccountService(this._client);

  final BackendApiClient _client;

  Future<List<MailTransportProviderAccount>> list() async {
    final data = await _client.getJson('/mail/provider_accounts');
    return _readItems(data, MailTransportProviderAccount.fromJson);
  }

  Future<MailTransportProviderAccount> create(
    CreateMailProviderAccountCommand command,
  ) async {
    final data = await _client.postJson('/mail/provider_accounts', command.toJson());
    final account = data['account'];
    if (account is! Map<String, dynamic>) {
      throw StateError('Invalid response: missing provider account data');
    }
    return MailTransportProviderAccount.fromJson(account);
  }

  Future<MailProviderPingResult> ping(String accountId) async {
    final data = await _client.postJson('/mail/provider_accounts/$accountId/ping', {});
    return MailProviderPingResult.fromJson(data);
  }

  Future<MailProviderSyncResult> sync(String accountId) async {
    final data = await _client.postJson('/mail/provider_accounts/$accountId/sync', {});
    return MailProviderSyncResult.fromJson(data);
  }
}

class MailMarketingConsentAdminService {
  MailMarketingConsentAdminService(this._client);

  final BackendApiClient _client;

  Future<List<MailMarketingConsentRecord>> list({String? recipientEmail}) async {
    final query = recipientEmail == null ? null : {'recipientEmail': recipientEmail};
    final data = await _client.getJson(
      '/mail/marketing_consents',
      query: query,
    );
    return _readItems(data, MailMarketingConsentRecord.fromJson);
  }

  Future<MailMarketingConsentRecord> grant({
    required String recipientEmail,
    String? consentSource,
  }) async {
    final data = await _client.postJson('/mail/marketing_consents', {
      'recipientEmail': recipientEmail,
      if (consentSource != null) 'consentSource': consentSource,
    });
    return MailMarketingConsentRecord.fromJson(data);
  }

  Future<MailMarketingConsentRecord> revoke(String consentId) async {
    final data = await _client.postJson('/mail/marketing_consents/$consentId/revoke', {});
    return MailMarketingConsentRecord.fromJson(data);
  }
}
