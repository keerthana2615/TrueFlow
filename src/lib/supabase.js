import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// True only when both environment variables are present.
export const isConfigured = Boolean(url && key)

// `null` when not configured, so the app can still run in demo mode.
export const supabase = isConfigured ? createClient(url, key) : null
