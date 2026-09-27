import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type RefObject } from 'react'

const MEDIA = '/chem-ar'

/**
 * Keeps the sliding pill under whichever section is in view, and scrolls the
 * nav track sideways so the active link stays visible on narrow screens.
 */
function useSectionNav(trackRef: RefObject<HTMLDivElement | null>, pillRef: RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const track = trackRef.current
    const pill = pillRef.current
    if (!track || !pill) return
    const links = Array.from(track.querySelectorAll('a'))

    const place = (a: HTMLAnchorElement | null) => {
      if (!a) return
      pill.style.width = a.offsetWidth + 'px'
      pill.style.transform = 'translateX(' + a.offsetLeft + 'px)'
      links.forEach((l) => l.setAttribute('aria-current', l === a ? 'true' : 'false'))
      const tl = track.scrollLeft
      const w = track.clientWidth
      if (a.offsetLeft < tl || a.offsetLeft + a.offsetWidth > tl + w) {
        track.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' })
      }
    }

    const secs = Array.from(document.querySelectorAll<HTMLElement>('[data-sec]'))
    const spy = () => {
      const y = window.innerHeight * 0.35
      let cur = secs[0]
      secs.forEach((s) => { if (s.getBoundingClientRect().top <= y) cur = s })
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = secs[secs.length - 1]
      place(track.querySelector<HTMLAnchorElement>('a[href="#' + cur.id + '"]'))
    }

    const details = Array.from(document.querySelectorAll('details'))
    window.addEventListener('scroll', spy, { passive: true })
    window.addEventListener('resize', spy)
    details.forEach((d) => d.addEventListener('toggle', spy))
    let alive = true
    document.fonts?.ready.then(() => { if (alive) spy() })
    spy()

    return () => {
      alive = false
      window.removeEventListener('scroll', spy)
      window.removeEventListener('resize', spy)
      details.forEach((d) => d.removeEventListener('toggle', spy))
    }
  }, [trackRef, pillRef])
}

/** The soft highlight on glass cards follows the pointer. */
function useGlassHighlight() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const g = (e.target as Element | null)?.closest?.<HTMLElement>('.glass')
      if (!g) return
      const r = g.getBoundingClientRect()
      g.style.setProperty('--mx', e.clientX - r.left + 'px')
      g.style.setProperty('--my', e.clientY - r.top + 'px')
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}

/** The page was static HTML, so deep links (/chem-ar#research) landed on their section. Keep that. */
function useInitialHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])
}

/**
 * React sets `muted` as a property only. Mirror it as the attribute so browsers
 * that check the attribute before autoplaying (iOS Safari) still start the clip.
 */
function mutedAutoplay(video: HTMLVideoElement | null) {
  if (video) video.setAttribute('muted', '')
}

function Chev() {
  return (
    <span className="chev" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
  )
}

