import { usePlayer } from '../context/PlayerContext'
import FavButton from './FavButton'
import { PlayIcon, PauseIcon } from './Icons'

export default function MusicCard({ song, queue }) {
  const { current, playing, playSong, toggle } = usePlayer()
  const active = current?.id === song.id
  const click = () => (active ? toggle() : playSong(song, queue))
  return (
    <div className={'card' + (active ? ' active' : '')} onClick={click}>
      <div className="card-img">
        <img src={song.cover_url} alt={song.title} loading="lazy" />
        <div className="card-fav"><FavButton song={song} /></div>
        <button className="play-fab" aria-label={active && playing ? 'Pause' : 'Play'}>
          {active && playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>
      </div>
      <h4 title={song.title}>{song.title}</h4>
      <p>{song.artist}</p>
    </div>
  )
}
