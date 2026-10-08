import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MusicIcon } from '../components/Icons'

export default function Signup() {
  const { signUp, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setInfo('')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setBusy(true)
    const { data, error: err } = await signUp(name.trim(), email.trim(), password)
    setBusy(false)
    if (err) return setError(err.message)
    if (data?.session) navigate('/')
    else setInfo('Account created! Check your email to confirm it, then log in.')
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand-logo big"><MusicIcon size={28} /></div>
        <h1>Create your account</h1>
        <p className="muted">Save favorites, build playlists and get recommendations</p>
        {!isConfigured && <div className="alert warn">Supabase keys are missing. Copy .env.example to .env and add your keys.</div>}
        {error && <div className="alert error">{error}</div>}
        {info && <div className="alert ok">{info}</div>}
        <label>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
        <label>Password<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" /></label>
        <button className="btn primary full" disabled={busy}>{busy ? 'Creating account...' : 'Sign up'}</button>
        <p className="muted center">Already have an account? <Link to="/login">Log in</Link></p>
        <p className="muted center"><Link to="/">Continue browsing</Link></p>
      </form>
    </div>
  )
}
