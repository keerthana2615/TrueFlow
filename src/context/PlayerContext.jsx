import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useData } from './DataContext'

const PlayerContext = createContext(null)
export const usePlayer = () => useContext(PlayerContext)

export function PlayerProvider({ children }) {
  const { logPlay } = useData()
  const audioRef = useRef(null)
  if (!audioRef.current) audioRef.current = new Audio()

  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [audioError, setAudioError] = useState('')
  const current = queue[index] || null

  const load = useCallback((q, i) => {
    const song = q[i]
    if (!song) return
    const a = audioRef.current
    setQueue(q); setIndex(i); setAudioError(''); setTime(0); setDuration(0)
    a.src = song.audio_url
    a.play().catch(() => {})
    logPlay(song.id)
  }, [logPlay])

  // Keep latest values for audio event handlers.
  const live = useRef({})
  live.current = { queue, index, load }

  useEffect(() => {
    const a = audioRef.current
    a.volume = 0.8
    const handlers = {
      timeupdate: () => setTime(a.currentTime),
      loadedmetadata: () => setDuration(a.duration || 0),
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      error: () => { setPlaying(false); setAudioError('This track could not be loaded.') },
      ended: () => {
        const { queue: q, index: i, load: ld } = live.current
        if (q.length) ld(q, (i + 1) % q.length)
      },
    }
    Object.entries(handlers).forEach(([e, h]) => a.addEventListener(e, h))
    return () => {
      Object.entries(handlers).forEach(([e, h]) => a.removeEventListener(e, h))
      a.pause()
    }
  }, [])

  const playSong = (song, list) => {
    const q = list && list.length ? list : [song]
    const i = q.findIndex((s) => s.id === song.id)
    load(q, i < 0 ? 0 : i)
  }

  const playAll = (list, shuffle = false) => {
    if (!list.length) return
    const q = shuffle ? [...list].sort(() => Math.random() - 0.5) : list
    load(q, 0)
  }

  const toggle = () => {
    const a = audioRef.current
    if (!current) return
    if (a.paused) a.play().catch(() => {}); else a.pause()
  }
  const next = () => { if (queue.length) load(queue, (index + 1) % queue.length) }
  const prev = () => {
    const a = audioRef.current
    if (!queue.length) return
    if (a.currentTime > 3) { a.currentTime = 0; return }
    load(queue, (index - 1 + queue.length) % queue.length)
  }
  const seek = (t) => { audioRef.current.currentTime = t; setTime(t) }
  const setVolume = (v) => {
    const a = audioRef.current
    a.volume = v; setVolumeState(v)
    if (v > 0 && a.muted) { a.muted = false; setMuted(false) }
  }
  const toggleMute = () => { const a = audioRef.current; a.muted = !a.muted; setMuted(a.muted) }

  return (
    <PlayerContext.Provider value={{
      current, queue, playing, time, duration, volume, muted, audioError,
      playSong, playAll, toggle, next, prev, seek, setVolume, toggleMute,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}
