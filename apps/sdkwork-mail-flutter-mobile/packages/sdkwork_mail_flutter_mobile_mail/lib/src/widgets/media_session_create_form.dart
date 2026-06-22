import 'package:flutter/material.dart';

typedef MailInboxCreateInput = ({String roomId, String mediaMode});

class MailInboxCreateForm extends StatefulWidget {
  final String defaultRoomId;
  final String defaultMediaMode;
  final bool creating;
  final Future<void> Function(MailInboxCreateInput input) onCreate;

  const MailInboxCreateForm({
    super.key,
    this.defaultRoomId = '',
    this.defaultMediaMode = 'video',
    this.creating = false,
    required this.onCreate,
  });

  @override
  State<MailInboxCreateForm> createState() => _MailInboxCreateFormState();
}

class _MailInboxCreateFormState extends State<MailInboxCreateForm> {
  late final TextEditingController _roomIdController =
      TextEditingController(text: widget.defaultRoomId);
  String _mediaMode = 'video';

  @override
  void initState() {
    super.initState();
    _mediaMode = widget.defaultMediaMode;
  }

  @override
  void dispose() {
    _roomIdController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    final roomId = _roomIdController.text.trim();
    if (roomId.isEmpty) return;
    await widget.onCreate((roomId: roomId, mediaMode: _mediaMode));
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Create mail inbox', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            TextField(
              controller: _roomIdController,
              decoration: const InputDecoration(
                labelText: 'Room ID',
                hintText: 'room-001',
              ),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _mediaMode,
              decoration: const InputDecoration(labelText: 'Media Mode'),
              items: const [
                DropdownMenuItem(value: 'audio', child: Text('audio')),
                DropdownMenuItem(value: 'video', child: Text('video')),
                DropdownMenuItem(value: 'live', child: Text('live')),
              ],
              onChanged: (value) {
                if (value == null) return;
                setState(() => _mediaMode = value);
              },
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: widget.creating ? null : () => _handleSubmit(),
              child: Text(widget.creating ? 'Creating...' : 'Create Session'),
            ),
          ],
        ),
      ),
    );
  }
}
