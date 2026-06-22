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
}
