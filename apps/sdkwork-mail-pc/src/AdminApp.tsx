import { useMemo, useState, useEffect } from "react";
import { AdminLayout } from "@sdkwork/Mail-pc-admin-shell";
import {
  MailProviderAccountList,
  MailTemplateForm,
  MailTemplateList,
  MailTransactionalDeliveryList,
} from "@sdkwork/Mail-pc-admin-core";

import { AuthGate } from "./AuthGate";
import { createAdminServices } from "./bootstrap/adminServices";

interface AdminAppProps {
  route: string;
}

function AdminError({ message }: { message: string }) {
  return (
    <div className="admin-error" role="alert">
      {message}
    </div>
  );
}

function AdminLoading({ label = "Loading Mail admin data..." }: { label?: string }) {
  return <p>{label}</p>;
}

export function AdminApp({ route }: AdminAppProps) {
  const services = useMemo(() => createAdminServices(), []);

  const [templateItems, setTemplateItems] = useState<
    Awaited<ReturnType<typeof services.templates.list>>
  >([]);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const [deliveryItems, setDeliveryItems] = useState<
    Awaited<ReturnType<typeof services.deliveries.list>>
  >([]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  const [providerAccounts, setProviderAccounts] = useState<
    Awaited<ReturnType<typeof services.providerAccounts.list>>
  >([]);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);

  useEffect(() => {
    if (route !== "/admin/templates" && route !== "/admin/dashboard") {
      return;
    }
    setTemplateLoading(true);
    setTemplateError(null);
    void services.templates
      .list()
      .then(setTemplateItems)
      .catch((error: unknown) => {
        setTemplateError(error instanceof Error ? error.message : "Failed to load templates");
      })
      .finally(() => setTemplateLoading(false));
  }, [route, services]);

  useEffect(() => {
    if (route !== "/admin/deliveries" && route !== "/admin/dashboard") {
      return;
    }
    setDeliveryLoading(true);
    setDeliveryError(null);
    void services.deliveries
      .list()
      .then(setDeliveryItems)
      .catch((error: unknown) => {
        setDeliveryError(error instanceof Error ? error.message : "Failed to load deliveries");
      })
      .finally(() => setDeliveryLoading(false));
  }, [route, services]);

  useEffect(() => {
    if (route !== "/admin/provider-accounts" && route !== "/admin/dashboard") {
      return;
    }
    setProviderLoading(true);
    setProviderError(null);
    void services.providerAccounts
      .list()
      .then(setProviderAccounts)
      .catch((error: unknown) => {
        setProviderError(
          error instanceof Error ? error.message : "Failed to load provider accounts",
        );
      })
      .finally(() => setProviderLoading(false));
  }, [route, services]);

  const renderRoute = () => {
    switch (route) {
      case "/admin/dashboard":
        return (
          <>
            <h2>Mail Operations Dashboard</h2>
            <p>Templates, delivery audit, and transport provider overview.</p>
            <section>
              <h3>Templates</h3>
              <MailTemplateList
                items={templateItems}
                loading={templateLoading}
                error={templateError}
              />
            </section>
            <section>
              <h3>Recent Deliveries</h3>
              <MailTransactionalDeliveryList
                items={deliveryItems}
                loading={deliveryLoading}
                error={deliveryError}
              />
            </section>
          </>
        );

      case "/admin/templates":
        return (
          <>
            <h2>Mail Templates</h2>
            <p>Login verification, password reset, OTP, and marketing templates.</p>
            <MailTemplateForm
              onSubmit={async (command) => {
                await services.templates.create(command);
                const items = await services.templates.list();
                setTemplateItems(items);
              }}
            />
            <MailTemplateList
              items={templateItems}
              loading={templateLoading}
              error={templateError}
            />
          </>
        );

      case "/admin/deliveries":
        return (
          <>
            <h2>Transactional Delivery Audit</h2>
            <p>Review verification and transactional send outcomes.</p>
            <MailTransactionalDeliveryList
              items={deliveryItems}
              loading={deliveryLoading}
              error={deliveryError}
            />
          </>
        );

      case "/admin/provider-accounts":
        return (
          <>
            <h2>Transport Provider Accounts</h2>
            <p>SMTP/IMAP provider configuration for outbound and sync delivery.</p>
            <MailProviderAccountList
              accounts={providerAccounts}
              loading={providerLoading}
              error={providerError}
            />
          </>
        );

      default:
        return (
          <div>
            <h2>Page Not Found</h2>
            <p>Unknown admin route: {route}</p>
            <a href="#/admin/dashboard">Go to Dashboard</a>
          </div>
        );
    }
  };

  return (
    <AuthGate>
      <AdminLayout>{renderRoute()}</AdminLayout>
    </AuthGate>
  );
}
