import 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart';

import '../models/active_provider_profile.dart';

class ProviderProfileService {
  final AppApiClient _client;

  ProviderProfileService(this._client);

  Future<List<MailActiveProviderProfile>> listActive() async {
    final data = await _client.getJson('/Mail/provider_profiles/active');
    final items = data['items'];
    if (items is! List<dynamic>) return [];
    return items
        .whereType<Map<String, dynamic>>()
        .map(MailActiveProviderProfile.fromJson)
        .toList();
  }

  String? resolveDefaultProviderAppId(List<MailActiveProviderProfile> profiles) {
    for (final profile in profiles) {
      if (profile.isDefault && (profile.providerAppId?.isNotEmpty ?? false)) {
        return profile.providerAppId;
      }
    }
    for (final profile in profiles) {
      if (profile.providerAppId?.isNotEmpty ?? false) {
        return profile.providerAppId;
      }
    }
    return null;
  }
}
