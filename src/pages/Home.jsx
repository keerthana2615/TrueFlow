import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import MusicCard from '../components/MusicCard'
import ArtistCard from '../components/ArtistCard'
import { Section, Spinner } from '../components/UI'

export default function Home() {
  const { user, name } = useAuth()
  const { loading, recentSongs, trending, recommended, artists } = useData()
  const h = new Date().getHours()
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'

  if (loading) return <Spinner label="Loading your music..." />
  return (
    <>
      <div className="hero">
        <h1>{greet}{user ? `, ${name}` : ''} 👋</h1>
        <p>{user ? 'Pick up where you left off or find something new.' : 'Log in to save favorites, build playlists and get recommendations.'}</p>
      </div>
      {user && recentSongs.length > 0 && (
        <Section title="Recently Played">
          <div className="grid">{recentSongs.slice(0, 6).map((s) => <MusicCard key={s.id} song={s} queue={recentSongs} />)}</div>
        </Section>
      )}
      <Section title="Trending Songs">
        <div className="grid">{trending.slice(0, 6).map((s) => <MusicCard key={s.id} song={s} queue={trending} />)}</div>
      </Section>
      <Section title="Recommended For You">
        <div className="grid">{recommended.slice(0, 6).map((s) => <MusicCard key={s.id} song={s} queue={recommended} />)}</div>
      </Section>
      <Section title="Popular Artists">
        <div className="grid">{artists.slice(0, 6).map((a) => <ArtistCard key={a.name} artist={a} />)}</div>
      </Section>
    </>
  )
}
