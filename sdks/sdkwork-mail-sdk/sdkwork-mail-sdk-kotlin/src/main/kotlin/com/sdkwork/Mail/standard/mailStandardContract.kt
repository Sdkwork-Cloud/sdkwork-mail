package com.sdkwork.Mail.standard

object MailStandardContract {
    const val SYMBOL: String = "MailStandardContract"
}

interface MailProviderDriver<TNativeClient> {
    val providerKey: String

    fun createClient(): MailClient<TNativeClient>
}

interface MailDriverManager<TNativeClient> {
    fun resolveDriver(providerKey: String): MailProviderDriver<TNativeClient>
}

interface MailDataSource<TNativeClient> {
    fun createClient(): MailClient<TNativeClient>
}

interface MailClient<TNativeClient> {
    fun connectTransport()

    fun authenticateTransport()

    fun disconnectTransport()

    fun sendMail()

    fun probeMailbox()

    fun syncMailbox()

    fun healthCheck()

    fun unwrap(): TNativeClient?
}

interface MailRuntimeController<TNativeClient> {
    fun connectTransport()

    fun authenticateTransport()

    fun disconnectTransport()

    fun sendMail()

    fun probeMailbox()

    fun syncMailbox()

    fun healthCheck()
}
