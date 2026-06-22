import 'package:flutter/material.dart';

class MailMarketingConsentForm extends StatefulWidget {
  const MailMarketingConsentForm({
    super.key,
    required this.onSubmit,
  });

  final Future<void> Function({
    required String recipientEmail,
    String? consentSource,
  }) onSubmit;

  @override
  State<MailMarketingConsentForm> createState() => _MailMarketingConsentFormState();
}

class _MailMarketingConsentFormState extends State<MailMarketingConsentForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _sourceController = TextEditingController(text: 'admin');
  bool _submitting = false;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _sourceController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      await widget.onSubmit(
        recipientEmail: _emailController.text.trim(),
        consentSource: _sourceController.text.trim().isEmpty
            ? 'admin'
            : _sourceController.text.trim(),
      );
      _emailController.clear();
      _sourceController.text = 'admin';
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
          Text('Grant Marketing Consent', style: Theme.of(context).textTheme.titleMedium),
          if (_error != null) ...[
            const SizedBox(height: 8),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          const SizedBox(height: 12),
          TextFormField(
            controller: _emailController,
            decoration: const InputDecoration(labelText: 'Recipient Email'),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Recipient email is required';
              }
              if (!value.contains('@')) return 'Enter a valid email address';
              return null;
            },
          ),
          TextFormField(
            controller: _sourceController,
            decoration: const InputDecoration(labelText: 'Consent Source'),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _submitting ? null : () => _handleSubmit(),
            child: Text(_submitting ? 'Granting...' : 'Grant Consent'),
          ),
        ],
      ),
    );
  }
}
