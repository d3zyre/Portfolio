import { Stage, At } from '../Stage'
import { Display, Card } from '../Bits'
import type { ReactNode } from 'react'

type Voice = {
  x: number
  avatar: string
  quote: ReactNode
  /** English gloss — the second card's quote is already in English, so it has none. */
  gloss?: string
  need: string[]
}

const VOICES: Voice[] = [
  {
    x: 80,
    avatar: '/resq/lf/avatar-1.png',
    quote: <>phone haath mein tha, but <b>itna panic</b> tha ki kya likhu wohi samajh nahi aa raha tha</>,
    gloss: 'The phone was in my hand, but I was so panicked I couldn’t work out what to write.',
    need: ['Ask for help without typing', 'Work when words won’t come'],
  },
  {
    x: 500,
    avatar: '/resq/lf/avatar-2.png',
    quote: <>i didn&rsquo;t need another news update. <b>i needed to know where i should go.</b></>,
    need: ['Where to go, not just news', 'Shelter and aid, kept current'],
  },
  {
    x: 920,
    avatar: '/resq/lf/avatar-3.png',
    quote: <>ami help koribo bisarisilu <b>kintu kaak ki dorkar hoise bujiye pua nasilu.</b></>,
    gloss: 'We were willing to help people, but nobody knew who needed what.',
    need: ['Match helpers to real needs', 'Show who nearby needs what'],
  },
]

export function B7Voices() {
  return (
    <Stage h={880} id="voices">
      <Display y={80} w={688}>
        <b>Three people</b>,<br />three different <b>problems</b>
      </Display>

      {VOICES.map((v) => (
        <Card key={v.x} x={v.x} y={320} w={380} h={480}>
          <At x={36} y={40} w={308}>
            <img
              src={v.avatar}
              alt=""
              className="h-[34px] w-[34px] rounded-full object-cover"
            />
            <blockquote className="mt-[18px] font-display text-[23px] leading-[34px] text-mid [&_b]:font-normal [&_b]:text-ink">
              {v.quote}
            </blockquote>
            {v.gloss && (
              <p className="mt-[18px] font-body text-[14px] leading-[22px] text-grey">{v.gloss}</p>
            )}
          </At>

          <At x={36} y={344} w={308} h={1} className="bg-line" />
          <At x={36} y={370} w={300}>
            <ul className="space-y-2">
              {v.need.map((n) => (
                <li key={n} className="flex gap-2.5 font-body text-[17px] leading-[26px] font-medium text-red/95">
                  <span aria-hidden>→</span>{n}
                </li>
              ))}
            </ul>
          </At>
        </Card>
      ))}
    </Stage>
  )
}
