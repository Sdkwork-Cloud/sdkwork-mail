package com.sdkwork.Mail.metadata

class MailDriverManager {
    fun resolveSelection(
        request: MailProviderSelectionRequest = MailProviderSelectionRequest(),
        defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
    ): MailProviderSelection {
        return resolveMailProviderSelection(request, defaultProviderKey)
    }

    fun describeProviderSupport(providerKey: String): MailProviderSupport {
        val official = getMailProviderByProviderKey(providerKey) != null
        val activation = getMailProviderActivationByProviderKey(providerKey)

        return createMailProviderSupportState(
            MailProviderSupportStateRequest(
                providerKey = providerKey,
                builtin = activation?.builtin ?: false,
                official = official,
                registered = activation?.runtimeBridge ?: false,
            )
        )
    }

    fun listProviderSupport(): List<MailProviderSupport> {
        return MailProviderCatalog.entries.map { describeProviderSupport(it.providerKey) }
    }
}
