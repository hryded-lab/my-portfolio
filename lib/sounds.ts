// Web Audio API sound effects - no external files needed
let audioCtx: AudioContext | null = null
let soundsEnabled = true

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return audioCtx
}

export function setSoundsEnabled(v: boolean) { soundsEnabled = v }
export function getSoundsEnabled() { return soundsEnabled }

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15, startDelay = 0) {
  if (!soundsEnabled || typeof window === 'undefined') return
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(volume, ctx.currentTime + startDelay)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration)
    osc.start(ctx.currentTime + startDelay)
    osc.stop(ctx.currentTime + startDelay + duration)
  } catch {}
}

export function playWindowOpen() {
  playTone(523, 0.08, 'sine', 0.12)
  playTone(659, 0.08, 'sine', 0.12, 0.08)
  playTone(784, 0.12, 'sine', 0.12, 0.16)
}

export function playWindowClose() {
  playTone(784, 0.08, 'sine', 0.1)
  playTone(523, 0.12, 'sine', 0.1, 0.09)
}

export function playClick() {
  playTone(800, 0.04, 'square', 0.06)
}

export function playError() {
  playTone(220, 0.15, 'sawtooth', 0.15)
  playTone(196, 0.2, 'sawtooth', 0.15, 0.15)
}

export function playStartup() {
  // Classic XP-inspired startup chord sequence
  playTone(392, 0.3, 'sine', 0.12)
  playTone(523, 0.3, 'sine', 0.12, 0.1)
  playTone(659, 0.3, 'sine', 0.12, 0.2)
  playTone(784, 0.5, 'sine', 0.15, 0.3)
  playTone(1047, 0.6, 'sine', 0.12, 0.5)
}

export function playMinimize() {
  playTone(600, 0.05, 'sine', 0.08)
  playTone(400, 0.08, 'sine', 0.08, 0.05)
}

export function playNotification() {
  playTone(880, 0.12, 'sine', 0.1)
  playTone(1109, 0.15, 'sine', 0.1, 0.1)
}
