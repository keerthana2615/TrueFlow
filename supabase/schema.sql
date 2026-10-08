-- =====================================================
-- TuneFlow – Supabase schema (run in SQL Editor)
-- =====================================================
create extension if not exists "pgcrypto";

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  album text,
  genre text,
  cover_url text,
  audio_url text not null,
  duration integer default 0,            -- seconds
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_songs (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  added_at timestamptz not null default now(),   -- keeps songs in the order they were added
  unique (playlist_id, song_id)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, song_id)
);

create table if not exists public.recently_played (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  played_at timestamptz not null default now()
);

create index if not exists idx_songs_genre on public.songs(genre);
create index if not exists idx_playlists_user on public.playlists(user_id);
create index if not exists idx_playlist_songs_pl on public.playlist_songs(playlist_id);
create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_recent_user on public.recently_played(user_id, played_at desc);

-- ---------- Row Level Security ----------
alter table public.songs enable row level security;
alter table public.profiles enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;
alter table public.favorites enable row level security;
alter table public.recently_played enable row level security;

drop policy if exists "songs are public" on public.songs;
create policy "songs are public" on public.songs for select using (true);

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own playlists" on public.playlists;
create policy "own playlists" on public.playlists for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own playlist songs" on public.playlist_songs;
create policy "own playlist songs" on public.playlist_songs for all
  using (exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid()));

drop policy if exists "own favorites" on public.favorites;
create policy "own favorites" on public.favorites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own history" on public.recently_played;
create policy "own history" on public.recently_played for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Auto-create a profile on signup ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
