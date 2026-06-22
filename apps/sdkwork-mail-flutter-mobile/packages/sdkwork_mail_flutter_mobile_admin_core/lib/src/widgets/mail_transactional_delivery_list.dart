import 'package:flutter/material.dart';

import '../models/mail_admin_models.dart';

class MailTransactionalDeliveryList extends StatelessWidget {
  const MailTransactionalDeliveryList({
    super.key,
    required this.items,
    this.loading = false,
    this.error,
  });

  final List<MailTransactionalDeliveryRecord> items;
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
    if (items.isEmpty) {
      return const Text('No delivery records found.');
    }
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final item = items[index];
        return ListTile(
          title: Text(item.subject),
          subtitle: Text('${item.recipientEmail} · ${item.businessKind}'),
          trailing: Text(item.status),
        );
      },
    );
  }
}
