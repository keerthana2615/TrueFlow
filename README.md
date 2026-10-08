# TuneFlow – Music Streaming Platform

React + Vite + Supabase. Discover, organize and play music.

## Run
```bash
npm install
cp .env.example .env      # then fill in your Supabase URL + anon key
npm run dev
```
Open http://localhost:5173

## Supabase setup
1. Create a project at https://supabase.com
2. SQL Editor → run `supabase/schema.sql`, then `supabase/seed.sql` (21 demo songs)
3. Project Settings → API → copy **Project URL** and **anon public key** into `.env`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Authentication → Providers → Email is enabled by default.
   For instant signup while testing, turn off "Confirm email".
5. Restart `npm run dev` after editing `.env`.

Without keys the app runs in demo mode (browsing + playback only).
Listening history is stored in the `recently_played` table for the signed-in
user. To see it, sign in and check Table Editor → `recently_played`; the
`songs` table is the catalogue, not playback history. If a play cannot be
saved, the app displays the Supabase error.

## Structure
```
src/lib/supabase.js            Supabase client (env vars)
src/context/                   AuthContext, DataContext, PlayerContext
src/components/                Navbar, Sidebar, MusicCard, SongList, MusicPlayer,
                               SearchBar, PlaylistCard, ArtistCard, FavButton, ...
src/pages/                     Home, Discover, Search, Library, Playlists,
                               Favorites, Login, Signup
supabase/schema.sql, seed.sql  Tables, RLS policies, signup trigger, demo songs
```
Audio: royalty-free SoundHelix demo tracks. Covers: picsum.photos placeholders.
