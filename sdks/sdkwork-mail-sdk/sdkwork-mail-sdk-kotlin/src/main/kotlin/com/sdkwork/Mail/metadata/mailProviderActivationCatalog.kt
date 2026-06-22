package com.sdkwork.Mail.metadata

data class MailProviderActivationCatalogEntry(
    val providerKey: String,
    val pluginId: String,
    val driverId: String,
    val activationStatus: String,
    val runtimeBridge: Boolean,
    val rootPublic: Boolean,
    val packageBoundary: Boolean,
    val builtin: Boolean,
    val packageIdentity: String,
)

object MailProviderActivationCatalog {
    val recognizedActivationStatuses: List<String> = listOf(
        "package-boundary",
        "control-metadata-only",
    )

    val entries: List<MailProviderActivationCatalogEntry> = listOf(
        MailProviderActivationCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "package-boundary", true, false, true, true, "com.sdkwork:Mail-sdk-provider-smtp"),
        MailProviderActivationCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", "package-boundary", true, false, true, true, "com.sdkwork:Mail-sdk-provider-imap"),
    )

fun getMailProviderActivationByProviderKey(providerKey: String): MailProviderActivationCatalogEntry? =
        entries.firstOrNull { it.providerKey == providerKey }

}
