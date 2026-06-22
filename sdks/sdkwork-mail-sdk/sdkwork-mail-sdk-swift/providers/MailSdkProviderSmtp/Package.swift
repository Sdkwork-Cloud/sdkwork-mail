// providerKey: smtp
// pluginId: Mail-smtp
// driverId: sdkwork-mail-driver-smtp
// packageIdentity: MailSdkProviderSmtp
// sourcePath: Sources/MailSdkProviderSmtp/MailProviderSmtpPackageContract.swift
// sourceSymbol: MailProviderSmtpPackageContract
// rootPublic: false
// status: future-runtime-bridge-only
// runtimeBridgeStatus: reserved

import PackageDescription

let package = Package(
    name: "MailSdkProviderSmtp",
    products: [
        .library(
            name: "MailSdkProviderSmtp",
            targets: ["MailSdkProviderSmtp"]
        ),
    ],
    targets: [
        .target(
            name: "MailSdkProviderSmtp",
            path: "Sources/MailSdkProviderSmtp"
        ),
    ]
)
