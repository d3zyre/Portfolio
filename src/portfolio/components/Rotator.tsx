import { useEffect, useState } from 'react'

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/** Deletes the current word, then types the next one, forever. Holds still under reduced motion. */
export function Rotator({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let stopped = false

    const loop = async () => {
      let w = 0
      while (!stopped) {
        await wait(2200)
        const cur = words[w]
        for (let i = cur.length; i >= 0; i--) {
          if (stopped) return
          setText(cur.slice(0, i))
          await wait(55)
        }
        w = (w + 1) % words.length
        const nxt = words[w]
        await wait(250)
        for (let k = 1; k <= nxt.length; k++) {
          if (stopped) return
          setText(nxt.slice(0, k))
          await wait(90)
        }
      }
    }
    loop()
    return () => { stopped = true }
  }, [words])

  return <span className="rotator" id="rotator" data-words={words.join(',')}>{text}</span>
}
