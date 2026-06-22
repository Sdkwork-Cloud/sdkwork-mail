import type {
  SdkworkAuthAppearanceConfig,
  SdkworkAuthRuntimeConfig,
} from "@sdkwork/auth-pc-react";

const mail_VERIFICATION_POLICY = {
  emailCodeLoginEnabled: false,
  emailRegistrationVerificationRequired: false,
  phoneCodeLoginEnabled: false,
  phoneRegistrationVerificationRequired: false,
};

export function resolveMailAuthRuntimeConfig(): SdkworkAuthRuntimeConfig {
  return {
    leftRailMode: "qr-only",
    loginMethods: ["password"],
    oauthLoginEnabled: false,
    oauthProviders: [],
    qrLoginEnabled: true,
    recoveryMethods: [],
    registerMethods: ["email", "phone"],
    verificationPolicy: mail_VERIFICATION_POLICY,
  };
}

export function resolveMailAuthAppearance(): SdkworkAuthAppearanceConfig {
  return {
    asidePanelClassName: "sdkwork-mail-auth-aside-panel",
    bodyClassName: "sdkwork-mail-auth-body",
    contentContainerClassName: "sdkwork-mail-auth-content",
    pageClassName: "sdkwork-mail-auth-page",
    qrFrameClassName: "sdkwork-mail-auth-qr-frame",
    shellClassName: "sdkwork-mail-auth-card-shell",
    slotProps: {
      background: {
        className: "sdkwork-mail-auth-background",
      },
      page: {
        className: "sdkwork-mail-auth-page",
      },
      shell: {
        className: "sdkwork-mail-auth-card-shell",
      },
    },
    theme: {
      asideCardBackgroundColor: "var(--sdkwork-mail-auth-aside-card-bg)",
      asideCardBorderColor: "var(--sdkwork-mail-auth-aside-card-border)",
      asidePanelBackgroundColor: "var(--sdkwork-mail-auth-aside-bg)",
      asidePanelBorderColor: "var(--sdkwork-mail-auth-aside-border)",
      asidePanelColor: "var(--sdkwork-mail-auth-aside-text)",
      badgeBackgroundColor: "var(--sdkwork-mail-auth-aside-badge-bg)",
      badgeTextColor: "var(--sdkwork-mail-auth-aside-badge-text)",
      contentBackgroundColor: "var(--sdkwork-mail-auth-content-bg)",
      contentBorderColor: "transparent",
      contentTextColor: "var(--sdkwork-mail-auth-content-text)",
      descriptionColor: "var(--sdkwork-mail-auth-muted-text)",
      dividerColor: "var(--sdkwork-mail-auth-divider)",
      fieldBackgroundColor: "var(--sdkwork-mail-auth-field-bg)",
      fieldBorderColor: "transparent",
      fieldPlaceholderColor: "#9ca3af",
      fieldTextColor: "var(--sdkwork-mail-auth-content-text)",
      formMutedTextColor: "var(--sdkwork-mail-auth-muted-text)",
      iconMutedColor: "var(--sdkwork-mail-auth-muted-text)",
      labelColor: "var(--sdkwork-mail-auth-content-text)",
      pageBackgroundColor: "var(--sdkwork-mail-auth-bg)",
      qrFrameBackgroundColor: "var(--sdkwork-mail-auth-qr-bg)",
      qrFrameBorderColor: "transparent",
      shellBackgroundColor: "var(--sdkwork-mail-auth-content-bg)",
      shellBorderColor: "transparent",
      tabActiveBackgroundColor: "transparent",
      tabActiveTextColor: "var(--sdkwork-mail-auth-content-text)",
      tabBackgroundColor: "transparent",
      tabInactiveTextColor: "var(--sdkwork-mail-auth-muted-text)",
      titleColor: "var(--sdkwork-mail-auth-content-text)",
    },
  };
}

export function resolveMailAuthLocale(): string | null {
  if (typeof navigator === "undefined") {
    return null;
  }
  const language = navigator.language.trim();
  return language || null;
}
