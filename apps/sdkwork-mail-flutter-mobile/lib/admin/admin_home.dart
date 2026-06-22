import 'package:flutter/material.dart';
import 'package:sdkwork_mail_flutter_mobile_admin_core/sdkwork_mail_flutter_mobile_admin_core.dart';

import '../bootstrap/admin_auth.dart';
import '../bootstrap/admin_services.dart';
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

  String? _templateError;
  String? _deliveryError;
  String? _providerError;
  bool _templateLoading = false;
  bool _deliveryLoading = false;
  bool _providerLoading = false;

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
            MailProviderAccountList(
              accounts: _providerAccounts,
              loading: _providerLoading,
              error: _providerError,
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
        }
      },
      builder: _buildRoute,
    );
  }
}
