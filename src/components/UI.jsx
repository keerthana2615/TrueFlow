export const fmt = (sec) => {
  if (!sec || !isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export const Spinner = ({ label = 'Loading...' }) => (
  <div className="center-box"><div className="spinner" /><p>{label}</p></div>
)

export const Empty = ({ icon, title, text, children }) => (
  <div className="center-box empty">
    <div className="empty-icon">{icon}</div>
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {children}
  </div>
)

export const Section = ({ title, action, children }) => (
  <section className="section">
    <div className="section-head"><h2>{title}</h2>{action}</div>
    {children}
  </section>
)
