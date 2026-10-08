import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isConfigured)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const notConfigured = { error: new Error('Supabase is not configured. Add your keys to .env') }
  const signIn = async (email, password) =>
    supabase ? supabase.auth.signInWithPassword({ email, password }) : notConfigured
  const signUp = async (name, email, password) =>
    supabase ? supabase.auth.signUp({ email, password, options: { data: { name } } }) : notConfigured
  const signOut = async () => { if (supabase) await supabase.auth.signOut() }

  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || ''

  return (
    <AuthContext.Provider value={{ user, name, loading, signIn, signUp, signOut, isConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}
