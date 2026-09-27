export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="menu" id="menu" aria-label="Open sidebar" onClick={onMenu}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <div className="session">
        <span className="session__dot" aria-hidden="true"></span>
        <span className="session__name">akanksha / portfolio</span>
        <span className="session__branch">main</span>
      </div>
    </header>
  )
}
