import 'package:flutter/material.dart';

import '../models/mail_message.dart';

class MailMessageList extends StatelessWidget {
  const MailMessageList({
    super.key,
    required this.messages,
    required this.onSelect,
  });

  final List<MailMessage> messages;
  final ValueChanged<String> onSelect;

  @override
  Widget build(BuildContext context) {
    if (messages.isEmpty) {
      return const Center(child: Text('No messages in this folder.'));
    }

    return ListView.separated(
      itemCount: messages.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final message = messages[index];
        return ListTile(
          title: Text(message.subject ?? '(no subject)'),
          subtitle: Text(message.snippet ?? message.fromEmail ?? ''),
          trailing: message.isRead == true ? null : const Icon(Icons.circle, size: 10),
          onTap: () => onSelect(message.id),
        );
      },
    );
  }
}
