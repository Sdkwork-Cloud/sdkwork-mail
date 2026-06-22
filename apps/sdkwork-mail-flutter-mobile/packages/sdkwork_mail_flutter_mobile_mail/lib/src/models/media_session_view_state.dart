import 'media_session.dart';

class MailInboxListViewState {
  final List<MailMailInbox> sessions;
  final bool loading;
  final bool creating;
  final String? error;
  final String? nextCursor;

  const MailInboxListViewState({
    this.sessions = const [],
    this.loading = false,
    this.creating = false,
    this.error,
    this.nextCursor,
  });

  MailInboxListViewState copyWith({
    List<MailMailInbox>? sessions,
    bool? loading,
    bool? creating,
    String? error,
    String? nextCursor,
    bool clearError = false,
  }) {
    return MailInboxListViewState(
      sessions: sessions ?? this.sessions,
      loading: loading ?? this.loading,
      creating: creating ?? this.creating,
      error: clearError ? null : (error ?? this.error),
      nextCursor: nextCursor ?? this.nextCursor,
    );
  }
}

class MailInboxRoomViewState {
  final MailMailInbox? session;
  final String? providerAppId;
  final bool loading;
  final bool joining;
  final String? error;
  final String? runtimeMessage;

  const MailInboxRoomViewState({
    this.session,
    this.providerAppId,
    this.loading = false,
    this.joining = false,
    this.error,
    this.runtimeMessage,
  });

  MailInboxRoomViewState copyWith({
    MailMailInbox? session,
    String? providerAppId,
    bool? loading,
    bool? joining,
    String? error,
    String? runtimeMessage,
    bool clearError = false,
  }) {
    return MailInboxRoomViewState(
      session: session ?? this.session,
      providerAppId: providerAppId ?? this.providerAppId,
      loading: loading ?? this.loading,
      joining: joining ?? this.joining,
      error: clearError ? null : (error ?? this.error),
      runtimeMessage: runtimeMessage ?? this.runtimeMessage,
    );
  }
}
