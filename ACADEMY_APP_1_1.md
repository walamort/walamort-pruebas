# Academy app 1.1 — 2026-11-14

20 lessons with reviews in ES/EN/PT, including accidentals, key signatures, dots/rests, compound meter, seventh chords, cadences, listening before singing and tuning in cents. The new lessons include concrete practice tasks and links to the relevant trainer. Seventh-chord lessons open advanced chord practice. Compound-meter practice is a guided physical task; the generated rhythm trainer remains in 4/4.

Twelve quiz/timing modes: note reading, aural intervals/chords/scales, melodic dictation, rhythm timing, written intervals/chords, note values/rests, rhythm dictation, major key signatures and aural progressions. Three levels. Automatic next question after correct (1.4s) and incorrect (2.8s) responses, correction highlighting, pause and manual next. Navigation cancels pending advance/audio.

Four offline synthesized timbres; independent solfege/letter naming and chord symbols/names. Octave numbers hidden by default; reading choices never duplicate pitch classes. History and original lesson IDs migrate without clearing data. JSON backups remain schema 1.

Optional local microphone tuner/intonation: adjustable A4 430–450 Hz and 10/20/30-cent tolerance, reference tone, exact-octave target, valid-signal statistics and saved intonation measurement after at least 5s. No recording/upload. Stops at 30s, navigation/backgrounding; late permissions close their tracks. Permission denial keeps the UI usable. Synthesized reference follows the chosen A4.

Android build code 2/version 1.1 declares RECORD_AUDIO, requested only when the user activates capture. Native appStateChange and web visibility/pagehide stop capture/audio. Debug keys are ephemeral: export progress before replacing an earlier APK; uninstall may be necessary if signatures differ. Physical Android audio/microphone/latency/interruptions and Play release signing remain pending.

Validation: 66 Node suites per repository, including randomized generators, unique labels, chord spelling, measured/rest timing, synthetic pitch, microphone denial/late permission cleanup, old backup migration and scoped offline caches. Browser checked correct/incorrect automatic advancement, settings persistence, lesson-to-trainer routing, notation and 390px layout. No real microphone recording was performed.

Next substantial work: longer graded lesson paths, melodic/rhythmic transcription editing in the app, compound and irregular generated meters, instrument-specific sampled sound packs with licenses, guided multi-note singing sequences, and physical Android QA before store submission. This version is an expansion, not a claim of a complete conservatory course or a published Play Store release.
