import { useEffect, useRef } from 'react'
import { experience, flows, projects, ROLES } from '../content'
import type { Turn } from '../useChat'
import { Rotator } from './Rotator'
import { Thumb } from './Thumb'

function ProjectCards() {
  return (
    <div className="cards msg">
      {projects.map((p) => (
        <a key={p.key} className="card" href={p.href} target="_blank" rel="noopener">
          <Thumb src={p.img} />
          <span className="card__top"><span>{p.tag}</span></span>
          <span className="card__title">{p.title}</span>
          <span className="card__sub">{p.desc}</span>
          <span className="card__meta">{p.meta.map((m) => <span key={m}>{m}</span>)}</span>
          <span className="card__open">Open ↗</span>
        </a>
      ))}
    </div>
  )
}

function Experience() {
  return (
    <div className="exp msg">
      {experience.map((x) => (
        <div key={x.company} className="exp__item">
          <div className="exp__head">
            <span className="exp__company">{x.company}</span>
            <span className="exp__role">{x.role}</span>
          </div>
          <div className="exp__when">{x.when}</div>
          <ul className="exp__points">{x.points.map((t) => <li key={t}>{t}</li>)}</ul>
          {x.href !== '#' && (
            <a className="exp__link" href={x.href} target="_blank" rel="noopener">{`Visit ${x.company} ↗`}</a>
          )}
        </div>
      ))}
    </div>
  )
}

function TurnView({ turn }: { turn: Turn }) {
  const f = flows[turn.key]
  const question = useRef<HTMLDivElement | null>(null)

  // Pin each new question near the top of the viewport as it's asked.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      question.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      <div className="msg msg--user" ref={question}>{f.prompt}</div>
      <div className="msg msg--ai">
        <div className="steps">
          {f.steps.slice(0, turn.shown).map(([verb, target, meta], i) => (
            <div key={i} className={'step' + (i < turn.done ? ' is-done' : '')}>
              <span className="step__dot"></span><span className="step__verb">{verb}</span>{' ' + target}<span className="step__meta">{meta}</span>
            </div>
          ))}
        </div>
        {turn.answered && (
          <>
            {([] as string[]).concat(f.text).map((t) => <p key={t} className="answer msg">{t}</p>)}
            {f.render === 'projects' && <ProjectCards />}
            {f.render === 'experience' && <Experience />}
          </>
        )}
      </div>
    </>
  )
}

export function Chat({ turns, started }: { turns: Turn[]; started: boolean }) {
  return (
    <main className={'chat' + (started ? ' is-active' : '')} id="chat">

      <section className="intro" id="intro">
        <p className="intro__kicker">AI-first <Rotator words={ROLES} /><span className="type-caret" aria-hidden="true"></span> designer</p>
        <h1 className="intro__title">Designer, with a terminal open.</h1>
      </section>

      <div className="thread" id="thread" aria-live="polite">
        {turns.map((t) => <TurnView key={t.id} turn={t} />)}
      </div>

    </main>
  )
}
