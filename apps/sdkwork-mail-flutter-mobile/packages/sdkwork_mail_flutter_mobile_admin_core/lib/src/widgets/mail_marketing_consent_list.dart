import 'package:flutter/material.dart';

import '../models/mail_admin_models.dart';

class MailMarketingConsentList extends StatelessWidget {
  const MailMarketingConsentList({
    super.key,
    required this.items,
    this.loading = false,
    this.error,
    this.onRevoke,
  });

  final List<MailMarketingConsentRecord> items;
  final bool loading;
  final String? error;
  final Future<void> Function(MailMarketingConsentRecord item)? onRevoke;

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (error != null) {
      return Text(error!, style: const TextStyle(color: Colors.red));
    }
    if (items.isEmpty) {
      return const Text('No marketing consents recorded.');
    }
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final item = items[index];
        return ListTile(
          title: Text(item.recipientEmail),
          subtitle: Text('${item.status} · ${item.consentSource} · ${item.grantedAt}'),
          trailing: item.status == 'active' && onRevoke != null
              ? TextButton(
                  onPressed: () => onRevoke!(item),
                  child: const Text('Revoke'),
                )
              : null,
        );
      },
    );
  }
}
