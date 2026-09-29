import { useLayoutEffect, useRef } from 'react'
import { RESUME_KEY } from '../shared/resume'

/** Ties a case study page back to the portfolio chat it was opened from. */
export function CaseStudyBar({ slug }: { slug: string }) {
  const bar = useRef<HTMLElement | null>(null)

  // Span the whole window even when the page gives <body> side padding (ChemAR does).
  useLayoutEffect(() => {
    const el = bar.current
    if (!el) return
    const body = getComputedStyle(document.body)
    el.style.marginLeft = `-${body.paddingLeft}`
    el.style.marginRight = `-${body.paddingRight}`
  }, [])

  // Ask the portfolio to put the conversation back rather than start a new one.
  const backToChat = () => {
    try { sessionStorage.setItem(RESUME_KEY, '1') } catch { /* storage blocked: the chat starts fresh */ }
  }

  return (
    <header className="csbar" ref={bar}>
      <a className="csbar__back" href="/" onClick={backToChat}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
        Back to chat
      </a>
      <span className="csbar__crumb">
        <span className="csbar__dot" aria-hidden="true"></span>
        projects /&nbsp;<b>{slug}</b>
      </span>
    </header>
  )
}
