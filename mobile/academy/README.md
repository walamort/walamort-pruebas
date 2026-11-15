# Walamort Academy Android

Offline app sources are in ../../academy-app. Run npm ci and npm run sync, then npm run android. Requires Android Studio and JDK 21. The GitHub workflow produces a debug APK for testing, not a Play Store release. No production signing keys are included.


## Version 1.1 / test build 2
20 ES/EN/PT lessons, 12 exercise modes, synthesized instrument selection, note/chord naming and automatic progression. Optional microphone tuner/intonation processes monophonic input locally without recording/upload. RECORD_AUDIO is declared; permission is requested only after tapping Enable microphone. App backgrounding/navigation stops capture. Validate permissions, interruptions, pitch and timing on real Android devices before release.

Debug builds may use different ephemeral signing keys. Export progress from the installed app before replacing it; Android may require uninstalling the previous debug build. No production signing key or Play Console account is configured.

## Version 1.2 / test build 3
Compact five-area exercise directory with accent-insensitive search, collapsed options and direct exercise switching. Compact lesson rows with search/completion filters. Smaller session chrome/notation cards while retaining 44px touch targets and comfortable lesson text. Existing history and settings remain compatible. Same microphone/privacy/debug-signing limitations as version 1.1.

## Version 1.3 / test build 4
30 original ES/EN/PT lessons in three open learning paths (10 foundation, 15 development, 5 deeper-study introductions), worked examples, 3 self-guided steps per lesson and 28 playable demonstrations. Concept reviews explain answers; completing a review continues within the same path. Existing lesson history identifiers are retained.

Offline scale dictionary: 24 distinct equal-tempered collections in 12 tonics, degree/interval formulas, tonic-aware spelling, clickable piano and standard-tuned guitar maps in four fret windows, ascending/descending playback and four guided tasks. No automatic fingering/technique grading is claimed. The four selected synthesized timbres apply to demonstrations and exercises. Advanced aural scale practice now draws from all 24 collections; beginner/intermediate pools remain smaller. Dictionary access lives under Learn and Home, avoiding a sixth bottom tab. Same local privacy, microphone and debug-signing limits as earlier versions.

Version 1.3.1/build 5 clarifies scale-degree alterations and octave-equivalent tensions in ES/EN/PT, uses flat/sharp glyphs in formulas and clears playback highlights when audio is stopped or backgrounded.

## Version 1.4 / test build 6
16 exercise types plus tuner, intonation and a rhythm studio. Four new trainers cover melodic direction, scale degrees, aural chord inversions and meter grouping. Rhythm supports 11 meter/group combinations, 3 difficulty levels, 1–2 bars, notation, rests, syncopation, metronome subdivisions, tap analysis and optional latency/reaction compensation. Create, save (12), import and export validated patterns; progress backups retain them. Assessment is indicative, not a technique or hardware-latency measurement.

32 bundled CC BY 3.0 recordings (6 MB) cover piano, acoustic guitar, flute and violin using sparse sample pitch interpolation. This is not a separately recorded sample of every pitch or velocity. See academy-app/samples/CREDITS.txt and manifest.json for attribution, pinned sources and hashes. Synthesis remains a fallback. All banks work offline after installation. New original SVG icons, compact navigation, seven-day activity and evidence-based milestones improve orientation without claiming certification. The existing 30 lessons, 24 scales, local privacy and microphone safeguards remain. Debug build 6 requires physical Android validation; export progress before replacing an earlier debug APK.

## Version 1.5 / test build 7
28 chord formulas in 12 roots, spelled compound degrees, selectable bass, simultaneous/arpeggiated audio and interactive piano/guitar pitch-class maps. Complete formula voicings are educational examples, not required real-world arrangements or guitar fingering shapes. Includes sus2/sus4, sevenths, add9, 9/11/13 and altered dominants with explanations about omitted tones and the natural-11 clash.
18 trainers now include pitch-class memory without a reference and chord extensions. Pitch memory is not a perfect-pitch diagnosis or acquisition promise. Rhythm correction plays the expected pattern after a response, before automatic progression, with replay/next/pause controls. Rhythm studio automatically starts a new generated exercise when the global automatic-progression setting is enabled. Navigation/backgrounding cancels pending review/next actions. Existing samples, local progress and patterns remain compatible. Android build 7 is a debug test artifact; export progress before replacement and validate on physical hardware.

