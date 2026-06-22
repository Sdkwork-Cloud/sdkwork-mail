import { HashRouter, Navigate, useLocation } from "react-router-dom";

import { AdminApp } from "./AdminApp";
import { AppAuthGate, mail_APP_HOME_PATH } from "./AppAuthGate";
import { MailApp } from "./MailApp";
import { bootstrap } from "./bootstrap/runtime";

import "@sdkwork/Mail-pc-Mail/src/Mail-app-styles.css";
import "@sdkwork/Mail-pc-admin-core/src/admin-styles.css";

bootstrap();

function AppShell() {
  const location = useLocation();
  const route = location.pathname;

  if (route === "/" || route === "") {
    return <Navigate replace to={mail_APP_HOME_PATH} />;
  }

  if (route.startsWith("/admin")) {
    return <AdminApp route={route} />;
  }

  return (
    <AppAuthGate>
      <MailApp route={route} />
    </AppAuthGate>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
