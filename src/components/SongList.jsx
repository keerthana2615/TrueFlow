import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import FavButton from './FavButton'
import AddToPlaylistModal from './AddToPlaylistModal'
import { fmt } from './UI'
import { PlayIcon, PauseIcon, PlusIcon, TrashIcon } from './Icons'

export default function SongList({ songs, onRemove }) {
  const { user } = useAuth()
  const { current, playing, playSong, toggle } = usePlayer()
  const navigate = useNavigate()
  const [addSong, setAddSong] = useState(null)

  return (
    <>
      <div className="songlist">
        {songs.map((s, i) => {
          const active = current?.id === s.id
          return (
            <div key={s.id} className={'song-row' + (active ? ' active' : '')}
              onClick={() => (active ? toggle() : playSong(s, songs))}>
              <div className="song-idx">
                <span className="num">{i + 1}</span>
                <span className="ico">{active && playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}</span>
              </div>
              <img src={s.cover_url} alt="" loading="lazy" />
              <div className="song-meta">
                <strong>{s.title}</strong>
                <span>{s.artist}</span>
              </div>
              <span className="song-album">{s.album}</span>
              <div className="song-actions" onClick={(e) => e.stopPropagation()}>
                <FavButton song={s} />
                <button className="icon-btn" title="Add to playlist" aria-label="Add to playlist"
                  onClick={() => (user ? setAddSong(s) : navigate('/login'))}>
                  <PlusIcon size={18} />
                </button>
                {onRemove && (
                  <button className="icon-btn" title="Remove" aria-label="Remove song" onClick={() => onRemove(s)}>
                    <TrashIcon size={18} />
                  </button>
                )}
              </div>
              <span className="song-dur">{fmt(s.duration)}</span>
            </div>
          )
        })}
      </div>
      {addSong && <AddToPlaylistModal song={addSong} onClose={() => setAddSong(null)} />}
    </>
  )
}
