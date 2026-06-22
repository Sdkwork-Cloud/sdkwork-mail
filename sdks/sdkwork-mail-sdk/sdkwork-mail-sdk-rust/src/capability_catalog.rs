#[derive(Clone, Copy)]
#[allow(non_snake_case)]
pub struct MailCapabilityCatalogEntry {
    pub capabilityKey: &'static str,
    pub category: &'static str,
    pub surface: &'static str,
}

pub struct MailCapabilityCatalog;

pub const mail_CAPABILITY_CATALOG: [MailCapabilityCatalogEntry; 20] = [
    MailCapabilityCatalogEntry { capabilityKey: "session", category: "required-baseline", surface: "cross-surface" },
    MailCapabilityCatalogEntry { capabilityKey: "credential", category: "required-baseline", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "provider.webhook", category: "required-baseline", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "provider.event-normalization", category: "required-baseline", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "health", category: "required-baseline", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "media.audio", category: "required-baseline", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "media.video", category: "required-baseline", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "live.broadcast", category: "required-baseline", surface: "cross-surface" },
    MailCapabilityCatalogEntry { capabilityKey: "live.audience", category: "required-baseline", surface: "cross-surface" },
    MailCapabilityCatalogEntry { capabilityKey: "screen-share", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "recording", category: "optional-advanced", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "artifact", category: "optional-advanced", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "cloud-mix", category: "optional-advanced", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "cdn-relay", category: "optional-advanced", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "data-channel", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "transcription", category: "optional-advanced", surface: "control-plane" },
    MailCapabilityCatalogEntry { capabilityKey: "beauty", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "spatial-audio", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "e2ee", category: "optional-advanced", surface: "runtime-bridge" },
    MailCapabilityCatalogEntry { capabilityKey: "provider.active-query", category: "optional-advanced", surface: "control-plane" },
];

pub fn get_mail_capability_catalog() -> &'static [MailCapabilityCatalogEntry] {
    &mail_CAPABILITY_CATALOG
}

pub fn get_mail_capability_descriptor(
    capability_key: &str,
) -> Option<&'static MailCapabilityCatalogEntry> {
    mail_CAPABILITY_CATALOG
        .iter()
        .find(|entry| entry.capabilityKey == capability_key)
}
