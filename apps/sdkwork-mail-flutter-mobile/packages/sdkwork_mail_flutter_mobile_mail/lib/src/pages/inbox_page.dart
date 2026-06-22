import 'package:flutter/material.dart';

import '../models/mail_account.dart';
import '../models/mail_folder.dart';
import '../models/mail_message.dart';
import '../services/mail_app_service.dart';
import '../widgets/mail_message_list.dart';

class InboxPage extends StatefulWidget {
  const InboxPage({
    super.key,
    required this.services,
    required this.onOpenMessage,
  });

  final MailAppServices services;
  final ValueChanged<String> onOpenMessage;

  @override
  State<InboxPage> createState() => _InboxPageState();
}

class _InboxPageState extends State<InboxPage> {
  List<MailAccount> _accounts = [];
  List<MailFolder> _folders = [];
  List<MailMessage> _messages = [];
  String _selectedAccountId = '';
  String _selectedFolderId = '';
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadAccounts();
  }

  Future<void> _loadAccounts() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final accounts = await widget.services.listAccounts();
      if (!mounted) return;
      setState(() {
        _accounts = accounts;
        _selectedAccountId = accounts.isNotEmpty ? accounts.first.id : '';
      });
      if (_selectedAccountId.isNotEmpty) {
        await _loadFolders(_selectedAccountId);
      }
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _loadFolders(String accountId) async {
    try {
      final folders = await widget.services.listFolders(accountId: accountId);
      if (!mounted) return;
      setState(() {
        _folders = folders;
        _selectedFolderId = folders.isNotEmpty ? folders.first.id : '';
      });
      if (_selectedFolderId.isNotEmpty) {
        await _loadMessages(_selectedFolderId);
      }
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString());
    }
  }

  Future<void> _loadMessages(String folderId) async {
    try {
      final messages = await widget.services.listMessages(folderId: folderId);
      if (!mounted) return;
      setState(() => _messages = messages);
    } catch (error) {
      if (!mounted) return;
      setState(() => _error = error.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Inbox', style: Theme.of(context).textTheme.headlineSmall),
        if (_error != null)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(_error!, style: const TextStyle(color: Colors.red)),
          ),
        if (_accounts.isNotEmpty)
          DropdownButtonFormField<String>(
            value: _selectedAccountId.isEmpty ? null : _selectedAccountId,
            decoration: const InputDecoration(labelText: 'Account'),
            items: _accounts
                .map(
                  (account) => DropdownMenuItem(
                    value: account.id,
                    child: Text(account.displayName ?? account.emailAddress),
                  ),
                )
                .toList(),
            onChanged: (value) {
              if (value == null) return;
              setState(() => _selectedAccountId = value);
              _loadFolders(value);
            },
          ),
        const SizedBox(height: 12),
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(
                width: 180,
                child: ListView(
                  children: _folders
                      .map(
                        (folder) => ListTile(
                          selected: folder.id == _selectedFolderId,
                          title: Text(folder.name),
                          subtitle: Text('${folder.unreadCount ?? 0} unread'),
                          onTap: () {
                            setState(() => _selectedFolderId = folder.id);
                            _loadMessages(folder.id);
                          },
                        ),
                      )
                      .toList(),
                ),
              ),
              const VerticalDivider(width: 1),
              Expanded(
                child: MailMessageList(
                  messages: _messages,
                  onSelect: widget.onOpenMessage,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
