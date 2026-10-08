import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MusicIcon } from '../components/Icons'

export default function Login() {
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    const { error: err } = await signIn(email.trim(), password)
    setBusy(false)
    if (err) setError(err.message)
    else navigate('/')
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand-logo big"><MusicIcon size={28} /></div>
        <h1>Welcome back</h1>
        <p className="muted">Log in to continue to TuneFlow</p>
        {!isConfigured && <div className="alert warn">Supabase keys are missing. Copy .env.example to .env and add your keys.</div>}
        {error && <div className="alert error">{error}</div>}
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
        <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" /></label>
        <button className="btn primary full" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
        <p className="muted center">New here? <Link to="/signup">Create an account</Link></p>
        <p className="muted center"><Link to="/">Continue browsing</Link></p>
      </form>
    </div>
  )
}
