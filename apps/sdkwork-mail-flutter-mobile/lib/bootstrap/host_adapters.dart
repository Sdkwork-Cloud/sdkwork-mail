typedef MailMediaPermissionAdapter = Future<bool> Function();

class MailDeepLinkAdapter {
  const MailDeepLinkAdapter({
    required this.currentPath,
    required this.subscribe,
  });

  final String Function() currentPath;
  final void Function(void Function(String path) listener) subscribe;
}

class MailSecureStorageAdapter {
  const MailSecureStorageAdapter({
    required this.read,
    required this.write,
    required this.remove,
  });

  final String? Function(String key) read;
  final void Function(String key, String value) write;
  final void Function(String key) remove;
}

class MailHostAdapters {
  const MailHostAdapters({
    this.camera,
    this.microphone,
    this.deepLinks,
    this.pushNotifications,
    this.secureStorage,
  });

  final MailMediaPermissionAdapter? camera;
  final MailMediaPermissionAdapter? microphone;
  final MailDeepLinkAdapter? deepLinks;
  final Future<void> Function()? pushNotifications;
  final MailSecureStorageAdapter? secureStorage;
}

MailHostAdapters? _activeHostAdapters;

MailHostAdapters registerHostAdapters() {
  _activeHostAdapters ??= const MailHostAdapters(
    camera: null,
    microphone: null,
    deepLinks: null,
    pushNotifications: null,
    secureStorage: null,
  );
  return _activeHostAdapters!;
}

MailHostAdapters getHostAdapters() => registerHostAdapters();
