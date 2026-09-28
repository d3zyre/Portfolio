import { useCallback, useLayoutEffect, useState, type MouseEvent } from 'react'
import type { FlowKey } from './content'
import { useChat } from './useChat'
import { Sidebar, type GroupKey } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Chat } from './components/Chat'
import { Dock } from './components/Dock'

export default function App() {
  const { turns, composer, started, run, submit, setPrompt, isBusy } = useChat()
  const [open, setOpen] = useState<Record<GroupKey, boolean>>({ projects: true, experience: true, skills: true })
  // Phones are too narrow to push the page aside, so the sidebar starts collapsed there.
  const [collapsed, setCollapsed] = useState(() => window.matchMedia('(max-width: 640px)').matches)

  // The layout hangs off a body class (padding, dock offset, sidebar slide), set before paint.
  useLayoutEffect(() => {
    document.body.classList.toggle('side-collapsed', collapsed)
  }, [collapsed])

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

      <Topbar onMenu={toggleSide} />

      <Chat turns={turns} started={started} />

      <Dock composer={composer} started={started} onSubmit={submit} />
    </>
  )
}
