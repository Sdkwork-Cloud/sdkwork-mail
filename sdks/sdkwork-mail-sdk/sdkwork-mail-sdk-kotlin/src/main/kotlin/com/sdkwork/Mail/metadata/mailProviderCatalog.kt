package com.sdkwork.Mail.metadata

data class MailProviderCatalogEntry(
    val providerKey: String,
    val pluginId: String,
    val driverId: String,
    val defaultSelected: Boolean,
)

object MailProviderCatalog {
    const val DEFAULT_mail_PROVIDER_KEY: String = "smtp"

    val entries: List<MailProviderCatalogEntry> = listOf(
        MailProviderCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", true),
        MailProviderCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", false),
    )

fun getMailProviderByProviderKey(providerKey: String): MailProviderCatalogEntry? =
        entries.firstOrNull { it.providerKey == providerKey }

}
