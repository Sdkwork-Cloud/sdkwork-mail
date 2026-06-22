import 'package:flutter/material.dart';

enum AppRoute {
  inbox,
  message,
  admin,
}

extension AppRouteLabel on AppRoute {
  String get label {
    switch (this) {
      case AppRoute.inbox:
        return 'Inbox';
      case AppRoute.message:
        return 'Message';
      case AppRoute.admin:
        return 'Admin';
    }
  }

  String get path {
    switch (this) {
      case AppRoute.inbox:
        return '#/mail/inbox';
      case AppRoute.message:
        return '#/mail/messages/:messageId';
      case AppRoute.admin:
        return '#/admin';
    }
  }

  IconData get icon {
    switch (this) {
      case AppRoute.inbox:
        return Icons.inbox;
      case AppRoute.message:
        return Icons.mail;
      case AppRoute.admin:
        return Icons.admin_panel_settings;
    }
  }
}

enum AdminRoute {
  dashboard,
  templates,
  deliveries,
  marketingConsents,
  providerAccounts,
}

extension AdminRouteLabel on AdminRoute {
  String get label {
    switch (this) {
      case AdminRoute.dashboard:
        return 'Dashboard';
      case AdminRoute.templates:
        return 'Templates';
      case AdminRoute.deliveries:
        return 'Delivery Audit';
      case AdminRoute.marketingConsents:
        return 'Marketing Consents';
      case AdminRoute.providerAccounts:
        return 'Transport Providers';
    }
  }

  String get path {
    switch (this) {
      case AdminRoute.dashboard:
        return '#/admin/dashboard';
      case AdminRoute.templates:
        return '#/admin/templates';
      case AdminRoute.deliveries:
        return '#/admin/deliveries';
      case AdminRoute.marketingConsents:
        return '#/admin/marketing-consents';
      case AdminRoute.providerAccounts:
        return '#/admin/provider-accounts';
    }
  }

  IconData get icon {
    switch (this) {
      case AdminRoute.dashboard:
        return Icons.dashboard;
      case AdminRoute.templates:
        return Icons.description;
      case AdminRoute.deliveries:
        return Icons.local_shipping;
      case AdminRoute.marketingConsents:
        return Icons.mark_email_read;
      case AdminRoute.providerAccounts:
        return Icons.dns;
    }
  }
}

List<String> createRoutes() {
  return [
    ...AppRoute.values.map((route) => route.path),
    ...AdminRoute.values.map((route) => route.path),
  ];
}
