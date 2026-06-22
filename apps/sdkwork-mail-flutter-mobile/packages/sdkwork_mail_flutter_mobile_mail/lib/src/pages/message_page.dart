import 'package:flutter/material.dart';

import '../models/mail_message.dart';
import '../services/mail_app_service.dart';

class MessagePage extends StatefulWidget {
  const MessagePage({
    super.key,
    required this.services,
    required this.messageId,
    required this.onBack,
  });

  final MailAppServices services;
  final String messageId;
  final VoidCallback onBack;

  @override
  State<MessagePage> createState() => _MessagePageState();
}

class _MessagePageState extends State<MessagePage> {
  MailMessage? _message;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadMessage();
  }

  Future<void> _loadMessage() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final message = await widget.services.retrieveMessage(widget.messageId);
      if (!mounted) return;
      setState(() => _message = message);
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    final message = _message;
    if (_error != null || message == null) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextButton.icon(
            onPressed: widget.onBack,
            icon: const Icon(Icons.arrow_back),
            label: const Text('Back to inbox'),
          ),
          Text(_error ?? 'Message not found'),
        ],
      );
    }

    final body = message.bodyText ?? message.bodyHtml ?? message.snippet ?? '';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextButton.icon(
          onPressed: widget.onBack,
          icon: const Icon(Icons.arrow_back),
          label: const Text('Back to inbox'),
        ),
        Text(message.subject ?? '(no subject)', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        Text('From: ${message.fromEmail ?? 'unknown'}'),
        const SizedBox(height: 16),
        Expanded(
          child: SingleChildScrollView(child: Text(body)),
        ),
      ],
    );
  }
}
