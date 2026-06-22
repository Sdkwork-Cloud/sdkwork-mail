// providerKey: imap
// pluginId: Mail-imap
// driverId: sdkwork-mail-driver-imap
// packageIdentity: MailSdkProviderImap
// sourcePath: Sources/MailSdkProviderImap/MailProviderImapPackageContract.swift
// sourceSymbol: MailProviderImapPackageContract
// rootPublic: false
// status: future-runtime-bridge-only
// runtimeBridgeStatus: reserved

import PackageDescription

let package = Package(
    name: "MailSdkProviderImap",
    products: [
        .library(
            name: "MailSdkProviderImap",
            targets: ["MailSdkProviderImap"]
        ),
    ],
    targets: [
        .target(
            name: "MailSdkProviderImap",
            path: "Sources/MailSdkProviderImap"
        ),
    ]
)
