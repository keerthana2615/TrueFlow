import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'
import { LogoutIcon, MusicIcon } from './Icons'

export default function Navbar() {
  const { user, name, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const q = pathname === '/search' ? params.get('q') || '' : ''

  const onSearch = (v) => {
    if (v) navigate(`/search?q=${encodeURIComponent(v)}`, { replace: pathname === '/search' })
    else navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand-mobile"><MusicIcon size={22} /> TuneFlow</Link>
      <SearchBar value={q} onChange={onSearch} />
      <div className="profile">
        {user ? (
          <>
            <div className="avatar" title={user.email}>{name.charAt(0).toUpperCase()}</div>
            <span className="profile-name">{name}</span>
            <button className="btn ghost small" onClick={async () => { await signOut(); navigate('/') }}>
              <LogoutIcon size={16} /> <span className="hide-sm">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost small">Log in</Link>
            <Link to="/signup" className="btn primary small">Sign up</Link>
          </>
        )}
      </div>
    </header>
  )
}
