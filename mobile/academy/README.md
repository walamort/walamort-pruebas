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
