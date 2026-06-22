import 'package:flutter/material.dart';

import '../models/mail_admin_models.dart';

class MailProviderAccountList extends StatelessWidget {
  const MailProviderAccountList({
    super.key,
    required this.accounts,
    this.loading = false,
    this.error,
    this.pingMessage,
    this.syncMessage,
    this.onPing,
    this.onSync,
  });

  final List<MailTransportProviderAccount> accounts;
  final bool loading;
  final String? error;
  final String? pingMessage;
  final String? syncMessage;
  final Future<void> Function(MailTransportProviderAccount account)? onPing;
  final Future<void> Function(MailTransportProviderAccount account)? onSync;

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (error != null) {
      return Text(error!, style: const TextStyle(color: Colors.red));
    }
    if (accounts.isEmpty) {
      return const Text('No transport provider accounts configured.');
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (pingMessage != null) Text(pingMessage!),
        if (syncMessage != null) Text(syncMessage!),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: accounts.length,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (context, index) {
            final account = accounts[index];
            return ListTile(
              title: Text(account.name),
              subtitle: Text('${account.providerKind} · ${account.host}:${account.port}'),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(account.status),
                  if (onPing != null) ...[
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () => onPing!(account),
                      child: const Text('Ping'),
                    ),
                  ],
                  if (onSync != null && account.providerKind == 'imap') ...[
                    TextButton(
                      onPressed: () => onSync!(account),
                      child: const Text('Sync'),
                    ),
                  ],
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
