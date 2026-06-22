package com.sdkwork.Mail.metadata

data class MailProviderExtensionCatalogEntry(
    val extensionKey: String,
    val providerKey: String,
    val displayName: String,
    val surface: String,
    val access: String,
    val status: String,
)

object MailProviderExtensionCatalog {
    val recognizedSurfaces: List<String> = listOf(
        "control-plane",
        "runtime-bridge",
        "cross-surface",
    )

    val recognizedAccessModes: List<String> = listOf(
        "unwrap-only",
        "extension-object",
    )

    val recognizedStatuses: List<String> = listOf(
        "reference-baseline",
        "reserved",
    )

    val entries: List<MailProviderExtensionCatalogEntry> = listOf(
        MailProviderExtensionCatalogEntry("smtp.transport", "smtp", "SMTP Transport", "runtime-bridge", "unwrap-only", "reserved"),
        MailProviderExtensionCatalogEntry("imap.sync", "imap", "IMAP Sync", "runtime-bridge", "unwrap-only", "reserved"),
    )

fun getMailProviderExtensionCatalog(): List<MailProviderExtensionCatalogEntry> = entries

    fun getMailProviderExtensionDescriptor(extensionKey: String): MailProviderExtensionCatalogEntry? =
        entries.firstOrNull { it.extensionKey == extensionKey }

    fun getMailProviderExtensionsForProvider(providerKey: String): List<MailProviderExtensionCatalogEntry> =
        entries.filter { it.providerKey == providerKey }

    fun getMailProviderExtensions(extensionKeys: List<String>): List<MailProviderExtensionCatalogEntry> =
        extensionKeys.mapNotNull(::getMailProviderExtensionDescriptor)

    fun hasMailProviderExtension(extensionKeys: List<String>, extensionKey: String): Boolean =
        extensionKeys.contains(extensionKey) && getMailProviderExtensionDescriptor(extensionKey) != null

}
