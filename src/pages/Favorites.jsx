import { useData } from '../context/DataContext'
import { usePlayer } from '../context/PlayerContext'
import SongList from '../components/SongList'
import { Spinner, Empty } from '../components/UI'
import { HeartIcon, PlayIcon, ShuffleIcon } from '../components/Icons'

export default function Favorites() {
  const { favSongs, loading, userLoading } = useData()
  const { playAll } = usePlayer()
  if (loading || userLoading) return <Spinner />
  return (
    <>
      <div className="hero">
        <h1>Favorites</h1>
        <p>{favSongs.length} liked {favSongs.length === 1 ? 'song' : 'songs'}</p>
        {favSongs.length > 0 && (
          <div className="hero-actions">
            <button className="btn primary" onClick={() => playAll(favSongs)}><PlayIcon size={18} /> Play all</button>
            <button className="btn ghost" onClick={() => playAll(favSongs, true)}><ShuffleIcon size={18} /> Shuffle</button>
          </div>
        )}
      </div>
      {favSongs.length ? <SongList songs={favSongs} /> :
        <Empty icon={<HeartIcon size={32} />} title="No favorites yet" text="Tap the heart on any song to save it here." />}
    </>
  )
}
