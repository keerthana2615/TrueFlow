import { useState } from 'react'
import { useData } from '../context/DataContext'
import { CloseIcon, PlusIcon } from './Icons'

export default function AddToPlaylistModal({ song, onClose }) {
  const { playlists, addToPlaylist, createPlaylist } = useData()
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')

  const add = async (p) => {
    if (p.songIds.includes(song.id)) return setMsg(`Already in “${p.name}”`)
    await addToPlaylist(p.id, song.id)
    setMsg(`Added to “${p.name}”`)
  }
  const create = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const p = await createPlaylist(name.trim())
    if (p) { await addToPlaylist(p.id, song.id); setMsg(`Created “${p.name}” and added the song`); setName('') }
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div><h3>Add to playlist</h3><p className="muted">{song.title} – {song.artist}</p></div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="modal-list">
          {playlists.length === 0 && <p className="muted">You have no playlists yet. Create one below.</p>}
          {playlists.map((p) => (
            <button key={p.id} className="modal-item" onClick={() => add(p)}>
              <span>{p.name}</span>
              <span className="muted">{p.songIds.includes(song.id) ? 'Added ✓' : `${p.songIds.length} songs`}</span>
            </button>
          ))}
        </div>
        <form className="inline-form" onSubmit={create}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New playlist name" maxLength={60} />
          <button className="btn primary small" type="submit"><PlusIcon size={16} /> Create</button>
        </form>
        {msg && <p className="modal-msg">{msg}</p>}
      </div>
    </div>
  )
}
