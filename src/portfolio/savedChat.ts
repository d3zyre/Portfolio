import { CHAT_STATE_KEY, RESUME_KEY } from '../shared/resume'
import { flows, type FlowKey } from './content'
import type { ChatSnapshot } from './useChat'
import type { GroupKey } from './components/Sidebar'

export type SavedChat = ChatSnapshot & {
  open: Record<GroupKey, boolean>
  scrollY: number
}

const isFlowKey = (k: unknown): k is FlowKey => typeof k === 'string' && k in flows

/**
 * The chat to put back on load, or null to start fresh. It comes back when the
 * visitor used "Back to chat" on a case study, or the browser's back button.
 * A plain visit or a reload starts a new conversation.
 */
export function readSavedChat(): SavedChat | null {
  try {
    const resume = sessionStorage.getItem(RESUME_KEY) === '1'
    sessionStorage.removeItem(RESUME_KEY)
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (!resume && nav?.type !== 'back_forward') return null

    const s = JSON.parse(sessionStorage.getItem(CHAT_STATE_KEY) || 'null')
    if (!s || !Array.isArray(s.turns) || !s.turns.every(isFlowKey)) return null
    if (s.next !== null && !isFlowKey(s.next)) return null
    const open = s.open ?? {}
    return {
      turns: s.turns,
      next: s.next,
      open: { projects: open.projects !== false, experience: open.experience !== false, skills: open.skills !== false },
      scrollY: Number(s.scrollY) || 0,
    }
  } catch {
    return null // storage blocked (private mode) or bad data: start fresh
  }
}

export function saveChat(chat: SavedChat) {
  try {
    sessionStorage.setItem(CHAT_STATE_KEY, JSON.stringify(chat))
  } catch { /* storage blocked: nothing to restore later */ }
}
