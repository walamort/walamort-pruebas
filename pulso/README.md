# Walamort Pulso 1.1.0

ES/EN/PT instrument tuner and rhythm practice app. Twelve optimized AI-generated realistic portraits represent the selected instrument, including separate guitar7 and bass4/5/6 images. Touching a note locks its target, pauses microphone capture and plays a recorded reference. Eight selectable sampled voices plus pure sine: guitar, bass, violin, cello, flute, sax, piano and glockenspiel. Ukulele/mandolin automatically use guitar references; viola uses violin. Notes between sparse recordings are retuned. These are reference timbres, not exact multisamples of every instrument variant.

32 editable simplified study grooves across six meters, 30–260 quarter-note BPM. Five kits: recorded acoustic, jazz ride, Latin percussion, soft acoustic and original electronic synthesis. Recorded kits select normal/accent source layers and alternate two recordings per layer. The four tracks adapt their displayed names to the kit. Regional grooves are simplified study patterns, not comprehensive authentic performances. Son claves preserve two bars. Sound/silent counts and tempo ramp refer to entire pattern cycles.

Instrument recordings: CC BY3, glockenspiel and Virtuosity Drums CC0. Credits, license notices, pinned sources and hashes in samples/. Drums converted to mono44.1kHz MP3, max3s, tail fade. See samples/CREDITS.md. Eight banks contain59 recordings; percussion28 variations. Offline cache includes all shipped audio and portraits. First PWA installation needs network. Android bundles the files.

Microphone: local monophonic25–2400Hz, A4430–450, no recording/upload. Reference playback and mic are mutually exclusive. Audio and capture stop when backgrounded. No screen-off playback. Session history100 and saved patterns20; single-pattern JSON import/export, progress archive export. User WAV replacement remains temporary,≤10s/8MB, not exported.

Validation: tests/pulso-core.cjs, pulso-audio.cjs, pulso-recordings.cjs and complete repository regression suites. Physical microphone and Android-device audition remain owner checks.
