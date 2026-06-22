package com.sdkwork.Mail.metadata

data class MailCapabilityCatalogEntry(
    val capabilityKey: String,
    val category: String,
    val surface: String,
)

object MailCapabilityCatalog {
    val entries: List<MailCapabilityCatalogEntry> = listOf(
        MailCapabilityCatalogEntry("transport.connect", "required-baseline", "control-plane"),
        MailCapabilityCatalogEntry("transport.authenticate", "required-baseline", "control-plane"),
        MailCapabilityCatalogEntry("health", "required-baseline", "control-plane"),
        MailCapabilityCatalogEntry("smtp.send", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("imap.sync", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("imap.folder-sync", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("imap.message-sync", "optional-advanced", "runtime-bridge"),
        MailCapabilityCatalogEntry("transport.retry", "optional-advanced", "control-plane"),
        MailCapabilityCatalogEntry("transport.pool", "optional-advanced", "control-plane"),
    )

fun getMailCapabilityCatalog(): List<MailCapabilityCatalogEntry> = entries

    fun getMailCapabilityDescriptor(capabilityKey: String): MailCapabilityCatalogEntry? =
        entries.firstOrNull { it.capabilityKey == capabilityKey }

}
