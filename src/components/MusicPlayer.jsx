import { usePlayer } from '../context/PlayerContext'
import FavButton from './FavButton'
import { fmt } from './UI'
import { PlayIcon, PauseIcon, PrevIcon, NextIcon, VolumeIcon, MuteIcon, MusicIcon } from './Icons'

export default function MusicPlayer() {
  const { current, playing, time, duration, volume, muted, audioError,
    toggle, next, prev, seek, setVolume, toggleMute } = usePlayer()
  const pct = duration ? (time / duration) * 100 : 0
  const vol = muted ? 0 : volume

  return (
    <footer className="player">
      <div className="p-info">
        {current ? <img src={current.cover_url} alt={current.title} /> : <div className="p-ph"><MusicIcon /></div>}
        <div className="p-text">
          <strong>{current ? current.title : 'Nothing playing'}</strong>
          <span>{audioError || (current ? current.artist : 'Pick a song to start listening')}</span>
        </div>
        {current && <FavButton song={current} />}
      </div>

      <div className="p-center">
        <div className="p-btns">
          <button className="icon-btn" onClick={prev} disabled={!current} aria-label="Previous"><PrevIcon /></button>
          <button className="play-main" onClick={toggle} disabled={!current} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>
          <button className="icon-btn" onClick={next} disabled={!current} aria-label="Next"><NextIcon /></button>
        </div>
        <div className="p-bar">
          <span>{fmt(time)}</span>
          <input type="range" className="range" min="0" max={duration || 0} step="0.1" value={Math.min(time, duration || 0)}
            style={{ '--pct': pct + '%' }} disabled={!current} aria-label="Seek"
            onChange={(e) => seek(Number(e.target.value))} />
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <div className="p-vol">
        <button className="icon-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
          {muted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
        </button>
        <input type="range" className="range" min="0" max="1" step="0.01" value={vol}
             style={{ '--pct': vol * 100 + '%' }} aria-label="Volume"
          onChange={(e) => setVolume(Number(e.target.value))} />
      </div>
    </footer>
  )
}
