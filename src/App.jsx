import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useData } from './context/DataContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import MusicPlayer from './components/MusicPlayer'
import { Spinner } from './components/UI'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Search from './pages/Search'
import Library from './pages/Library'
import Playlists from './pages/Playlists'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Signup from './pages/Signup'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { pathname } = useLocation()
  const { user, isConfigured } = useAuth()
  const { error, clearError } = useData()

  if (pathname === '/login' || pathname === '/signup') {
    return user ? <Navigate to="/" replace /> : (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    )
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content">
          {!isConfigured && (
            <div className="alert warn">Demo mode: Supabase is not configured, so login and saving are disabled. Add your keys to .env.</div>
          )}
          {error && <div className="alert error" onClick={clearError} title="Click to dismiss">{error}</div>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Protected><Library /></Protected>} />
            <Route path="/playlists" element={<Protected><Playlists /></Protected>} />
            <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <MusicPlayer />
    </div>
  )
}