export default function ChemAR() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const pillRef = useRef<HTMLSpanElement | null>(null)
  const lbRef = useRef<HTMLDialogElement | null>(null)
  const lbImgRef = useRef<HTMLImageElement | null>(null)

  useSectionNav(trackRef, pillRef)
  useGlassHighlight()
  useInitialHash()

  const openZoom = (img: HTMLImageElement) => {
    const lb = lbRef.current
    const lbImg = lbImgRef.current
    if (!lb || !lbImg) return
    lbImg.src = img.src
    lbImg.alt = img.alt
    try { lb.showModal() } catch { /* already open */ }
  }
  /** Spread onto every image that opens in the lightbox. */
  const zoom = {
    className: 'zoom',
    tabIndex: 0,
    onClick: (e: MouseEvent<HTMLImageElement>) => openZoom(e.currentTarget),
    onKeyDown: (e: KeyboardEvent<HTMLImageElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openZoom(e.currentTarget)
      }
    },
  }

  return (
    <>
      <div className="blobs" aria-hidden="true"><i></i><i></i><i></i></div>

      <div className="wrap">
        <nav className="nav" aria-label="Sections">
          <div className="nav-box">
            <div className="nav-track" id="navTrack" ref={trackRef}>
              <span className="nav-pill" id="navPill" aria-hidden="true" ref={pillRef}></span>
              <a href="#brief">Brief</a>
              <a href="#process">Process</a>
              <a href="#tools">Tools</a>
              <a href="#making">Making Chem AR</a>
              <a href="#workflow">Workflow</a>
              <a href="#research">Research</a>
            </div>
          </div>
        </nav>

        {/* BRIEF */}
        <header className="hero" id="brief" data-sec="">
          <div className="col hero-copy">
            <h1 className="q">Can AI help <span className="k">non&#8209;technical educators</span> create <span className="k">interactive learning material</span>?</h1>
            <p className="body">That question shaped every decision in this project, from tooling to deployment.</p>
            <p className="tags">AI-Assisted Workflow<i></i>Accepted for publication — Springer Nature</p>
          </div>
          <p className="col context glass"><span className="k">Context.</span> NEP 2020 recommends adopting interactive learning for Industry 4.0. However, <span className="k">technical barriers</span> prevent many educators from creating this learning material themselves.</p>
        </header>

        {/* PROCESS */}
        <section id="process" data-sec="">
          <div className="sec-head col"><h2>Process</h2></div>
          <div className="steps glass">
            <article className="step">
              <span className="label acc">01</span>
              <h3>Understand</h3>
              <ul>
                <li>Explored <span className="k">interaction methods</span> (AR / VR)</li>
                <li>Studied constraints such as <span className="k">school computer infrastructure</span> (Intel i3 machines with no dedicated GPUs)</li>
                <li>Evaluated availability of <span className="k">Head Mounted Displays</span> (HMDs)</li>
              </ul>
            </article>
            <article className="step">
              <span className="label acc">02</span>
              <h3>Ideate</h3>
              <ul>
                <li>Learned <span className="k">Unity</span></li>
                <li>Implemented <span className="k">color tracking</span></li>
                <li>Explored object tracking with <span className="k">MediaPipe Hands</span></li>
                <li>Evaluated <span className="k">deployment methods</span></li>
              </ul>
            </article>
            <article className="step">
              <span className="label acc">03</span>
              <h3>Prototype</h3>
              <ul>
                <li>Designed <span className="k">interactions</span> for a proof of concept</li>
                <li>Built Chem AR <span className="k">using AI</span></li>
              </ul>
            </article>
            <article className="step">
              <span className="label acc">04</span>
              <h3>Synthesis</h3>
              <ul>
                <li>Compiled a <span className="k">repeatable workflow</span></li>
                <li>Documented all findings in a <span className="k">Research Paper</span></li>
              </ul>
            </article>
          </div>
        </section>

        {/* TOOLS */}
        <section id="tools" data-sec="">
          <div className="sec-head col"><h2>Learning the Tools</h2></div>
          <div className="flow">
            <details className="fold glass col">
              <summary><span className="fold-t"><span className="fold-lede"><span className="k">Marker-based AR</span> turned out to be the most reliable starting point.</span><span className="fold-hint"><span className="h-short">How?</span><span className="h-long">How I got there</span></span></span><Chev /></summary>
              <div className="fold-body">
                <p className="body col">I initially followed freeCodeCamp's AR tutorial for Unity and explored different types of AR before landing on <span className="k">physical markers</span>.</p>
                <div className="pair">
                  <figure className="media glass"><img {...zoom} src={`${MEDIA}/img1.webp`} width="1600" height="1034" alt="Unity AR tutorial exploration screen 1" /></figure>
                  <figure className="media glass"><img {...zoom} src={`${MEDIA}/img2.webp`} width="1600" height="1034" alt="Unity AR tutorial exploration screen 2" /></figure>
                </div>
              </div>
            </details>

            <p className="body col">In about a week, I created and tested a small <span className="k">Piano Tiles game</span> using color tracking with a <span className="k">Rubik's Cube</span> acting as the physical marker.</p>
            <div className="split">
              <figure className="media glass">
                <video ref={mutedAutoplay} src={`${MEDIA}/video1.mp4`} poster={`${MEDIA}/video1-poster.webp`} width="960" height="712" controls muted loop playsInline autoPlay preload="metadata"></video>
                <figcaption>Piano Tiles demo — tapping tiles is detected via color tracking on a physical Rubik's Cube marker.</figcaption>
              </figure>
              <div className="insight glass">
                <span className="label acc">Insights</span>
                <ul>
                  <li><span className="sign p" aria-label="Strength">+</span><span>Can be deployed <span className="k">completely offline</span>.</span></li>
                  <li><span className="sign p" aria-label="Strength">+</span><span>Supports simple <span className="k">tap-based interactions</span> through collision detection.</span></li>
                  <li><span className="sign m" aria-label="Limitation">−</span><span>Even with AI-generated code, Unity and game engines are generally <span className="k">difficult for non-technical users</span> to learn.</span></li>
                </ul>
              </div>
            </div>
            <p className="body col">After this, I explored <span className="k">MediaPipe Hands</span>, which enables richer object tracking and more advanced interactions.</p>
          </div>
        </section>

        {/* MAKING */}
        <section id="making" data-sec="">
          <div className="sec-head col"><h2>The Making of Chem AR</h2></div>
          <div className="flow">
            <details className="fold glass col">
              <summary><span className="fold-t"><span className="fold-lede">Chem AR is an <span className="k">exploratory virtual lab</span> built around a chemistry topic students commonly struggle with.</span><span className="fold-hint"><span className="h-short">Interactions</span><span className="h-long">The pinch-and-drag interaction guide</span></span></span><Chev /></summary>
              <div className="fold-body">
                <figure className="media glass plate"><img {...zoom} src={`${MEDIA}/Interaction.webp`} width="1600" height="814" alt="Pinch-and-drag interaction guide for building molecules in Chem AR" /></figure>
              </div>
            </details>
            <p className="body col">Learners interact with <span className="k">C, H, and O</span> to create carbon chains, intermediates, cyclic structures, and single, double and triple bonds. I also designed a <span className="k">pinch-and-drag interaction guide</span> for the AI to follow.</p>

            <p className="body col">The application was deployed on the web using <span className="k">Vercel</span>.</p>
            <div className="split">
              <figure className="media glass">
                <video ref={mutedAutoplay} src={`${MEDIA}/video2.mp4`} poster={`${MEDIA}/video2-poster.webp`} width="1440" height="810" controls muted loop playsInline autoPlay preload="metadata"></video>
                <figcaption>Live in the browser — pinching spawns atoms; dragging two adjacent atoms together forms a bond.</figcaption>
              </figure>
              <a className="cta" href="https://organic-chem-ar.vercel.app/" target="_blank" rel="noopener">Try it out yourself
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              <div className="side">
                <div className="insight glass">
                  <span className="label acc">Insights</span>
                  <ul>
                    <li><span className="sign p" aria-label="Strength">+</span><span>Technically <span className="k">easier than Unity</span>.</span></li>
                    <li><span className="sign p" aria-label="Strength">+</span><span>Web deployment is quick. Updates <span className="k">do not require reinstalling</span> the application.</span></li>
                    <li><span className="sign m" aria-label="Limitation">−</span><span>Requires a <span className="k">stable internet connection</span>.</span></li>
                    <li><span className="sign m" aria-label="Limitation">−</span><span>WebGL <span className="k">cannot fully utilize the device GPU</span>.</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" data-sec="">
          <div className="sec-head col"><h2>Workflow</h2></div>
          <div className="flow">
            <p className="lede col">All findings were compiled into a <span className="k">repeatable, reproducible workflow</span> that enables non-technical educators to build similar learning experiences from start to finish.</p>
            <figure className="media bare glass plate"><img {...zoom} src={`${MEDIA}/image10.webp`} width="1600" height="706" alt="Repeatable workflow for building AR-based learning experiences" /></figure>
          </div>
        </section>

        {/* RESEARCH */}
        <section id="research" data-sec="">
          <div className="sec-head col"><h2>Research &amp; Publication</h2></div>
          <div className="flow">
            <p className="lede col">The work was <span className="k">accepted for publication by Springer Nature</span> after being documented as a research paper and presented at the <span className="k">Research &amp; Industrial Conclave 2025, IIT Guwahati</span>.</p>
            <div className="bento">
              <figure className="media glass paper"><img {...zoom} src={`${MEDIA}/img4.webp`} width="1096" height="1592" alt="Chem AR research paper cover page" />
                <figcaption>Research Paper</figcaption>
              </figure>
              <figure className="media bare glass"><img {...zoom} src={`${MEDIA}/img6.webp`} width="1350" height="818" alt="Presenting Chem AR at the Research & Industrial Conclave 2025, IIT Guwahati" /></figure>
              <figure className="media glass"><img {...zoom} src={`${MEDIA}/img5.webp`} width="1170" height="1170" alt="Chem AR conference presentation slide" />
                <figcaption>Conference Presentation</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <div className="foot"><a className="top pill" href="#brief">Back to top <span aria-hidden="true">↑</span></a></div>
      </div>

      <dialog
        className="lb"
        id="lb"
        ref={lbRef}
        onClick={(e) => { if (e.target === lbRef.current) lbRef.current?.close() }}
      >
        <button id="lbClose" type="button" aria-label="Close" onClick={() => lbRef.current?.close()}>×</button>
        <img id="lbImg" alt="" ref={lbImgRef} />
      </dialog>
    </>
  )
}