## Version 1.6 / test build 8
Scale exploration now changes tonic by clicking instrument notes (toggle off for isolated audition), auto-plays on entry/scale selection, places selectors above the instrument and shows all guitar frets 0–24 with horizontal scrolling. Earlier position-map APIs remain compatible. Tonic clicks preserve scroll position.

19 exercise generators include written-to-concert-pitch reading for B-flat clarinet/trumpet, E-flat alto sax, F horn, B-flat tenor sax and piccolo, with instrument-appropriate enharmonic spelling and explicit octaves at advanced level. Ear/pitch-reading exercises attempt audio automatically and keep Repeat available; browser autoplay restrictions may require an initial user tap. Pure visual tasks and microphone permission remain manual where appropriate. Note-reading answers play the chosen note and show/hear it beside the correct note. Every exercise has a purpose and three practice steps. Level preferences are independent per exercise and survive backups.

Local music plan chooses starting experience, skill focus, 5/10/15 suggested minutes and an optional hourly reminder shown on opening the app if no practice is recorded. These are in-app notices, not scheduled background/system push notifications. No notification permission is requested. Local XP, practice rank and streaks derive from history; they are motivational, not mastery/certification. An eight-question challenge compares the learner with an explicit virtual 75% target, not fake opponent responses. Navigation/backgrounding cancels playback and pending progression. All new content is ES/EN/PT and bundled offline. Debug signing/physical Android testing limitations remain.

## Version 1.7 / test build 9
G, F and C clefs now use bundled vector outlines from Steinberg Bravura (SIL OFL 1.1; source commit and license in academy-app/licenses). They use SMuFL origins on G4/second line, F3/fourth line and C4/third line respectively, independent of fallback font metrics. Shared rendering covers note reading, comparisons, melodic notation and transposing parts. The obsolete duplicate renderer was removed.

Android now declares MODIFY_AUDIO_SETTINGS as well as RECORD_AUDIO, matching the two permissions requested by Capacitor BridgeWebChromeClient for AUDIO_CAPTURE. The audio context is resumed within the Enable click before awaiting getUserMedia. Input constraints fall back once only for compatibility/device-read errors; denial is not retried. Pending capture can be stopped and late streams are closed. The voice UI exposes device selection/refresh, an indicative live input-level bar, device/sample-rate information and localized error categories, separating permission/embedded-browser issues, unavailable/busy inputs and silence. Detector threshold supports quieter input while retaining confidence/clipping checks. No recording/upload was added. Hardware success still requires a physical Android/browser microphone test.

Learning resource cards and course levels now have original SVG icons and warm premium styling consistent with Practice, with corrected selected-card text contrast. Existing history/settings and microphone opt-in remain compatible.

## Version 1.7.1 / test build 10
The startup screen no longer enlarges the raster launcher icon. A dedicated 288dp vector Pulso emblem stays within Android's 192dp icon safe circle, including its 1.02x maximum pulse. Android 12+ uses an 800ms AnimatedVectorDrawable (pulse and 640ms waveform reveal); earlier Android uses the sharp static vector. SplashScreen compatibility is installed before BridgeActivity initialization and exits with a 160ms fade, without a keep-on-screen timer or added launch delay. System-disabled animators skip the exit animation. Adaptive launcher icons also use vector foregrounds on Android 8+.

The app header uses the matching bundled SVG with a one-shot pulse/reveal and prefers-reduced-motion support. Existing brand geometry, burgundy/orange/gold colors, permissions, audio and progress remain unchanged. Native animation behavior and launch appearance still require a physical-device check after installing test build 10.
