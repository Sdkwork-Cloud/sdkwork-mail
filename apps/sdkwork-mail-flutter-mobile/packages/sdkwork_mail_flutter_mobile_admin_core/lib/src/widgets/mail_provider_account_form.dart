import 'package:flutter/material.dart';

import '../models/mail_admin_models.dart';

class MailProviderAccountForm extends StatefulWidget {
  const MailProviderAccountForm({
    super.key,
    required this.onSubmit,
  });

  final Future<void> Function(CreateMailProviderAccountCommand command) onSubmit;

  @override
  State<MailProviderAccountForm> createState() => _MailProviderAccountFormState();
}

class _MailProviderAccountFormState extends State<MailProviderAccountForm> {
  final _formKey = GlobalKey<FormState>();
  String _providerKind = 'smtp';
  final _nameController = TextEditingController();
  final _hostController = TextEditingController();
  final _portController = TextEditingController(text: '587');
  bool _useTls = true;
  final _usernameController = TextEditingController();
  final _secretRefController = TextEditingController(
    text: 'env:SDKWORK_MAIL_SMTP_PASSWORD',
  );
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _nameController.dispose();
    _hostController.dispose();
    _portController.dispose();
    _usernameController.dispose();
    _secretRefController.dispose();
    super.dispose();
  }

  void _onProviderKindChanged(String? value) {
    if (value == null) return;
    setState(() {
      _providerKind = value;
      _portController.text = value == 'imap' ? '993' : '587';
      _secretRefController.text = value == 'imap'
          ? 'env:SDKWORK_MAIL_IMAP_PASSWORD'
          : 'env:SDKWORK_MAIL_SMTP_PASSWORD';
    });
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final username = _usernameController.text.trim();
      final secretRef = _secretRefController.text.trim();
      await widget.onSubmit(
        CreateMailProviderAccountCommand(
          providerKind: _providerKind,
          name: _nameController.text.trim(),
          host: _hostController.text.trim(),
          port: int.parse(_portController.text.trim()),
          useTls: _useTls,
          credential: username.isNotEmpty && secretRef.isNotEmpty
              ? CreateMailProviderCredentialInput(
                  username: username,
                  secretRef: secretRef,
                )
              : null,
        ),
      );
      _nameController.clear();
      _hostController.clear();
      _usernameController.clear();
      _portController.text = _providerKind == 'imap' ? '993' : '587';
    } catch (error) {
      setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Create Transport Provider', style: Theme.of(context).textTheme.titleMedium),
          if (_error != null) ...[
            const SizedBox(height: 8),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: _providerKind,
            decoration: const InputDecoration(labelText: 'Kind'),
            items: const [
              DropdownMenuItem(value: 'smtp', child: Text('smtp')),
              DropdownMenuItem(value: 'imap', child: Text('imap')),
            ],
            onChanged: _onProviderKindChanged,
          ),
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(labelText: 'Name'),
            validator: (value) =>
                value == null || value.trim().isEmpty ? 'Name is required' : null,
          ),
          TextFormField(
            controller: _hostController,
            decoration: const InputDecoration(labelText: 'Host'),
            validator: (value) =>
                value == null || value.trim().isEmpty ? 'Host is required' : null,
          ),
          TextFormField(
            controller: _portController,
            decoration: const InputDecoration(labelText: 'Port'),
            keyboardType: TextInputType.number,
            validator: (value) {
              final port = int.tryParse(value ?? '');
              if (port == null || port <= 0) return 'Valid port is required';
              return null;
            },
          ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Use TLS'),
            value: _useTls,
            onChanged: (value) => setState(() => _useTls = value),
          ),
          TextFormField(
            controller: _usernameController,
            decoration: const InputDecoration(labelText: 'Credential Username'),
          ),
          TextFormField(
            controller: _secretRefController,
            decoration: const InputDecoration(labelText: 'Credential Secret Ref'),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _submitting ? null : () => _handleSubmit(),
            child: Text(_submitting ? 'Creating...' : 'Create Provider'),
          ),
        ],
      ),
    );
  }
}
