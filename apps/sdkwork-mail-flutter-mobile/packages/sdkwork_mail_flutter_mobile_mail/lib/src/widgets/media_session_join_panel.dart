import 'package:flutter/material.dart';

import '../models/media_session.dart';
import '../services/media_session_mapper.dart';

class MailInboxJoinPanel extends StatefulWidget {
  final MailMailInbox session;
  final String participantId;
  final String? providerAppId;
  final bool joining;
  final String? runtimeMessage;
  final ValueChanged<String> onParticipantIdChange;
  final VoidCallback onJoin;
  final VoidCallback onLeave;

  const MailInboxJoinPanel({
    super.key,
    required this.session,
    required this.participantId,
    this.providerAppId,
    this.joining = false,
    this.runtimeMessage,
    required this.onParticipantIdChange,
    required this.onJoin,
    required this.onLeave,
  });

  @override
  State<MailInboxJoinPanel> createState() => _MailInboxJoinPanelState();
}

class _MailInboxJoinPanelState extends State<MailInboxJoinPanel> {
  late final TextEditingController _participantController =
      TextEditingController(text: widget.participantId);

  @override
  void didUpdateWidget(MailInboxJoinPanel oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.participantId != widget.participantId &&
        _participantController.text != widget.participantId) {
      _participantController.text = widget.participantId;
    }
  }

  @override
  void dispose() {
    _participantController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final MailSession = mapMailInboxToMailSession(widget.session, widget.participantId);
    final readiness = evaluateMailJoinReadiness(
      MailSession,
      options: EvaluateMailJoinReadinessOptions(
        cameraRequired: widget.session.mediaMode != 'audio',
        microphonePermission: 'prompt',
        cameraPermission: widget.session.mediaMode == 'audio' ? null : 'prompt',
      ),
    );

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(widget.session.roomId, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 4),
            Text(
              '${formatMailInboxStatus(widget.session.status)} · ${widget.session.mediaMode}',
            ),
            const SizedBox(height: 16),
            _DetailRow(label: 'Session ID', value: widget.session.id),
            _DetailRow(
              label: 'Provider App ID',
              value: widget.providerAppId ?? 'pending provider profile lookup',
            ),
            const SizedBox(height: 12),
            TextField(
              decoration: const InputDecoration(labelText: 'Participant ID'),
              controller: _participantController,
              onChanged: widget.onParticipantIdChange,
            ),
            const SizedBox(height: 12),
            if (readiness.ready)
              const Text('Ready to join.', style: TextStyle(color: Colors.green))
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Join blocked:'),
                  for (final issue in readiness.issues)
                    Text('• ${formatJoinIssue(issue)}'),
                ],
              ),
            if (widget.runtimeMessage != null) ...[
              const SizedBox(height: 8),
              Text(widget.runtimeMessage!),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                FilledButton(
                  onPressed: !readiness.ready ||
                          widget.joining ||
                          widget.participantId.trim().isEmpty
                      ? null
                      : widget.onJoin,
                  child: Text(widget.joining ? 'Joining...' : 'Join Session'),
                ),
                const SizedBox(width: 8),
                OutlinedButton(onPressed: widget.onLeave, child: const Text('Leave')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 120, child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
