import { PlayIcon, TrashIcon, MusicIcon } from './Icons'

export default function PlaylistCard({ playlist, songs, onOpen, onPlay, onDelete }) {
  const covers = songs.slice(0, 4)
  return (
    <div className="card playlist" onClick={onOpen}>
      <div className="card-img mosaic">
        {covers.length ? (
          <div className={'mosaic-grid m' + (covers.length >= 4 ? 4 : 1)}>
            {(covers.length >= 4 ? covers : [covers[0]]).map((s, i) => <img key={i} src={s.cover_url} alt="" loading="lazy" />)}
          </div>
        ) : (
          <div className="mosaic-empty"><MusicIcon size={40} /></div>
        )}
        {songs.length > 0 && (
          <button className="play-fab" aria-label="Play playlist" onClick={(e) => { e.stopPropagation(); onPlay() }}>
            <PlayIcon size={20} />
          </button>
        )}
        {onDelete && (
          <button className="card-del icon-btn" aria-label="Delete playlist"
            onClick={(e) => { e.stopPropagation(); onDelete() }}>
            <TrashIcon size={16} />
          </button>
        )}
      </div>
      <h4>{playlist.name}</h4>
      <p>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</p>
    </div>
  )
}
