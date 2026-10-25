import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import type { FlowKey } from './content'
import { useChat } from './useChat'
import { saveChat, type SavedChat } from './savedChat'
import { Sidebar, type GroupKey } from './components/Sidebar'
import { Topbar, type Theme } from './components/Topbar'
import { Chat } from './components/Chat'
import { Dock } from './components/Dock'
import { Buddy } from './components/Buddy'

export default function App({ saved }: { saved: SavedChat | null }) {
  const { turns, composer, draft, setDraft, started, run, submit, setPrompt, isBusy, snapshot } = useChat(saved)
  const [open, setOpen] = useState<Record<GroupKey, boolean>>(saved?.open ?? { projects: true, experience: true, skills: true })
  // The sidebar starts collapsed on every screen; the menu button opens it.
  const [collapsed, setCollapsed] = useState(true)

  // The layout hangs off a body class (padding, dock offset, sidebar slide), set before paint.
  useLayoutEffect(() => {
    document.body.classList.toggle('side-collapsed', collapsed)
  }, [collapsed])

  // Coming back to a saved chat: land where the visitor left off.
  useLayoutEffect(() => {
    if (saved) window.scrollTo(0, saved.scrollY)
  }, [saved])

  // Save the chat whenever the page is left, so "Back to chat" can bring it back.
  const openRef = useRef(open)
  useEffect(() => { openRef.current = open }, [open])
  useEffect(() => {
    const save = () => saveChat({ ...snapshot(), open: openRef.current, scrollY: window.scrollY })
    window.addEventListener('pagehide', save)
    return () => window.removeEventListener('pagehide', save)
  }, [snapshot])

  // Light by default. Choosing dark is remembered in this browser (index.html
  // applies it before first paint, so there's no flash).
  const [theme, setTheme] = useState<Theme>(() => {
    try { return localStorage.getItem('theme-choice') === 'dark' ? 'dark' : 'light' } catch { return 'light' }
  })
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const toggleTheme = useCallback(() => setTheme((t) => {
    const next = t === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem('theme-choice', next) } catch { /* storage blocked: the choice lasts this visit */ }
    return next
  }), [])

  // Clicking d3zyre puts the cursor in the chat box, ready for a question.
  const focusChat = useCallback(() => {
    document.getElementById('composer-text')?.focus()
  }, [])

  const toggleSide = useCallback(() => setCollapsed((c) => !c), [])
  const toggleGroup = useCallback((g: GroupKey) => setOpen((o) => ({ ...o, [g]: !o[g] })), [])

  const onFlow = useCallback((e: MouseEvent, flow: FlowKey, group?: GroupKey) => {
    e.preventDefault()
    if (isBusy()) return
    if (group) setOpen((o) => (o[group] ? o : { ...o, [group]: true }))
    setPrompt(flow)
    run(flow)
  }, [isBusy, setPrompt, run])

  return (
    <>
      <div className="grid" aria-hidden="true"></div>

      <Sidebar open={open} onToggleGroup={toggleGroup} onFlow={onFlow} />
      <div className="scrim" id="scrim" onClick={toggleSide}></div>

      <Topbar onMenu={toggleSide} theme={theme} onTheme={toggleTheme} />

      <Chat turns={turns} started={started} />

      <Buddy onClick={focusChat} />

      <Dock composer={composer} started={started} draft={draft} onDraft={setDraft} onSubmit={submit} />
    </>
  )
}
