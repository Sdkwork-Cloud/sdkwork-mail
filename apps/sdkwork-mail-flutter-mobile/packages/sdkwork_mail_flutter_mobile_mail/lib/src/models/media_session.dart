class MailMediaParticipant {
  final String id;
  final String MailInboxId;
  final String userId;
  final String displayName;
  final String role;
  final String state;
  final bool audioMuted;
  final bool videoMuted;
  final String? joinedAt;

  const MailMediaParticipant({
    required this.id,
    required this.MailInboxId,
    required this.userId,
    required this.displayName,
    required this.role,
    required this.state,
    this.audioMuted = false,
    this.videoMuted = false,
    this.joinedAt,
  });

  factory MailMediaParticipant.fromJson(Map<String, dynamic> json) {
    return MailMediaParticipant(
      id: json['id'] as String,
      MailInboxId: json['MailInboxId'] as String,
      userId: json['userId'] as String,
      displayName: json['displayName'] as String,
      role: json['role'] as String,
      state: json['state'] as String,
      audioMuted: json['audioMuted'] as bool? ?? false,
      videoMuted: json['videoMuted'] as bool? ?? false,
      joinedAt: json['joinedAt'] as String?,
    );
  }
}

class MailMailInbox {
  final String id;
  final String roomId;
  final String tenantId;
  final String organizationId;
  final String ownerUserId;
  final String mediaMode;
  final String status;
  final String? providerProfileId;
  final String? startedAt;
  final String? connectedAt;
  final String? endedAt;
  final int? participantCount;
  final List<MailMediaParticipant> participants;

  const MailMailInbox({
    required this.id,
    required this.roomId,
    required this.tenantId,
    required this.organizationId,
    required this.ownerUserId,
    required this.mediaMode,
    required this.status,
    this.providerProfileId,
    this.startedAt,
    this.connectedAt,
    this.endedAt,
    this.participantCount,
    this.participants = const [],
  });

  factory MailMailInbox.fromJson(Map<String, dynamic> json) {
    final rawParticipants = json['participants'];
    final participants = rawParticipants is List<dynamic>
        ? rawParticipants
            .whereType<Map<String, dynamic>>()
            .map(MailMediaParticipant.fromJson)
            .toList()
        : <MailMediaParticipant>[];

    return MailMailInbox(
      id: json['id'] as String,
      roomId: json['roomId'] as String,
      tenantId: json['tenantId'] as String,
      organizationId: json['organizationId'] as String,
      ownerUserId: json['ownerUserId'] as String,
      mediaMode: json['mediaMode'] as String,
      status: json['status'] as String,
      providerProfileId: json['providerProfileId'] as String?,
      startedAt: json['startedAt'] as String?,
      connectedAt: json['connectedAt'] as String?,
      endedAt: json['endedAt'] as String?,
      participantCount: json['participantCount'] as int?,
      participants: participants,
    );
  }
}

class MailCreateMailInboxRequest {
  final String roomId;
  final String mediaMode;
  final String? providerProfileId;
  final String? provider;

  const MailCreateMailInboxRequest({
    required this.roomId,
    required this.mediaMode,
    this.providerProfileId,
    this.provider,
  });

  Map<String, dynamic> toJson() {
    return {
      'roomId': roomId,
      'mediaMode': mediaMode,
      if (providerProfileId != null) 'providerProfileId': providerProfileId,
      if (provider != null) 'provider': provider,
    };
  }
}
