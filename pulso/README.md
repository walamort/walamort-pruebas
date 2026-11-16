# Walamort Pulso 1.0.0

Installable ES/EN/PT tuner and rhythm practice companion. Eleven instrument profiles, alternate tunings, concert/written pitch, A4 430–450 Hz, target lock, microphone input selector, cents and history. Pitch range 25–2400 Hz, one sustained note; unpitched percussion and chord tuning are unsupported. Reference uses a pure sine wave. Instrument artwork is an interactive schematic, not a photo.

Metronome: 30–260 quarter-note BPM, six meters, fourteen simplified study patterns (two-bar son claves), four editable tracks with accents, three original synthesized kits, swing, tap tempo, extra subdivisions, silent cycles and tempo ramp every four cycles. Pattern edits apply to the next cycle. Sound/silent counts refer to entire pattern cycles (two bars for claves). Foreground use only; leaving the app stops audio and microphone.

Local WAV replacement for the wood track: 8 MB, 10 s, mono/stereo PCM16/24/32 or IEEEfloat32. Temporary, excluded from exports. No recording/upload. Saves up to20 patterns and100 played sessions (minimum5s), validated single-pattern JSON import/export. Progress export is an archive, not yet restorable. First web load needs network; Android bundles assets. No ads/accounts/analytics. Back up patterns because browser storage can be cleared.

Tests: `node tests/pulso-core.cjs`, `node tests/pulso-audio.cjs`. Synthetic pitch fixtures are not a substitute for physical microphone/Android checks.

Discovery regression checks cover Pulso searches in all three interface languages.
