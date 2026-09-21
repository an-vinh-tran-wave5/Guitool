# Files added for Codemagic

Added:

- `GuitarCoach/project.yml`: XcodeGen specification that creates `GuitarCoach.xcodeproj` on macOS.
- `GuitarCoach/codemagic.yaml`: Codemagic workflow that generates the Xcode project, compiles an unsigned iPhone archive, and packages `GuitarCoach.ipa`.
- `GuitarCoach/Resources/Assets.xcassets`: basic app icon asset catalog.

The generated IPA is intentionally unsigned. It is intended to be re-signed with a personal Apple account using a tool such as Sideloadly on Windows. A paid Apple Developer account is not required for the initial experiment, but Apple Personal Team installations generally expire after 7 days.
