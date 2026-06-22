plugins {
    base
}

group = "com.sdkwork"
version = "0.1.0"
description = "Reserved Kotlin package scaffold for com.sdkwork:Mail-sdk with build system: gradle-kotlin-dsl"

extra["sdkworkPublicPackage"] = "com.sdkwork:Mail-sdk"

base {
    archivesName.set("Mail-sdk")
}
