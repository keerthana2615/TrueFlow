import { SearchIcon, CloseIcon } from './Icons'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar">
      <SearchIcon size={18} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search songs, artists, albums..."
        aria-label="Search"
      />
      {value && (
        <button className="icon-btn" onClick={() => onChange('')} aria-label="Clear search">
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  )
}
