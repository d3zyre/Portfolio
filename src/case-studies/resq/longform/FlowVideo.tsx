import { useEffect, useRef } from 'react'

/**
 * A screen-flow clip built by tools/make-flow-video.mjs from a Figma prototype.
 *
 * Nothing downloads until the clip is near the viewport (preload="none" plus the
 * poster), and it only plays while at least a third of it is visible — the same
 * behaviour as the two recordings on niklas.space, without the 5 MB files.
 */
export function FlowVideo({
  name, width, height, label, className = '',
}: {
  /** Basename under /resq/lf/video — e.g. "voice-request". */
  name: string
  width: number
  height: number
  /** What the clip shows, for screen readers. */
  label: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // reduced motion: leave it on the poster, which is the flow's first screen
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.33 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className={className}
      width={width}
      height={height}
      poster={`/resq/lf/video/${name}-poster.webp`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      <source src={`/resq/lf/video/${name}.mp4`} type="video/mp4" />
      <source src={`/resq/lf/video/${name}.webm`} type="video/webm" />
    </video>
  )
}
