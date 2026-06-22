import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart';

export 'package:sdkwork_mail_flutter_mobile_core/sdkwork_mail_flutter_mobile_core.dart'
    show
        MailAppSession,
        defaultAppSession,
        defaultAppPermissionScope,
        legacyMailFlutterMobileSessionStorageKeys,
        MailFlutterMobileSessionStorageKey;

SharedPreferences? _preferences;
MailAppSession? _activeAppSession;

Future<void> initAppAuthStorage() async {
  _preferences ??= await SharedPreferences.getInstance();
  final raw = _preferences!.getString(MailFlutterMobileSessionStorageKey);
  if (raw != null && raw.isNotEmpty) {
    _activeAppSession = _parseStoredSession(raw);
    return;
  }

  for (final legacyKey in legacyMailFlutterMobileSessionStorageKeys) {
    final legacyRaw = _preferences!.getString(legacyKey);
    if (legacyRaw == null || legacyRaw.isEmpty) {
      continue;
    }
    final migrated = _parseStoredSession(legacyRaw);
    await _preferences!.remove(legacyKey);
    if (migrated != null) {
      _activeAppSession = migrated;
      await _preferences!.setString(
        MailFlutterMobileSessionStorageKey,
        jsonEncode(migrated.toJson()),
      );
      return;
    }
  }
}

MailAppSession? _parseStoredSession(String raw) {
  try {
    final decoded = jsonDecode(raw);
    if (decoded is Map<String, dynamic>) {
      final session = MailAppSession.fromJson(decoded);
      if (session.accessToken.isNotEmpty) {
        return session;
      }
    }
  } catch (_) {
    return null;
  }
  return null;
}

MailAppSession? loadAppSession() => _activeAppSession;

Future<void> saveAppSession(MailAppSession session) async {
  _activeAppSession = session;
  final prefs = _preferences ?? await SharedPreferences.getInstance();
  await prefs.setString(MailFlutterMobileSessionStorageKey, jsonEncode(session.toJson()));
  for (final legacyKey in legacyMailFlutterMobileSessionStorageKeys) {
    await prefs.remove(legacyKey);
  }
}

Future<void> clearAppSession() async {
  _activeAppSession = null;
  final prefs = _preferences ?? await SharedPreferences.getInstance();
  await prefs.remove(MailFlutterMobileSessionStorageKey);
  for (final legacyKey in legacyMailFlutterMobileSessionStorageKeys) {
    await prefs.remove(legacyKey);
  }
}

Future<MailAppSession?> consumeAppbaseCallbackSession(Uri? uri) async {
  final session = parseAppbaseCallbackSession(uri);
  if (session == null) {
    return null;
  }
  await saveAppSession(session);
  return session;
}

MailAppSession? bootstrapAppAuth() => loadAppSession();
