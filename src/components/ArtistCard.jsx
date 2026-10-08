import { usePlayer } from '../context/PlayerContext'
import { PlayIcon } from './Icons'

export default function ArtistCard({ artist }) {
  const { playSong } = usePlayer()
  return (
    <div className="card artist" onClick={() => playSong(artist.songs[0], artist.songs)}>
      <div className="card-img round">
        <img src={artist.cover_url} alt={artist.name} loading="lazy" />
        <button className="play-fab" aria-label={`Play ${artist.name}`}><PlayIcon size={20} /></button>
      </div>
      <h4>{artist.name}</h4>
      <p>Artist • {artist.songs.length} {artist.songs.length === 1 ? 'song' : 'songs'}</p>
    </div>
  )
}
