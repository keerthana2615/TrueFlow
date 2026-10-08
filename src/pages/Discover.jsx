import { useState } from 'react'
import { useData } from '../context/DataContext'
import { GENRES } from '../data/demoSongs'
import MusicCard from '../components/MusicCard'
import ArtistCard from '../components/ArtistCard'
import SongList from '../components/SongList'
import { Section, Spinner, Empty } from '../components/UI'
import { MusicIcon } from '../components/Icons'

const GRADIENTS = {
  Pop: ['#ec4899', '#f97316'], Rock: ['#ef4444', '#7f1d1d'], 'Hip-Hop': ['#f59e0b', '#7c3aed'],
  Classical: ['#0ea5e9', '#1e3a8a'], Kannada: ['#eab308', '#dc2626'], Hindi: ['#f43f5e', '#8b5cf6'],
  English: ['#22d3a5', '#2563eb'],
}

export default function Discover() {
  const { loading, trending, newReleases, artists, songs } = useData()
  const [genre, setGenre] = useState(null)
  if (loading) return <Spinner />

  const genreSongs = genre ? songs.filter((s) => s.genre === genre) : []
  return (
    <>
      <div className="hero"><h1>Discover</h1><p>Explore trending tracks, fresh releases and every genre.</p></div>
      <Section title="Browse by Category">
        <div className="genre-grid">
          {GENRES.map((g) => (
            <button key={g} className={'genre-tile' + (genre === g ? ' selected' : '')}
              style={{ background: `linear-gradient(135deg, ${GRADIENTS[g][0]}, ${GRADIENTS[g][1]})` }}
              onClick={() => setGenre(genre === g ? null : g)}>
              {g}
            </button>
          ))}
        </div>
      </Section>

      {genre ? (
        <Section title={`${genre} Songs`}>
          {genreSongs.length ? <SongList songs={genreSongs} /> :
            <Empty icon={<MusicIcon size={32} />} title="No songs yet" text={`Nothing in ${genre} for now.`} />}
        </Section>
      ) : (
        <>
          <Section title="Trending Songs">
            <div className="grid">{trending.slice(0, 6).map((s) => <MusicCard key={s.id} song={s} queue={trending} />)}</div>
          </Section>
          <Section title="New Releases">
            <div className="grid">{newReleases.slice(0, 6).map((s) => <MusicCard key={s.id} song={s} queue={newReleases} />)}</div>
          </Section>
          <Section title="Top Artists">
            <div className="grid">{artists.slice(0, 6).map((a) => <ArtistCard key={a.name} artist={a} />)}</div>
          </Section>
        </>
      )}
    </>
  )
}
