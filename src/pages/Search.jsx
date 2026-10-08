import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import SongList from '../components/SongList'
import ArtistCard from '../components/ArtistCard'
import { Section, Spinner, Empty } from '../components/UI'
import { SearchIcon } from '../components/Icons'

export default function Search() {
  const [params] = useSearchParams()
  const { songs, artists, loading } = useData()
  const raw = (params.get('q') || '').trim()
  const q = raw.toLowerCase()

  if (loading) return <Spinner />
  if (!q) return <Empty icon={<SearchIcon size={32} />} title="Search TuneFlow" text="Type a song, artist, album or genre." />

  const songRes = songs.filter((s) => [s.title, s.artist, s.album, s.genre].some((v) => v?.toLowerCase().includes(q)))
  const artistRes = artists.filter((a) => a.name.toLowerCase().includes(q))

  if (!songRes.length && !artistRes.length)
    return <Empty icon={<SearchIcon size={32} />} title="No results found" text={`We couldn't find anything for “${raw}”. Try another keyword.`} />

  return (
    <>
      <div className="hero"><h1>Results for “{raw}”</h1></div>
      {artistRes.length > 0 && (
        <Section title="Artists"><div className="grid">{artistRes.map((a) => <ArtistCard key={a.name} artist={a} />)}</div></Section>
      )}
      {songRes.length > 0 && <Section title="Songs"><SongList songs={songRes} /></Section>}
    </>
  )
}
