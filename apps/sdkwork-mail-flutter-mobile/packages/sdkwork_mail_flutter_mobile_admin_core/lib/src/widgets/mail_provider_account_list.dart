import 'package:flutter/material.dart';

import '../models/mail_admin_models.dart';

class MailProviderAccountList extends StatelessWidget {
  const MailProviderAccountList({
    super.key,
    required this.accounts,
    this.loading = false,
    this.error,
  });

  final List<MailTransportProviderAccount> accounts;
  final bool loading;
  final String? error;

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
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: accounts.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final account = accounts[index];
        return ListTile(
          title: Text(account.name),
          subtitle: Text('${account.providerKind} · ${account.host}:${account.port}'),
          trailing: Text(account.status),
        );
      },
    );
  }
}
