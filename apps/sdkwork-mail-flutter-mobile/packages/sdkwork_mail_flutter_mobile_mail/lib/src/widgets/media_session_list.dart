import 'package:flutter/material.dart';

import '../models/media_session.dart';
import '../services/media_session_mapper.dart';

class MailInboxList extends StatelessWidget {
  final List<MailMailInbox> sessions;
  final ValueChanged<MailMailInbox> onSelect;
  final VoidCallback onRefresh;

  const MailInboxList({
    super.key,
    required this.sessions,
    required this.onSelect,
    required this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    if (sessions.isEmpty) {
      return Column(
        children: [
          const Text('No mail inboxs yet.'),
          const SizedBox(height: 8),
          OutlinedButton(onPressed: onRefresh, child: const Text('Refresh')),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('${sessions.length} session(s)'),
            TextButton(onPressed: onRefresh, child: const Text('Refresh')),
          ],
        ),
        const SizedBox(height: 8),
        Expanded(
          child: ListView.separated(
            itemCount: sessions.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, index) {
              final session = sessions[index];
              final participantCount =
                  session.participantCount ?? session.participants.length;
              return Card(
                child: ListTile(
                  title: Text(session.roomId),
                  subtitle: Text(
                    '${formatMailInboxStatus(session.status)} · '
                    '${session.mediaMode} · $participantCount participants',
                  ),
                  onTap: () => onSelect(session),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
