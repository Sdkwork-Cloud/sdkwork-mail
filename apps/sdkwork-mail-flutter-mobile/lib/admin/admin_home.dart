import 'package:flutter/material.dart';
import 'package:sdkwork_mail_flutter_mobile_admin_core/sdkwork_mail_flutter_mobile_admin_core.dart';

import '../bootstrap/admin_auth.dart';
import '../bootstrap/admin_services.dart';
import '../bootstrap/routes.dart';
import 'admin_shell.dart';

class AdminHome extends StatefulWidget {
  final MailAdminSession session;

  const AdminHome({super.key, required this.session});

  @override
  State<AdminHome> createState() => _AdminHomeState();
}

class _AdminHomeState extends State<AdminHome> {
  late final MailAdminServices _services = createAdminServices(session: widget.session);

  List<MailTemplateRecord> _templates = [];
  List<MailTransactionalDeliveryRecord> _deliveries = [];
  List<MailTransportProviderAccount> _providerAccounts = [];
  List<MailMarketingConsentRecord> _marketingConsents = [];

  String? _templateError;
  String? _deliveryError;
  String? _providerError;
  String? _marketingConsentError;
  String? _providerPingMessage;
  String? _providerSyncMessage;
  bool _templateLoading = false;
  bool _deliveryLoading = false;
  bool _providerLoading = false;
  bool _marketingConsentLoading = false;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    await Future.wait([
      _loadTemplates(),
      _loadDeliveries(),
      _loadProviderAccounts(),
      _loadMarketingConsents(),
    ]);
  }

  Future<void> _loadTemplates() async {
    setState(() {
      _templateLoading = true;
      _templateError = null;
    });
    try {
      final items = await _services.templates.list();
      if (!mounted) return;
      setState(() => _templates = items);
    } catch (error) {
      if (!mounted) return;
      setState(() => _templateError = error.toString());
    } finally {
      if (mounted) setState(() => _templateLoading = false);
    }
  }

  Future<void> _loadDeliveries() async {
    setState(() {
      _deliveryLoading = true;
      _deliveryError = null;
    });
    try {
      final items = await _services.deliveries.list();
      if (!mounted) return;
      setState(() => _deliveries = items);
    } catch (error) {
      if (!mounted) return;
      setState(() => _deliveryError = error.toString());
    } finally {
      if (mounted) setState(() => _deliveryLoading = false);
    }
  }

  Future<void> _loadProviderAccounts() async {
    setState(() {
      _providerLoading = true;
      _providerError = null;
    });
    try {
      final items = await _services.providerAccounts.list();
      if (!mounted) return;
      setState(() => _providerAccounts = items);
    } catch (error) {
      if (!mounted) return;
      setState(() => _providerError = error.toString());
    } finally {
      if (mounted) setState(() => _providerLoading = false);
    }
  }

  Future<void> _loadMarketingConsents() async {
    setState(() {
      _marketingConsentLoading = true;
      _marketingConsentError = null;
    });
    try {
      final items = await _services.marketingConsents.list();
      if (!mounted) return;
      setState(() => _marketingConsents = items);
    } catch (error) {
      if (!mounted) return;
      setState(() => _marketingConsentError = error.toString());
    } finally {
      if (mounted) setState(() => _marketingConsentLoading = false);
    }
  }

  Future<void> _revokeMarketingConsent(MailMarketingConsentRecord item) async {
    await _services.marketingConsents.revoke(item.id);
    await _loadMarketingConsents();
  }

  Widget _buildRoute(AdminRoute route) {
    switch (route) {
      case AdminRoute.dashboard:
        return ListView(
          children: [
            Text('Mail Operations Dashboard', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('Templates, delivery audit, and transport provider overview.'),
            const SizedBox(height: 24),
            Text('Templates', style: Theme.of(context).textTheme.titleMedium),
            MailTemplateList(
              items: _templates,
              loading: _templateLoading,
              error: _templateError,
            ),
            const SizedBox(height: 24),
            Text('Recent Deliveries', style: Theme.of(context).textTheme.titleMedium),
            MailTransactionalDeliveryList(
              items: _deliveries,
              loading: _deliveryLoading,
              error: _deliveryError,
            ),
          ],
        );
      case AdminRoute.templates:
        return ListView(
          children: [
            Text('Mail Templates', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('Login verification, password reset, OTP, and marketing templates.'),
            const SizedBox(height: 16),
            MailTemplateList(
              items: _templates,
              loading: _templateLoading,
              error: _templateError,
            ),
          ],
        );
      case AdminRoute.deliveries:
        return ListView(
          children: [
            Text('Transactional Delivery Audit', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('Review verification and transactional send outcomes.'),
            const SizedBox(height: 16),
            MailTransactionalDeliveryList(
              items: _deliveries,
              loading: _deliveryLoading,
              error: _deliveryError,
            ),
          ],
        );
      case AdminRoute.providerAccounts:
        return ListView(
          children: [
            Text('Transport Provider Accounts', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('SMTP/IMAP provider configuration for outbound and sync delivery.'),
            const SizedBox(height: 16),
            MailProviderAccountForm(
              onSubmit: (command) async {
                await _services.providerAccounts.create(command);
                await _loadProviderAccounts();
              },
            ),
            const SizedBox(height: 24),
            MailProviderAccountList(
              accounts: _providerAccounts,
              loading: _providerLoading,
              error: _providerError,
              pingMessage: _providerPingMessage,
              syncMessage: _providerSyncMessage,
              onPing: (account) async {
                setState(() => _providerPingMessage = null);
                final result = await _services.providerAccounts.ping(account.id);
                if (!mounted) return;
                setState(() {
                  _providerPingMessage = result.ok
                      ? 'Ping OK: ${result.message}'
                      : 'Ping failed: ${result.message}';
                });
              },
              onSync: (account) async {
                setState(() => _providerSyncMessage = null);
                final result = await _services.providerAccounts.sync(account.id);
                if (!mounted) return;
                setState(() => _providerSyncMessage = result.message);
              },
            ),
          ],
        );
      case AdminRoute.marketingConsents:
        return ListView(
          children: [
            Text('Marketing Consents', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            const Text('Grant, review, and revoke marketing email consent records.'),
            const SizedBox(height: 16),
            MailMarketingConsentForm(
              onSubmit: ({required recipientEmail, consentSource}) async {
                await _services.marketingConsents.grant(
                  recipientEmail: recipientEmail,
                  consentSource: consentSource,
                );
                await _loadMarketingConsents();
              },
            ),
            const SizedBox(height: 24),
            MailMarketingConsentList(
              items: _marketingConsents,
              loading: _marketingConsentLoading,
              error: _marketingConsentError,
              onRevoke: _revokeMarketingConsent,
            ),
          ],
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AdminShell(
      onRouteChanged: (route) {
        switch (route) {
          case AdminRoute.dashboard:
            _loadDashboard();
          case AdminRoute.templates:
            _loadTemplates();
          case AdminRoute.deliveries:
            _loadDeliveries();
          case AdminRoute.providerAccounts:
            _loadProviderAccounts();
          case AdminRoute.marketingConsents:
            _loadMarketingConsents();
        }
      },
      builder: _buildRoute,
    );
  }
}
