import type { MouseEvent } from 'react'
import { CASE_STUDIES, type FlowKey } from '../content'

export type GroupKey = 'projects' | 'experience' | 'skills'

type Props = {
  open: Record<GroupKey, boolean>
  onToggleGroup: (group: GroupKey) => void
  /** A nav item that also asks its question in the chat. */
  onFlow: (e: MouseEvent, flow: FlowKey, group?: GroupKey) => void
}

const EXT = <svg className="ext" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8" /></svg>

function Chev({ onToggle }: { onToggle: () => void }) {
  return (
    <svg
      className="chev"
      viewBox="0 0 24 24"
      onClick={(e) => { e.stopPropagation(); onToggle() }}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function Sidebar({ open, onToggleGroup, onFlow }: Props) {
  const groupClass = (g: GroupKey) => 'group' + (open[g] ? ' is-open' : '')

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar__head">
        <img className="avatar" src="/assets/avatar.jpg" alt="Akanksha Gupta" />
        <div>
          <p className="sidebar__name">Akanksha Gupta</p>
          <p className="sidebar__role">B.Des @ IIT Guwahati · 2028</p>
        </div>
      </div>

      <nav className="side-nav">
        <a className="side-item is-active" href="/">
          <svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" /></svg>
          Home
        </a>

        <div className={groupClass('projects')}>
          <button
            className="side-item group__toggle"
            type="button"
            aria-expanded={open.projects}
            data-flow="projects"
            onClick={(e) => onFlow(e, 'projects', 'projects')}
          >
            <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            Projects
            <Chev onToggle={() => onToggleGroup('projects')} />
          </button>
          <div className="tree">
            <a href={CASE_STUDIES.resq} target="_blank" rel="noopener">ResQ{EXT}</a>
            <a href={CASE_STUDIES.prescribble} target="_blank" rel="noopener">Prescribble{EXT}</a>
            <a href={CASE_STUDIES.chemar} target="_blank" rel="noopener">ChemAR{EXT}</a>
          </div>
        </div>

        <div className={groupClass('experience')}>
          <button
            className="side-item group__toggle"
            type="button"
            aria-expanded={open.experience}
            data-flow="experience"
            onClick={(e) => onFlow(e, 'experience', 'experience')}
          >
            <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></svg>
            Experience
            <Chev onToggle={() => onToggleGroup('experience')} />
          </button>
          <div className="tree">
            <div className="leaf">
              <span className="leaf__line"><span className="leaf__title">Mobiclay</span><span className="leaf__role">UI/UX Intern</span></span>
              <span className="leaf__meta">May to Aug 2026</span>
            </div>
            <div className="leaf">
              <span className="leaf__line"><span className="leaf__title">Creative Banjara</span><span className="leaf__role">Visual Design Intern</span></span>
              <span className="leaf__meta">May to Jul 2025</span>
            </div>
            <div className="leaf">
              <span className="leaf__line"><span className="leaf__title">ArtLabs</span><span className="leaf__role">Workshop Facilitator</span></span>
              <span className="leaf__meta">Apr 2023 to May 2024</span>
            </div>
          </div>
        </div>

        <div className={groupClass('skills')}>
          <button
            className="side-item group__toggle"
            type="button"
            aria-expanded={open.skills}
            onClick={() => onToggleGroup('skills')}
          >
            <svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="3" /></svg>
            Skills
            <Chev onToggle={() => onToggleGroup('skills')} />
          </button>
          <div className="pills">
            <span>Systems Thinking</span><span>Info Arch</span>
            <span>Data Viz</span><span>Service Blueprints</span>
            <span>Gamification</span><span>User Research</span>
            <span>AI Prototyping</span>
          </div>
        </div>

        <a className="side-item" href="#about" data-flow="about" onClick={(e) => onFlow(e, 'about')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
          About
        </a>
      </nav>

      <a className="upgrade" href="/assets/resume.pdf" download="Akanksha_Gupta_Resume.pdf">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 20h14" /></svg>
        Download résumé
      </a>

      <div className="sidebar__foot">
        <a href="mailto:akanksha.guptaa4@gmail.com">
          <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          Email
        </a>
        <a href="https://linkedin.com/in/akanksha-gupta4" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" /></svg>
          LinkedIn
        </a>
        <a href="https://www.instagram.com/d3zyre" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5v.01" /></svg>
          Instagram
        </a>
      </div>
    </aside>
  )
}
