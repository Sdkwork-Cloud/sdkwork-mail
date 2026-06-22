package com.sdkwork.Mail.metadata

enum class MailProviderSelectionSource {
    provider_url,
    provider_key,
    tenant_override,
    deployment_profile,
    default_provider,
}

data class ParsedMailProviderUrl(
    val providerKey: String,
    val rawUrl: String,
)

data class MailProviderSelection(
    val providerKey: String,
    val source: MailProviderSelectionSource,
)

data class MailProviderSelectionRequest(
    val providerUrl: String? = null,
    val providerKey: String? = null,
    val tenantOverrideProviderKey: String? = null,
    val deploymentProfileProviderKey: String? = null,
)

val mail_PROVIDER_SELECTION_SOURCES: List<String> = listOf(
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
)

val mail_PROVIDER_SELECTION_PRECEDENCE: List<String> = listOf(
    "provider_url",
    "provider_key",
    "tenant_override",
    "deployment_profile",
    "default_provider",
)

private fun hasMailProviderSelectionText(value: String?): Boolean = value != null && value.isNotBlank()

fun parseMailProviderUrl(providerUrl: String): ParsedMailProviderUrl {
    val trimmed = providerUrl.trim()
    require(trimmed.startsWith("Mail:") && trimmed.contains("://")) {
        "Invalid Mail provider URL: $providerUrl"
    }

    return ParsedMailProviderUrl(
        providerKey = trimmed.substring(4, trimmed.indexOf("://")).lowercase(),
        rawUrl = providerUrl,
    )
}

fun resolveMailProviderSelection(
    request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
    defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
): MailProviderSelection {
    if (hasMailProviderSelectionText(request.providerUrl)) {
        return MailProviderSelection(
            providerKey = parseMailProviderUrl(request.providerUrl!!).providerKey,
            source = MailProviderSelectionSource.provider_url,
        )
    }

    if (hasMailProviderSelectionText(request.providerKey)) {
        return MailProviderSelection(
            providerKey = request.providerKey!!.trim(),
            source = MailProviderSelectionSource.provider_key,
        )
    }

    if (hasMailProviderSelectionText(request.tenantOverrideProviderKey)) {
        return MailProviderSelection(
            providerKey = request.tenantOverrideProviderKey!!.trim(),
            source = MailProviderSelectionSource.tenant_override,
        )
    }

    if (hasMailProviderSelectionText(request.deploymentProfileProviderKey)) {
        return MailProviderSelection(
            providerKey = request.deploymentProfileProviderKey!!.trim(),
            source = MailProviderSelectionSource.deployment_profile,
        )
    }

    return MailProviderSelection(
        providerKey = defaultProviderKey,
        source = MailProviderSelectionSource.default_provider,
    )
}
