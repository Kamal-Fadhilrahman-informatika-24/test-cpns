import { useState, useRef, useCallback } from 'react'

/**
 * useSound — Web Audio API sound system (no external files needed)
 * Falls back silently if AudioContext unavailable.
 */
export function useSound() {
  const [soundOn, setSoundOn] = useState(() => {
    return localStorage.getItem('cpns_sound') !== 'false'
  })
  const ctxRef = useRef(null)

  // Lazy-init AudioContext (must be after user gesture)
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      } catch (_) {
        return null
      }
    }
    return ctxRef.current
  }, [])

  /**
   * Low-level tone generator
   * @param {number} frequency - Hz
   * @param {number} duration  - seconds
   * @param {'sine'|'square'|'sawtooth'|'triangle'} type
   * @param {number} gainValue - 0..1
   */
  const playTone = useCallback((frequency, duration, type = 'sine', gainValue = 0.28) => {
    if (!soundOn) return
    const ac = getCtx()
    if (!ac) return
    try {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)

      osc.type = type
      osc.frequency.setValueAtTime(frequency, ac.currentTime)

      gain.gain.setValueAtTime(gainValue, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)

      osc.start(ac.currentTime)
      osc.stop(ac.currentTime + duration)
    } catch (_) {}
  }, [soundOn, getCtx])

  /** 🎵 Sound: button click */
  const playClick = useCallback(() => {
    playTone(440, 0.08, 'sine', 0.15)
  }, [playTone])

  /** 🎵 Sound: correct answer — ascending 3-note chord */
  const playCorrect = useCallback(() => {
    playTone(523.25, 0.12, 'sine', 0.25)          // C5
    setTimeout(() => playTone(659.25, 0.12, 'sine', 0.25), 110) // E5
    setTimeout(() => playTone(783.99, 0.22, 'sine', 0.25), 220) // G5
  }, [playTone])

  /** 🎵 Sound: wrong answer — low buzz */
  const playWrong = useCallback(() => {
    playTone(180, 0.08, 'sawtooth', 0.18)
    setTimeout(() => playTone(160, 0.18, 'sawtooth', 0.14), 80)
  }, [playTone])

  /** 🎵 Sound: timer warning — short tick */
  const playTimerWarn = useCallback(() => {
    playTone(880, 0.07, 'square', 0.10)
  }, [playTone])

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      const next = !prev
      localStorage.setItem('cpns_sound', String(next))
      return next
    })
  }, [])

  return {
    soundOn,
    toggleSound,
    playClick,
    playCorrect,
    playWrong,
    playTimerWarn
  }
}
