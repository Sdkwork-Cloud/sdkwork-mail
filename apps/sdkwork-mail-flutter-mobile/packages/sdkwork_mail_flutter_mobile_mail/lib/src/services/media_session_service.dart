import 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart';

import '../models/media_session.dart';

class MailInboxListParams {
  final int? page;
  final int? pageSize;
  final String? cursor;
  final String? search;
  final String? sort;

  const MailInboxListParams({
    this.page,
    this.pageSize,
    this.cursor,
    this.search,
    this.sort,
  });
}

class MailInboxListResult {
  final List<MailMailInbox> items;
  final String? nextCursor;

  const MailInboxListResult({
    required this.items,
    this.nextCursor,
  });
}

class MailInboxService {
  final AppApiClient _client;

  MailInboxService(this._client);

  Future<MailInboxListResult> list([MailInboxListParams? params]) async {
    final query = <String, String>{};
    if (params?.page != null) query['page'] = params!.page.toString();
    if (params?.pageSize != null) query['pageSize'] = params!.pageSize.toString();
    if (params?.cursor != null) query['cursor'] = params!.cursor!;
    if (params?.search != null) query['q'] = params!.search!;
    if (params?.sort != null) query['sort'] = params!.sort!;

    final data = await _client.getJson(
      '/Mail/media_sessions',
      query: query.isEmpty ? null : query,
    );
    final items = data['items'];
    final sessions = items is List<dynamic>
        ? items
            .whereType<Map<String, dynamic>>()
            .map(MailMailInbox.fromJson)
            .toList()
        : <MailMailInbox>[];
    final nextCursor = data['nextCursor'] as String?;
    return MailInboxListResult(
      items: sessions,
      nextCursor: nextCursor != null && nextCursor.isNotEmpty ? nextCursor : null,
    );
  }

  Future<MailMailInbox> get(String MailInboxId) async {
    final data = await _client.getJson(
      '/Mail/media_sessions/${Uri.encodeComponent(MailInboxId)}',
    );
    return MailMailInbox.fromJson(data);
  }

  Future<MailMailInbox> create(MailCreateMailInboxRequest body) async {
    final data = await _client.postJson('/Mail/media_sessions', body.toJson());
    return MailMailInbox.fromJson(data);
  }
}
