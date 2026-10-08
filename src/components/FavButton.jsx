import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { HeartIcon } from './Icons'

export default function FavButton({ song, size = 18 }) {
  const { user } = useAuth()
  const { favIds, toggleFavorite } = useData()
  const navigate = useNavigate()
  const on = favIds.includes(song.id)
  return (
    <button
      className={'icon-btn fav' + (on ? ' on' : '')}
      aria-label={on ? 'Remove from favorites' : 'Add to favorites'}
      title={user ? (on ? 'Remove from favorites' : 'Add to favorites') : 'Log in to save favorites'}
      onClick={(e) => { e.stopPropagation(); user ? toggleFavorite(song) : navigate('/login') }}
    >
      <HeartIcon filled={on} size={size} />
    </button>
  )
}
