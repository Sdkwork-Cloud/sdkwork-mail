import 'package:flutter/material.dart';
import 'package:sdkwork_mail_flutter_mobile_Mail/sdkwork_mail_flutter_mobile_Mail.dart';

import '../admin/admin_home.dart';
import '../bootstrap/admin_auth.dart';
import '../bootstrap/app_auth.dart';
import '../bootstrap/app_services.dart';
import '../bootstrap/environment.dart';
import '../bootstrap/routes.dart';

class MailHome extends StatefulWidget {
  final MailAppSession session;

  const MailHome({super.key, required this.session});

  @override
  State<MailHome> createState() => _MailHomeState();
}

class _MailHomeState extends State<MailHome> {
  late final MailAppServices _services = createAppServices(session: widget.session);
  final _environment = resolveEnvironment();

  AppRoute _route = AppRoute.MailInboxs;
  String? _activeSessionId;
  String _participantId = '';

  MailAdminSession? _adminSession = loadAdminSession();

  @override
  void initState() {
    super.initState();
    _participantId = widget.session.userId;
  }

  void _openSession(String sessionId) {
    setState(() {
      _activeSessionId = sessionId;
      _route = AppRoute.MailInboxRoom;
    });
  }

  void _backToSessions() {
    setState(() {
      _activeSessionId = null;
      _route = AppRoute.MailInboxs;
    });
  }

  Widget _buildAdminSection() {
    final adminSession = _adminSession;
    if (adminSession == null) {
      return _AdminSignInPanel(
        onSignedIn: (session) {
          saveAdminSession(session);
          bootstrapAdminAuth();
          setState(() => _adminSession = session);
        },
      );
    }

    return AdminHome(session: adminSession);
  }

  Widget _buildBody() {
    switch (_route) {
      case AppRoute.MailInboxs:
        return MailInboxsPage(
          services: _services,
          defaultMediaMode: _environment.defaultMediaMode,
          onOpenSession: _openSession,
        );
      case AppRoute.MailInboxRoom:
        final sessionId = _activeSessionId;
        if (sessionId == null) {
          return MailInboxsPage(
            services: _services,
            defaultMediaMode: _environment.defaultMediaMode,
            onOpenSession: _openSession,
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextButton.icon(
              onPressed: _backToSessions,
              icon: const Icon(Icons.arrow_back),
              label: const Text('Back to mail inboxs'),
            ),
            Expanded(
              child: MailInboxRoomPage(
                services: _services,
                sessionId: sessionId,
                participantId: _participantId,
                displayName: widget.session.userId,
                onParticipantIdChange: (value) => setState(() => _participantId = value),
              ),
            ),
          ],
        );
      case AppRoute.admin:
        return _buildAdminSection();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Mail - ${_route.label}'),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.green),
              child: Text(
                'SDKWork Mail',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
            for (final route in [AppRoute.MailInboxs, AppRoute.admin])
              ListTile(
                leading: Icon(route.icon),
                title: Text(route.label),
                selected: _route == route,
                onTap: () {
                  setState(() => _route = route);
                  Navigator.pop(context);
                },
              ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _buildBody(),
      ),
    );
  }
}

class _AdminSignInPanel extends StatefulWidget {
  final ValueChanged<MailAdminSession> onSignedIn;

  const _AdminSignInPanel({required this.onSignedIn});

  @override
  State<_AdminSignInPanel> createState() => _AdminSignInPanelState();
}

class _AdminSignInPanelState extends State<_AdminSignInPanel> {
  final MailAdminSession _form = loadAdminSession() ?? defaultAdminSession;

  final _accessTokenController = TextEditingController();
  final _authTokenController = TextEditingController();
  final _tenantIdController = TextEditingController();
  final _organizationIdController = TextEditingController();
  final _userIdController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _syncControllers();
  }

  @override
  void dispose() {
    _accessTokenController.dispose();
    _authTokenController.dispose();
    _tenantIdController.dispose();
    _organizationIdController.dispose();
    _userIdController.dispose();
    super.dispose();
  }

  void _syncControllers() {
    _accessTokenController.text = _form.accessToken;
    _authTokenController.text = _form.authToken;
    _tenantIdController.text = _form.tenantId;
    _organizationIdController.text = _form.organizationId;
    _userIdController.text = _form.userId;
  }

  void _handleSubmit() {
    final nextSession = MailAdminSession(
      accessToken: _accessTokenController.text.trim(),
      authToken: _authTokenController.text.trim().isEmpty
          ? _accessTokenController.text.trim()
          : _authTokenController.text.trim(),
      tenantId: _tenantIdController.text.trim().isEmpty
          ? defaultAdminSession.tenantId
          : _tenantIdController.text.trim(),
      organizationId: _organizationIdController.text.trim().isEmpty
          ? defaultAdminSession.organizationId
          : _organizationIdController.text.trim(),
      userId: _userIdController.text.trim().isEmpty
          ? defaultAdminSession.userId
          : _userIdController.text.trim(),
    );
    if (nextSession.accessToken.isEmpty) return;
    widget.onSignedIn(nextSession);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Mail Admin Sign In', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 8),
                  const Text(
                    'Provide backend dual-token credentials for internal admin access.',
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _accessTokenController,
                    decoration: const InputDecoration(labelText: 'Access Token'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _authTokenController,
                    decoration: const InputDecoration(labelText: 'Auth Token'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _tenantIdController,
                    decoration: const InputDecoration(labelText: 'Tenant ID'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _organizationIdController,
                    decoration: const InputDecoration(labelText: 'Organization ID'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _userIdController,
                    decoration: const InputDecoration(labelText: 'User ID'),
                  ),
                  const SizedBox(height: 20),
                  FilledButton(onPressed: _handleSubmit, child: const Text('Continue')),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
