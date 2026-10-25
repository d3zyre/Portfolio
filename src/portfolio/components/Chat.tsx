import { useEffect, useRef } from 'react'
import { CASE_STUDIES, experience, flows, isCaseStudy, mainProjects, minorProjects, OTHER_PROJECTS_LABEL, projectByKey, shownProjects, ROLES, suggestions, type Project, type ProjectKey } from '../content'
import type { AiTurn, ScriptTurn, Turn } from '../useChat'
import { Rotator } from './Rotator'
import { Thumb } from './Thumb'

function ProjectCard({ p, cta }: { p: Project; cta: string }) {
  return (
    <a className="card" href={p.href}>
      <Thumb src={p.img} />
      <span className="card__top"><span>{p.tag}</span></span>
      <span className="card__title">{p.title}</span>
      <span className="card__sub">{p.desc}</span>
      <span className="card__meta">{p.meta.map((m) => <span key={m}>{m}</span>)}</span>
      <span className="card__open">{cta}</span>
    </a>
  )
}

/** Project cards; each links straight to its case study. */
function ProjectCards({ list, small, wide }: { list: Project[]; small?: boolean; wide?: boolean }) {
  return (
    <div className={'cards msg' + (small ? ' cards--small' : '') + (wide ? ' cards--wide' : '')}>
      {list.map((p) => (
        <ProjectCard key={p.key} p={p} cta="Open ↗" />
      ))}
    </div>
  )
}

/** One project up front, linking to its case study, with the rest of the work underneath. */
function ProjectSummary({ project }: { project: ProjectKey }) {
  const others = shownProjects.filter((p) => p.key !== project)
  return (
    <>
      <div className="cards msg">
        <ProjectCard p={projectByKey(project)} cta="Read case study →" />
      </div>
      {others.length > 0 && (
        <div className="more msg">
          <p className="more__label">{OTHER_PROJECTS_LABEL}</p>
          <ProjectCards list={others} />
        </div>
      )}
    </>
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

function ScriptTurnView({ turn }: { turn: ScriptTurn }) {
  const f = flows[turn.key]
  const question = useRef<HTMLDivElement | null>(null)

  // Pin each new question near the top of the viewport as it's asked.
  useEffect(() => {
    if (turn.restored) return
    const frame = requestAnimationFrame(() => {
      question.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [turn.restored])

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
            {f.render === 'projects' && (
              <>
                <ProjectCards list={mainProjects} />
                {minorProjects.length > 0 && (
                  <div className="more msg">
                    <ProjectCards list={minorProjects} wide />
                  </div>
                )}
              </>
            )}
            {f.render === 'experience' && <Experience />}
            {f.render === 'project' && isCaseStudy(turn.key) && <ProjectSummary project={turn.key} />}
          </>
        )}
      </div>
    </>
  )
}

/** Pins a new question near the top of the viewport as it's asked. */
function usePinned(skip?: boolean) {
  const question = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (skip) return
    const frame = requestAnimationFrame(() => {
      question.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [skip])
  return question
}

/** A typed question, answered by the AI as it streams in. */
function AiTurnView({ turn }: { turn: AiTurn }) {
  const question = usePinned()
  const paras = turn.answer.split(/\n{2,}/).map((t) => t.trim()).filter(Boolean)
  return (
    <>
      <div className="msg msg--user" ref={question}>{turn.question}</div>
      <div className="msg msg--ai">
        <div className="steps">
          <div className={'step' + (turn.done ? ' is-done' : '')}>
            <span className="step__dot"></span><span className="step__verb">{turn.done ? 'Read' : 'Reading'}</span>{' portfolio/'}<span className="step__meta">{turn.finished ? '' : 'thinking'}</span>
          </div>
        </div>
        {paras.map((t, i) => <p key={i} className="answer msg">{t}</p>)}
      </div>
    </>
  )
}

function TurnView({ turn }: { turn: Turn }) {
  return turn.kind === 'ai' ? <AiTurnView turn={turn} /> : <ScriptTurnView turn={turn} />
}

export function Chat({ turns, started }: { turns: Turn[]; started: boolean }) {
  return (
    <main className={'chat' + (started ? ' is-active' : '')} id="chat">

      <section className="intro" id="intro">
        <p className="intro__kicker">AI-first <Rotator words={ROLES} /><span className="type-caret" aria-hidden="true"></span> designer</p>
        <h1 className="intro__title">Designer, with a terminal open.</h1>
      </section>

      {/* The selected works, front and centre until the conversation starts. */}
      <div className={'suggestions' + (started ? ' is-hidden' : '')} id="suggestions">
        {suggestions.map((s) => (
          <a key={s.title} className="sugg" href={CASE_STUDIES[s.project]}>
            <Thumb src={s.img} />
            <span className="sugg__body">
              <span className="sugg__tag">{s.tag}</span>
              <span className="sugg__title">{s.title}</span>
              <span className="sugg__sub">{s.sub}</span>
              <span className="sugg__tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="thread" id="thread" aria-live="polite">
        {turns.map((t) => <TurnView key={t.id} turn={t} />)}
      </div>

    </main>
  )
}
