import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { usePlayer } from '../context/PlayerContext'
import SongList from '../components/SongList'
import PlaylistCard from '../components/PlaylistCard'
import { Spinner, Empty } from '../components/UI'
import { HeartIcon, ListIcon, LibraryIcon } from '../components/Icons'

export default function Library() {
  const { favSongs, recentSongs, playlists, songById, loading, userLoading } = useData()
  const { playAll } = usePlayer()
  const navigate = useNavigate()
  const [tab, setTab] = useState('favorites')
  if (loading || userLoading) return <Spinner />

  const plSongs = (p) => p.songIds.map((id) => songById[id]).filter(Boolean)
  const tabs = [
    ['favorites', `Favorite Songs (${favSongs.length})`],
    ['recent', `Recently Played (${recentSongs.length})`],
    ['playlists', `Saved Playlists (${playlists.length})`],
  ]

  return (
    <>
      <div className="hero"><h1>Your Library</h1><p>Everything you've saved, in one place.</p></div>
      <div className="tabs">
        {tabs.map(([k, label]) => (
          <button key={k} className={'tab' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {tab === 'favorites' && (favSongs.length ? <SongList songs={favSongs} /> :
        <Empty icon={<HeartIcon size={32} />} title="No favorite songs" text="Heart a song and it will show up here." />)}

      {tab === 'recent' && (recentSongs.length ? <SongList songs={recentSongs} /> :
        <Empty icon={<LibraryIcon size={32} />} title="Nothing played yet" text="Songs you play will appear here." />)}

      {tab === 'playlists' && (playlists.length ? (
        <div className="grid">
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} songs={plSongs(p)}
              onOpen={() => navigate(`/playlists?open=${p.id}`)} onPlay={() => playAll(plSongs(p))} />
          ))}
        </div>
      ) : (
        <Empty icon={<ListIcon size={32} />} title="No playlists yet" text="Create your first playlist from the Playlists page.">
          <button className="btn primary" onClick={() => navigate('/playlists')}>Create playlist</button>
        </Empty>
      ))}
    </>
  )
}
