import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { DEMO_SONGS } from '../data/demoSongs'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)
export const useData = () => useContext(DataContext)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favIds, setFavIds] = useState([])
  const [playlists, setPlaylists] = useState([]) // [{id, name, songIds: []}]
  const [recentIds, setRecentIds] = useState([])
  const [userLoading, setUserLoading] = useState(false)

  // ---- Songs catalogue (Supabase, with demo fallback) ----
  useEffect(() => {
    let off = false
    ;(async () => {
      if (!supabase) { setSongs(DEMO_SONGS); setLoading(false); return }
      const { data, error: err } = await supabase
        .from('songs').select('*').order('created_at', { ascending: false })
      if (off) return
      if (err) setError('Could not load songs: ' + err.message)
      setSongs(err || !data?.length ? DEMO_SONGS : data)
      setLoading(false)
    })()
    return () => { off = true }
  }, [])

  // ---- User data: favorites, playlists, recently played ----
  useEffect(() => {
    if (!user || !supabase) { setFavIds([]); setPlaylists([]); setRecentIds([]); return }
    let off = false
    setUserLoading(true)
    ;(async () => {
      const [f, p, r] = await Promise.all([
        supabase.from('favorites').select('song_id').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('playlists').select('id, name, playlist_songs(song_id, added_at)')
          .eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('recently_played').select('song_id').eq('user_id', user.id)
          .order('played_at', { ascending: false }).limit(60),
      ])
      if (off) return
      const err = f.error || p.error || r.error
      if (err) setError('Could not load your library: ' + err.message)
      setFavIds((f.data || []).map((x) => x.song_id))
      setPlaylists((p.data || []).map((pl) => ({
        id: pl.id,
        name: pl.name,
        songIds: (pl.playlist_songs || [])
          .sort((a, b) => new Date(a.added_at) - new Date(b.added_at))
          .map((s) => s.song_id),
      })))
      const seen = new Set()
      setRecentIds((r.data || []).map((x) => x.song_id).filter((id) => !seen.has(id) && seen.add(id)))
      setUserLoading(false)
    })()
    return () => { off = true }
  }, [user?.id])

  // ---- Derived data ----
  const songById = useMemo(() => Object.fromEntries(songs.map((s) => [s.id, s])), [songs])
  const favSongs = useMemo(() => favIds.map((id) => songById[id]).filter(Boolean), [favIds, songById])
  const recentSongs = useMemo(() => recentIds.map((id) => songById[id]).filter(Boolean), [recentIds, songById])
  const newReleases = songs // already ordered newest first
  const trending = useMemo(() => [...songs].sort((a, b) => a.id.localeCompare(b.id)), [songs])

  const artists = useMemo(() => {
    const map = {}
    songs.forEach((s) => {
      map[s.artist] = map[s.artist] || { name: s.artist, cover_url: s.cover_url, songs: [] }
      map[s.artist].songs.push(s)
    })
    return Object.values(map)
  }, [songs])

  // Simple, explainable recommendations: score unheard songs by the genres and
  // artists found in the user's favorites + recently played.
  const recommended = useMemo(() => {
    const seed = [...favSongs, ...recentSongs]
    const gw = {}, aw = {}
    seed.forEach((s) => { gw[s.genre] = (gw[s.genre] || 0) + 1; aw[s.artist] = (aw[s.artist] || 0) + 1 })
    const used = new Set(seed.map((s) => s.id))
    const scored = songs
      .filter((s) => !used.has(s.id))
      .map((s) => ({ s, score: (gw[s.genre] || 0) * 2 + (aw[s.artist] || 0) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.s)
    return scored.length ? scored : songs
  }, [songs, favSongs, recentSongs])

  // ---- Actions ----
  const fail = (e) => setError(e.message || String(e))

  const toggleFavorite = async (song) => {
    if (!user || !supabase) return
    const has = favIds.includes(song.id)
    setFavIds((ids) => (has ? ids.filter((i) => i !== song.id) : [song.id, ...ids]))
    const res = has
      ? await supabase.from('favorites').delete().eq('user_id', user.id).eq('song_id', song.id)
      : await supabase.from('favorites').insert({ user_id: user.id, song_id: song.id })
    if (res.error) {
      fail(res.error)
      setFavIds((ids) => (has ? [song.id, ...ids] : ids.filter((i) => i !== song.id)))
    }
  }

  const createPlaylist = async (name) => {
    if (!user || !supabase) return null
    const { data, error: err } = await supabase
      .from('playlists').insert({ user_id: user.id, name }).select().single()
    if (err) { fail(err); return null }
    const pl = { id: data.id, name: data.name, songIds: [] }
    setPlaylists((p) => [pl, ...p])
    return pl
  }

  const deletePlaylist = async (id) => {
    const { error: err } = await supabase.from('playlists').delete().eq('id', id)
    if (err) return fail(err)
    setPlaylists((p) => p.filter((x) => x.id !== id))
  }

  const addToPlaylist = async (playlistId, songId) => {
    const { error: err } = await supabase
      .from('playlist_songs').insert({ playlist_id: playlistId, song_id: songId })
    if (err) return fail(err)
    setPlaylists((p) => p.map((x) =>
      x.id === playlistId && !x.songIds.includes(songId) ? { ...x, songIds: [...x.songIds, songId] } : x))
  }

  const removeFromPlaylist = async (playlistId, songId) => {
    const { error: err } = await supabase
      .from('playlist_songs').delete().eq('playlist_id', playlistId).eq('song_id', songId)
    if (err) return fail(err)
    setPlaylists((p) => p.map((x) =>
      x.id === playlistId ? { ...x, songIds: x.songIds.filter((i) => i !== songId) } : x))
  }

  const logPlay = useCallback(async (songId) => {
    if (!user) {
      setError('Sign in to save your listening history.')
      return
    }
    if (!supabase) {
      setError('Could not save listening history: Supabase is not configured.')
      return
    }

    try {
      const { error: err } = await supabase
        .from('recently_played')
        .insert({ user_id: user.id, song_id: songId })
      if (err) {
        setError('Could not save listening history: ' + err.message)
        return
      }
      setRecentIds((ids) => [songId, ...ids.filter((i) => i !== songId)].slice(0, 60))
    } catch (err) {
      setError('Could not save listening history: ' + (err instanceof Error ? err.message : String(err)))
    }
  }, [user])

  return (
    <DataContext.Provider value={{
      songs, loading, error, clearError: () => setError(''), userLoading, songById,
      favIds, favSongs, recentSongs, newReleases, trending, artists, recommended, playlists,
      toggleFavorite, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, logPlay,
    }}>
      {children}
    </DataContext.Provider>
  )
}
