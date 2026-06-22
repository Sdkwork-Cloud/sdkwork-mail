package com.sdkwork.Mail.metadata

enum class MailProviderSupportStatus {
    builtin_registered,
    official_registered,
    official_unregistered,
    unknown,
}

data class MailProviderSupport(
    val providerKey: String,
    val status: MailProviderSupportStatus,
    val builtin: Boolean,
    val official: Boolean,
    val registered: Boolean,
)

data class MailProviderSupportStateRequest(
    val providerKey: String,
    val builtin: Boolean,
    val official: Boolean,
    val registered: Boolean,
)

val mail_PROVIDER_SUPPORT_STATUSES: List<String> = listOf(
    "builtin_registered",
    "official_registered",
    "official_unregistered",
    "unknown",
)

fun resolveMailProviderSupportStatus(
    request: MailProviderSupportStateRequest,
): MailProviderSupportStatus {
    if (request.official && request.registered) {
        return if (request.builtin) {
            MailProviderSupportStatus.builtin_registered
        } else {
            MailProviderSupportStatus.official_registered
        }
    }

    if (request.official) {
        return MailProviderSupportStatus.official_unregistered
    }

    return MailProviderSupportStatus.unknown
}

fun createMailProviderSupportState(
    request: MailProviderSupportStateRequest,
): MailProviderSupport {
    return MailProviderSupport(
        providerKey = request.providerKey,
        status = resolveMailProviderSupportStatus(request),
        builtin = request.builtin,
        official = request.official,
        registered = request.registered,
    )
}
