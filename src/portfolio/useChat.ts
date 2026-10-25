import { useCallback, useEffect, useRef, useState } from 'react'
import { DONE_PROMPT, flows, type FlowKey } from './content'
import { answerFor } from './answers'

/** A scripted question and its answer in the thread. */
export type ScriptTurn = {
  kind: 'script'
  id: number
  key: FlowKey
  /** How many tool-call rows have appeared so far. */
  shown: number
  /** How many of those have turned green. */
  done: number
  /** The answer text and cards are showing. */
  answered: boolean
  /** Brought back from a saved chat: shown complete, without scrolling to it. */
  restored?: boolean
}

/** A question the visitor typed, answered from the answer bank (answers.ts). */
export type AiTurn = {
  kind: 'ai'
  id: number
  question: string
  answer: string
  /** The "Read portfolio" row has turned green (the first words have arrived). */
  done: boolean
  /** The full answer has arrived. */
  finished: boolean
}

export type Turn = ScriptTurn | AiTurn

/** `text` is the placeholder: the scripted question that send runs when nothing is typed. */
export type Composer = { text: string; empty: boolean; disabled: boolean }

/** What's needed to put a conversation back the way it was. Typed questions aren't kept. */
export type ChatSnapshot = { turns: FlowKey[]; next: FlowKey | null }

/** Offered in order once the scripted tour is over. */
const FOLLOW_UPS: FlowKey[] = ['glance', 'prescribble', 'resq', 'wordgate', 'chemar']

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const promptFor = (key: FlowKey | null): Composer =>
  key
    ? { text: flows[key].prompt, empty: false, disabled: false }
    : { text: DONE_PROMPT, empty: true, disabled: false }


/**
 * The conversation. Scripted runs add the question, reveal the tool-call rows one
 * by one, then the answer, and queue the next question. Typed questions are
 * answered from the answer bank, typed out as if live.
 */
export function useChat(initial?: ChatSnapshot | null) {
  const [turns, setTurns] = useState<Turn[]>(() =>
    (initial?.turns ?? []).map((key, id) => {
      const n = flows[key].steps.length
      return { kind: 'script', id, key, shown: n, done: n, answered: true, restored: true }
    }))
  const [composer, setComposer] = useState<Composer>(() => promptFor(initial ? initial.next : 'projects'))
  const [draft, setDraft] = useState('')
  const [started, setStarted] = useState(() => (initial?.turns.length ?? 0) > 0)
  const busy = useRef(false)
  const nextKey = useRef<FlowKey | null>(initial ? initial.next : 'projects')
  const nextId = useRef(initial?.turns.length ?? 0)
  const turnsRef = useRef(turns)
  useEffect(() => { turnsRef.current = turns }, [turns])

  // When the scripted tour ends, keep offering project questions the visitor hasn't asked yet.
  const setPrompt = useCallback((key: FlowKey | null) => {
    if (key === null) {
      const seen = new Set(turnsRef.current.flatMap((t) => (t.kind === 'script' ? [t.key] : [])))
      key = FOLLOW_UPS.find((k) => !seen.has(k)) ?? null
    }
    nextKey.current = key
    setComposer(promptFor(key))
  }, [])

  /** Resolves true once the answer is showing, false if another answer was still running. */
  const run = useCallback(async (key: FlowKey): Promise<boolean> => {
    if (busy.current) return false
    busy.current = true
    setStarted(true)

    const f = flows[key]
    const id = nextId.current++
    const update = (patch: (t: ScriptTurn) => Partial<ScriptTurn>) =>
      setTurns((all) => all.map((t) => (t.id === id && t.kind === 'script' ? { ...t, ...patch(t) } : t)))

    setTurns((all) => [...all, { kind: 'script', id, key, shown: 0, done: 0, answered: false }])
    setComposer({ text: 'Working…', empty: true, disabled: true })

    for (let i = 0; i < f.steps.length; i++) {
      await wait(420)
      update(() => ({ shown: i + 1 }))
      setTimeout(() => update((t) => ({ done: Math.max(t.done, i + 1) })), 380)
    }

    await wait(450)
    update(() => ({ answered: true }))

    busy.current = false
    setPrompt(f.next === undefined ? nextKey.current : f.next)
    return true
  }, [setPrompt])

  /** Answers a typed question from the answer bank in a new turn. */
  const ask = useCallback(async (question: string): Promise<boolean> => {
    if (busy.current) return false
    busy.current = true
    setStarted(true)

    const id = nextId.current++
    const update = (patch: (t: AiTurn) => Partial<AiTurn>) =>
      setTurns((all) => all.map((t) => (t.id === id && t.kind === 'ai' ? { ...t, ...patch(t) } : t)))

    setTurns((all) => [...all, { kind: 'ai', id, question, answer: '', done: false, finished: false }])
    setDraft('')
    setComposer({ text: 'Working…', empty: true, disabled: true })

    // Read the answer bank, then type the answer out a few words at a time.
    await wait(500)
    const words = answerFor(question).split(/(\s+)/)
    update(() => ({ done: true }))
    for (let i = 0; i < words.length; i += 6) {
      const chunk = words.slice(i, i + 6).join('')
      update((t) => ({ answer: t.answer + chunk }))
      await wait(45)
    }
    update(() => ({ done: true, finished: true }))

    busy.current = false
    setPrompt(nextKey.current)
    return true
  }, [setPrompt])

  /** Send: a typed question is answered from the bank; an empty box runs the queued scripted question. */
  const submit = useCallback(() => {
    const q = draft.trim()
    if (q) ask(q)
    else if (nextKey.current) run(nextKey.current)
  }, [draft, ask, run])

  const isBusy = useCallback(() => busy.current, [])

  const snapshot = useCallback((): ChatSnapshot => ({
    turns: turnsRef.current.flatMap((t) => (t.kind === 'script' ? [t.key] : [])),
    next: nextKey.current,
  }), [])

  return { turns, composer, draft, setDraft, started, run, ask, submit, setPrompt, isBusy, snapshot }
}
