package com.sdkwork.Mail.metadata

data class MailDataSourceOptions(
    val providerUrl: String? = null,
    val providerKey: String? = null,
    val tenantOverrideProviderKey: String? = null,
    val deploymentProfileProviderKey: String? = null,
    val defaultProviderKey: String = MailProviderCatalog.DEFAULT_mail_PROVIDER_KEY,
)

class MailDataSource(
    private val options: MailDataSourceOptions = MailDataSourceOptions(),
    private val driverManager: MailDriverManager = MailDriverManager(),
) {
    fun describeSelection(overrides: MailDataSourceOptions? = null): MailProviderSelection {
        val merged = merge(options, overrides)
        return driverManager.resolveSelection(
            request = MailProviderSelectionRequest(
                providerUrl = merged.providerUrl,
                providerKey = merged.providerKey,
                tenantOverrideProviderKey = merged.tenantOverrideProviderKey,
                deploymentProfileProviderKey = merged.deploymentProfileProviderKey,
            ),
            defaultProviderKey = merged.defaultProviderKey,
        )
    }

    fun describeProviderSupport(overrides: MailDataSourceOptions? = null): MailProviderSupport {
        return driverManager.describeProviderSupport(describeSelection(overrides).providerKey)
    }

    fun listProviderSupport(): List<MailProviderSupport> {
        return driverManager.listProviderSupport()
    }

    private fun merge(
        base: MailDataSourceOptions,
        overrides: MailDataSourceOptions?,
    ): MailDataSourceOptions {
        if (overrides == null) {
            return base
        }

        return MailDataSourceOptions(
            providerUrl = overrides.providerUrl ?: base.providerUrl,
            providerKey = overrides.providerKey ?: base.providerKey,
            tenantOverrideProviderKey = overrides.tenantOverrideProviderKey ?: base.tenantOverrideProviderKey,
            deploymentProfileProviderKey = overrides.deploymentProfileProviderKey ?: base.deploymentProfileProviderKey,
            defaultProviderKey = overrides.defaultProviderKey.ifBlank { base.defaultProviderKey },
        )
    }
}
