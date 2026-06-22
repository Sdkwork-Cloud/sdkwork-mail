package com.sdkwork.Mail.metadata

data class MailProviderPackageCatalogEntry(
    val providerKey: String,
    val pluginId: String,
    val driverId: String,
    val packageIdentity: String,
    val manifestPath: String,
    val readmePath: String,
    val sourcePath: String,
    val sourceSymbol: String,
    val builtin: Boolean,
    val rootPublic: Boolean,
    val status: String,
    val runtimeBridgeStatus: String,
)

object MailProviderPackageCatalog {
    val entries: List<MailProviderPackageCatalogEntry> = listOf(
        MailProviderPackageCatalogEntry("smtp", "Mail-smtp", "sdkwork-mail-driver-smtp", "com.sdkwork:Mail-sdk-provider-smtp", "providers/Mail-sdk-provider-smtp/build.gradle.kts", "providers/Mail-sdk-provider-smtp/README.md", "providers/Mail-sdk-provider-smtp/src/main/kotlin/com/sdkwork/Mail/provider/smtp/MailProviderSmtpPackageContract.kt", "MailProviderSmtpPackageContract", true, false, "future-runtime-bridge-only", "reserved"),
        MailProviderPackageCatalogEntry("imap", "Mail-imap", "sdkwork-mail-driver-imap", "com.sdkwork:Mail-sdk-provider-imap", "providers/Mail-sdk-provider-imap/build.gradle.kts", "providers/Mail-sdk-provider-imap/README.md", "providers/Mail-sdk-provider-imap/src/main/kotlin/com/sdkwork/Mail/provider/imap/MailProviderImapPackageContract.kt", "MailProviderImapPackageContract", true, false, "future-runtime-bridge-only", "reserved"),
    )

fun getMailProviderPackageByProviderKey(providerKey: String): MailProviderPackageCatalogEntry? =
        entries.firstOrNull { it.providerKey == providerKey }

    fun getMailProviderPackageByPackageIdentity(packageIdentity: String): MailProviderPackageCatalogEntry? =
        entries.firstOrNull { it.packageIdentity == packageIdentity }

}
