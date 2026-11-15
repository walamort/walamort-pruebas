# Walamort Pulso Android

Independent offline Capacitor app: com.walamort.pulso, v1.0.0 (1).

`npm ci` then `npm run sync`; Java 21 / Android SDK 36: `cd android && ./gradlew :app:assembleDebug`. The pinned GitHub workflow builds a debug APK. Release signing and Play publication are separate and require the owner’s developer registration. Microphone processing is local and monophonic; audio stops when backgrounded. Not a background metronome.
