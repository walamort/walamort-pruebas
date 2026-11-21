# Walamort Mezcla 1.2

Spanish offline PWA: 24 lessons, eight per level, 72 guided steps and private progress. Existing lesson IDs and old v1 settings remain readable. Completion reflects comprehension, not certification or an assessment of musical taste.

Local audio: one song or up to eight mono/stereo WAV PCM/float32, Layer III MP3 or FLAC stems. Header/frame preflight precedes sequential decoding. Limits: 64 MiB/file, 160 MiB/selection, eight minutes/file, 256 MiB imported decoded budget including the previous session during replacement. Validate actual channels, duration, allocation and finite samples. Failure/cancel retains the prior session. No upload or service-worker storage of chosen audio. Stems share one clock and a common loop bounded by the shortest file, with five-millisecond edge fades. BPM never stretches imported audio. Each stem has fader, pan, mute and solo.

One learning rack applies to the bus or one selected source; other sources stay dry. This is not eight independent racks. Four EQ bands (bell/shelf extremes, parametric mids), frequency/gain/Q, optional 12 dB/oct HP/LP and response plots. Custom AudioWorklet compressor: linked instantaneous stereo peak, detector HP, knee, ratio1–20, attack0.1–2000ms, release2–4000ms, manual wet-path makeup and parallel blend. Gain-reduction dB follows exponential attack/release time constants (63.2% of a constant requested change per time constant). No lookahead, external sidechain or auto-makeup; not a hardware emulation. Native Web Audio dynamics times stop at one second, hence this custom processor. HTTPS/AudioWorklet required. Reference: https://webaudio.github.io/web-audio-api/ . Static compression graph excludes makeup, parallel blend and detector motion.

Synthetic reverb: nominal0.2–6s decay,0–150ms predelay, progressive HF damping and return HP/tone; dual-convolver transitions. Delay: manual1–2000ms or six synchronized figures, non-resonant HP/LP feedback up to85%. Stop resets the compressor and clears effect memory. Bypass/mono and channel-peak meters before mono; no automatic loudness matching, LUFS, true-peak or mastering claims.

JSON v2 stores rack, mixer, fragment and source names, not audio. Reselect originals after reopening; relink matches name/duration, not content identity. Twelve local versions, journal archive export. No audio render here; the full production lab remains linked. No accounts, ads, microphone or analytics. First PWA load needs internet; shipped media/worklet files cache offline. No native APK, Play release or course translations. Licenses and hashes remain in audio/. Tests cover actual DSP/worklet blocks, media preflight, routing, atomic import/cancel, aligned loops and relinking; browser tests use generated WAV fixtures. Physical-device listening is an owner check.


## Estudio 1.3

Navegación por módulos Mezcla/Mastering, EQ y curva de compresión interactivos (puntero y teclado), paneo descriptivo, guardado automático de parámetros y lista de revisión/informes local. Cuatro presets de mastering modifican explícitamente el rack del bus y la etapa final; no son análisis automático ni clones de terceros. La etapa final tiene ganancia, anchura M/S y limitador estéreo enlazado de pico de muestra con 5 ms de anticipación, sin true peak/oversampling. La monitorización y captura se toman después de mono y de la etapa final. El volumen de salida afecta la medición y el WAV.

Pico, RMS estéreo sin ponderar (bloques de 300 ms), pico retenido, correlación y cresta. Informe acumulado desde el último inicio/reinicio; no escanea toda la canción. Sugerencias deterministas basadas en esos datos; no certifican calidad ni detectan distorsión ya grabada.

Captura WAV estéreo PCM 16 bits en tiempo real, hasta 120 segundos o 64 MiB de muestras (lo que ocurra primero); incluye los cambios que se hagan al escuchar. No es render offline ni exportación automática de toda la canción. Se mantiene en memoria hasta cerrar y debe descargarse. Proyectos JSON no contienen audio.

Dos packs optativos de 32 s bajo CC BY 3.0 (Nickleus y spinningmerkaba), fuentes/créditos/transformaciones y SHA256 en library/. Se entregan desde el propio sitio, solo a petición, fuera del precache obligatorio. Los originales completos se enlazan en ccMixter.


### Corrección 1.3.1
Los packs integrados se recuperan desde su identidad y nombres de stems al pulsar Escuchar después de recargar. La biblioteca carga e inicia reproducción en una sola acción, con progreso y reintento visible. Se reconoce la nomenclatura anterior; los archivos privados siguen requiriendo selección explícita.
