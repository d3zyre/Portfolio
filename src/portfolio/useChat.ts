import { useCallback, useRef, useState } from 'react'
import { DONE_PROMPT, flows, type FlowKey } from './content'

/** One question and its answer in the thread. */
export type Turn = {
  id: number
  key: FlowKey
  /** How many tool-call rows have appeared so far. */
  shown: number
  /** How many of those have turned green. */
  done: number
  /** The answer text and cards are showing. */
  answered: boolean
}

export type Composer = { text: string; empty: boolean; disabled: boolean }

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const promptFor = (key: FlowKey | null): Composer =>
  key
    ? { text: flows[key].prompt, empty: false, disabled: false }
    : { text: DONE_PROMPT, empty: true, disabled: true }

/**
 * The scripted conversation. Each run adds the question, reveals the tool-call
 * rows one by one, then the answer, and queues the next question in the composer.
 */
export function useChat() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [composer, setComposer] = useState<Composer>(() => promptFor('projects'))
  const [started, setStarted] = useState(false)
  const busy = useRef(false)
  const nextKey = useRef<FlowKey | null>('projects')
  const nextId = useRef(0)

  const setPrompt = useCallback((key: FlowKey | null) => {
    nextKey.current = key
    setComposer(promptFor(key))
  }, [])

  const run = useCallback(async (key: FlowKey) => {
    if (busy.current) return
    busy.current = true
    setStarted(true)

    const f = flows[key]
    const id = nextId.current++
    const update = (patch: (t: Turn) => Partial<Turn>) =>
      setTurns((all) => all.map((t) => (t.id === id ? { ...t, ...patch(t) } : t)))

    setTurns((all) => [...all, { id, key, shown: 0, done: 0, answered: false }])
    setComposer({ text: 'Working…', empty: true, disabled: true })

    for (let i = 0; i < f.steps.length; i++) {
      await wait(420)
      update(() => ({ shown: i + 1 }))
      setTimeout(() => update((t) => ({ done: Math.max(t.done, i + 1) })), 380)
    }

    await wait(450)
    update(() => ({ answered: true }))

    busy.current = false
    setPrompt(f.next)
  }, [setPrompt])

  const submit = useCallback(() => {
    if (nextKey.current) run(nextKey.current)
  }, [run])

  const isBusy = useCallback(() => busy.current, [])

  return { turns, composer, started, run, submit, setPrompt, isBusy }
}
