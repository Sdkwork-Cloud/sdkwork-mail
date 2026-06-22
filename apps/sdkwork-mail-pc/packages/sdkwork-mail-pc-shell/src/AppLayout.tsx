import type { ReactNode } from "react";

import { createMailAppRoutes } from "./mailRoutes";

interface AppLayoutProps {
  children: ReactNode;
  activePath: string;
}

export function AppLayout({ children, activePath }: AppLayoutProps) {
  const routes = createMailAppRoutes();
  const isAdmin = activePath.startsWith("/admin");

  return (
    <div className="Mail-app-layout">
      <header className="Mail-app-header">
        <div className="Mail-app-brand">
          <strong>SDKWork Mail</strong>
        </div>
        <nav className="Mail-app-nav" aria-label="Application surfaces">
          {routes.map((route) => {
            const normalized = route.path.replace(/^#/, "");
            const active = !isAdmin && activePath.startsWith(normalized);
            return (
              <a
                key={route.path}
                href={route.path}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {route.label}
              </a>
            );
          })}
          <a
            href="#/admin/dashboard"
            className={isAdmin ? "active" : undefined}
            aria-current={isAdmin ? "page" : undefined}
          >
            Admin
          </a>
        </nav>
      </header>
      <main className="Mail-app-content">{children}</main>
    </div>
  );
}
