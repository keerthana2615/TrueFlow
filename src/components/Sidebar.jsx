import { NavLink, Link } from 'react-router-dom'
import { HomeIcon, CompassIcon, LibraryIcon, ListIcon, HeartIcon, MusicIcon } from './Icons'

const links = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/discover', label: 'Discover', icon: CompassIcon },
  { to: '/library', label: 'Library', icon: LibraryIcon },
  { to: '/playlists', label: 'Playlists', icon: ListIcon },
  { to: '/favorites', label: 'Favorites', icon: HeartIcon },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="brand"><span className="brand-logo"><MusicIcon size={20} /></span> TuneFlow</Link>
      <nav>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            <Icon size={20} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <p className="side-note">Discover • Organize • Play</p>
    </aside>
  )
}
