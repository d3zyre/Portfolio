import { useState } from 'react'

/** 16:10 thumbnail. If the image is missing, the frame keeps its gradient placeholder. */
export function Thumb({ src }: { src: string }) {
  const [missing, setMissing] = useState(false)
  return (
    <span className="thumb">{!missing && <img src={src} alt="" onError={() => setMissing(true)} />}</span>
  )
}
