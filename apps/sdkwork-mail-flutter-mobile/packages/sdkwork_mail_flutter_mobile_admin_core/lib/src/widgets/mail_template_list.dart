import 'package:flutter/material.dart';

import '../models/mail_admin_models.dart';

class MailTemplateList extends StatelessWidget {
  const MailTemplateList({
    super.key,
    required this.items,
    this.loading = false,
    this.error,
  });

  final List<MailTemplateRecord> items;
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
      return const Text('No templates found.');
    }
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final item = items[index];
        return ListTile(
          title: Text(item.name),
          subtitle: Text('${item.templateKey} · ${item.category} · ${item.purpose}'),
          trailing: Text(item.status),
        );
      },
    );
  }
}
