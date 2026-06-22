// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MailSdk",
    platforms: [
        .iOS(.v15),
        .macOS(.v13),
    ],
    products: [
        .library(
            name: "MailSdk",
            targets: ["MailSdk"]
        ),
    ],
    targets: [
        .target(
            name: "MailSdk",
            path: "Sources/MailSdk"
        ),
    ]
)

// build system: swift-package-manager
