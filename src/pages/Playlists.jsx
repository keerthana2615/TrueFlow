import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { usePlayer } from '../context/PlayerContext'
import PlaylistCard from '../components/PlaylistCard'
import SongList from '../components/SongList'
import { Spinner, Empty, Section } from '../components/UI'
import { BackIcon, ListIcon, PlayIcon, PlusIcon, ShuffleIcon, TrashIcon } from '../components/Icons'

function AddSongsPanel({ playlist }) {
  const { songs, addToPlaylist } = useData()
  const [filter, setFilter] = useState('')
  const f = filter.trim().toLowerCase()
  const list = songs
    .filter((s) => !playlist.songIds.includes(s.id))
    .filter((s) => !f || s.title.toLowerCase().includes(f) || s.artist.toLowerCase().includes(f))
    .slice(0, 30)
  return (
    <Section title="Add songs">
      <input className="text-input" placeholder="Filter songs to add..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      <div className="songlist add-list">
        {list.length === 0 && <p className="muted pad">No more songs to add.</p>}
        {list.map((s) => (
          <div key={s.id} className="song-row simple">
            <img src={s.cover_url} alt="" loading="lazy" />
            <div className="song-meta"><strong>{s.title}</strong><span>{s.artist}</span></div>
            <button className="btn ghost small" onClick={() => addToPlaylist(playlist.id, s.id)}><PlusIcon size={16} /> Add</button>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default function Playlists() {
  const { playlists, songById, createPlaylist, deletePlaylist, removeFromPlaylist, loading, userLoading } = useData()
  const { playAll } = usePlayer()
  const [params, setParams] = useSearchParams()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  if (loading || userLoading) return <Spinner />

  const plSongs = (p) => p.songIds.map((id) => songById[id]).filter(Boolean)
  const open = playlists.find((p) => p.id === params.get('open'))

  const create = async (e) => {
    e.preventDefault()
    if (!name.trim() || busy) return
    setBusy(true)
    const p = await createPlaylist(name.trim())
    setBusy(false)
    if (p) { setName(''); setParams({ open: p.id }) }
  }
  const remove = async (p) => {
    if (window.confirm(`Delete playlist “${p.name}”?`)) {
      await deletePlaylist(p.id)
      if (open?.id === p.id) setParams({})
    }
  }

  if (open) {
    const songs = plSongs(open)
    return (
      <>
        <button className="btn ghost small" onClick={() => setParams({})}><BackIcon size={16} /> All playlists</button>
        <div className="hero">
          <h1>{open.name}</h1>
          <p>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</p>
          <div className="hero-actions">
            <button className="btn primary" disabled={!songs.length} onClick={() => playAll(songs)}><PlayIcon size={18} /> Play all</button>
            <button className="btn ghost" disabled={!songs.length} onClick={() => playAll(songs, true)}><ShuffleIcon size={18} /> Shuffle</button>
            <button className="btn ghost danger" onClick={() => remove(open)}><TrashIcon size={18} /> Delete</button>
          </div>
        </div>
        {songs.length ? <SongList songs={songs} onRemove={(s) => removeFromPlaylist(open.id, s.id)} /> :
          <Empty icon={<ListIcon size={32} />} title="This playlist is empty" text="Add songs below, or use the + button on any song." />}
        <AddSongsPanel playlist={open} />
      </>
    )
  }

  return (
    <>
      <div className="hero"><h1>Playlists</h1><p>Create playlists and organise your music.</p></div>
      <form className="inline-form big" onSubmit={create}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name (e.g. Workout, Study...)" maxLength={60} />
        <button className="btn primary" type="submit" disabled={busy || !name.trim()}><PlusIcon size={18} /> Create playlist</button>
      </form>
      {playlists.length ? (
        <div className="grid" style={{ marginTop: 24 }}>
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} songs={plSongs(p)}
              onOpen={() => setParams({ open: p.id })} onPlay={() => playAll(plSongs(p))} onDelete={() => remove(p)} />
          ))}
        </div>
      ) : (
        <Empty icon={<ListIcon size={32} />} title="No playlists yet" text="Name your first playlist above to get started." />
      )}
    </>
  )
}
