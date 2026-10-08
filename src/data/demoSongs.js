// Demo catalogue: fictional artists + royalty-free SoundHelix demo audio.
// The same data is written to supabase/seed.sql (npm run seed) and is used
// as an offline fallback when Supabase is not configured.
export const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Classical', 'Kannada', 'Hindi', 'English']

const RAW = [
  ['Golden Hour', 'Aria Vale', 'Unwritten', 'Pop'],
  ['Summer Lights', 'Nova Miles', 'Neon Nights', 'Pop'],
  ['Falling Slowly', 'Luna Grey', 'Echoes', 'Pop'],
  ['Night Runner', 'The Frequency', 'Open Roads', 'Rock'],
  ['Last Train', 'Midnight Theory', 'Late Night Stories', 'Rock'],
  ['Electric Horizon', 'The Frequency', 'Digital Dreams', 'Rock'],
  ['Urban Pulse', 'Urban Echo', 'City Lights', 'Hip-Hop'],
  ['Concrete Crown', 'Urban Echo', 'City Lights', 'Hip-Hop'],
  ['Coffee & Code', 'Rohan V', 'Bangalore After Dark', 'Hip-Hop'],
  ['Rainy Window', 'Velvet Sky', 'Echoes', 'Classical'],
  ['Moonlit Sonata', 'Velvet Sky', 'Nocturne', 'Classical'],
  ['Autumn Prelude', 'Elena Marlowe', 'Seasons', 'Classical'],
  ['Male Hani', 'Rohan V', 'Bangalore After Dark', 'Kannada'],
  ['Namma Ooru', 'Kaveri Beats', 'Bangalore After Dark', 'Kannada'],
  ['Hosa Belaku', 'Kaveri Beats', 'Sunrise Raaga', 'Kannada'],
  ['Dil Ke Paas', 'Aria Vale', 'Safar', 'Hindi'],
  ['Raat Ki Baat', 'Neon Avenue', 'Midnight Signals', 'Hindi'],
  ['Mausam', 'Rohan V', 'Safar', 'Hindi'],
  ['Midnight Drive', 'Neon Avenue', 'Midnight Signals', 'English'],
  ['Neon Skies', 'Neon Avenue', 'After Dark', 'English'],
  ['City Echoes', 'Echo Lane', 'Afterglow', 'English'],
]
// Approximate lengths (seconds) of the 16 SoundHelix demo tracks.
const DUR = [372, 334, 312, 302, 355, 354, 282, 354, 295, 407, 293, 330, 312, 296, 370, 362]
const BASE = Date.UTC(2026, 5, 1)

export const DEMO_SONGS = RAW.map(([title, artist, album, genre], i) => ({
  id: '00000000-0000-4000-8000-0000000000' + String(i + 1).padStart(2, '0'),
  title,
  artist,
  album,
  genre,
  cover_url: `https://picsum.photos/seed/tuneflow-${i + 1}/400/400`,
  audio_url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
  duration: DUR[i % 16],
  created_at: new Date(BASE - i * 3 * 86400000).toISOString(),
}))
   