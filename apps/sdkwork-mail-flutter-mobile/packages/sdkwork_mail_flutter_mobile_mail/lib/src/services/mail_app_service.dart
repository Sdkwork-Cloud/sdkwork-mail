import 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart';

import '../models/mail_account.dart';
import '../models/mail_folder.dart';
import '../models/mail_message.dart';

List<T> _readItems<T>(
  Map<String, dynamic> payload,
  T Function(Map<String, dynamic>) fromJson,
) {
  final items = payload['items'];
  if (items is! List<dynamic>) {
    return [];
  }
  return items
      .whereType<Map<String, dynamic>>()
      .map(fromJson)
      .toList();
}

class MailAppServices {
  MailAppServices(this._client);

  final AppApiClient _client;

  Future<List<MailAccount>> listAccounts() async {
    final data = await _client.getJson('/mail/accounts');
    return _readItems(data, MailAccount.fromJson);
  }

  Future<List<MailFolder>> listFolders({required String accountId}) async {
    final data = await _client.getJson(
      '/mail/folders',
      query: {'accountId': accountId},
    );
    return _readItems(data, MailFolder.fromJson);
  }

  Future<List<MailMessage>> listMessages({required String folderId}) async {
    final data = await _client.getJson(
      '/mail/messages',
      query: {'folderId': folderId},
    );
    return _readItems(data, MailMessage.fromJson);
  }

  Future<MailMessage> retrieveMessage(String messageId) async {
    final data = await _client.getJson('/mail/messages/${Uri.encodeComponent(messageId)}');
    return MailMessage.fromJson(data);
  }
}

MailAppServices createMailAppServices(AppApiClient client) {
  return MailAppServices(client);
}
