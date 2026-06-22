# SDKWork Mail SDKs

This directory is the SDK boundary owned by `sdkwork-mail`.

- `sdkwork-mail-sdk` owns the provider-standard Mail media/runtime SDK workspace.
- `sdkwork-mail-backend-sdk` owns the generated backend API SDK boundary.

Call signaling, invite lifecycle, conversation delivery, and browser WebSocket business protocol are
owned by IM/Craw Chat. `sdkwork-mail` intentionally does not publish an app/client call-signaling SDK
or app-api Mail session route family.

Mail SDK workspaces must stay in this repository. `sdkwork-appbase` must not aggregate Mail SDK
sources, route specifications, Rust storage, or generated SDK authority files.
