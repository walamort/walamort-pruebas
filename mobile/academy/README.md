# Walamort Academy Android

Offline app sources are in ../../academy-app. Run npm ci and npm run sync, then npm run android. Requires Android Studio and JDK 21. The GitHub workflow produces a debug APK for testing, not a Play Store release. No production signing keys are included.


## Version 1.1 / test build 2
20 ES/EN/PT lessons, 12 exercise modes, synthesized instrument selection, note/chord naming and automatic progression. Optional microphone tuner/intonation processes monophonic input locally without recording/upload. RECORD_AUDIO is declared; permission is requested only after tapping Enable microphone. App backgrounding/navigation stops capture. Validate permissions, interruptions, pitch and timing on real Android devices before release.

Debug builds may use different ephemeral signing keys. Export progress from the installed app before replacing it; Android may require uninstalling the previous debug build. No production signing key or Play Console account is configured.
