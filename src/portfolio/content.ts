/**
 * Everything the portfolio says: the projects, the experience, and the scripted
 * chat. Edit copy here; the components only lay it out.
 */

/**
 * Case study routes. Each is its own page (see vite.config.ts) and opens in a new tab.
 * The trailing slash matters: it is what resolves to <folder>/index.html in dev,
 * in preview and on Vercel.
 */
export const CASE_STUDIES = {
  resq: '/resq/',
  prescribble: '/prescribble/',
  chemar: '/chem-ar/',
} as const

export type Project = {
  key: string
  tag: string
  title: string
  href: string
  /** 16:10 thumbnail in public/assets. If the file is missing, the card shows its gradient placeholder. */
  img: string
  desc: string
  meta: string[]
}

export const projects: Project[] = [
  { key: 'resq', tag: 'Self-guided · Jul 2026', title: 'ResQ', href: CASE_STUDIES.resq, img: '/assets/thumb-resq.jpg',
    desc: 'A disaster communication platform for Assam that keeps working over a mesh network when the cell network fails. Emergency workflows, AI-assisted request routing and dashboards for coordinators and field teams, with a human making the final call.',
    meta: ['User research', 'Mesh network', 'AI ethics'] },
  { key: 'presc', tag: 'Course project · 2026', title: 'Prescribble', href: CASE_STUDIES.prescribble, img: '/assets/thumb-prescribble.jpg',
    desc: 'An iPad prescription system for busy government OPDs, where doctors keep writing by hand with Apple Scribble. Stakeholder interviews, a service blueprint of the full journey, and a working prototype deployed on Vercel to test the flow.',
    meta: ['Service blueprint', 'Healthcare', 'Deployed prototype'] },
  { key: 'chem', tag: 'Research · 2025', title: 'ChemAR', href: CASE_STUDIES.chemar, img: '/assets/thumb-chemar.jpg',
    desc: 'A workflow for building AR learning experiences with AI, without writing code. Tested by building ChemAR, where students assemble organic molecules with hand tracking. Presented at RIC, IIT Guwahati and accepted by Springer Nature.',
    meta: ['Human-AI workflow', 'AR', 'Published'] },
  { key: 'word', tag: 'Internship · 2026', title: 'Wordgate', href: '#', img: '/assets/thumb-wordgate.jpg',
    desc: 'Redesign of a strategy word game as the sole designer. Rebuilt the information architecture, replaced a hardcoded interface with a design system, and delivered 80+ high-fidelity screens.',
    meta: ['Design system', 'IA', 'Game UX'] },
]

export type Job = {
  company: string
  role: string
  when: string
  /** Company site. '#' hides the "Visit" link. */
  href: string
  points: string[]
}

export const experience: Job[] = [
  { company: 'Mobiclay Technology', role: 'UI/UX Intern', when: 'May to Aug 2026 · Remote', href: '#',
    points: [
      'Sole designer on Wordgate, a strategy word game, owning UX decisions end to end at an early-stage company.',
      'Rebuilt the information architecture around drop-offs, onboarding issues and weak game modes from a trial release.',
      'Built a design system from scratch to replace a fully hardcoded interface.',
      'Delivered 80+ high-fidelity screens across gameplay, onboarding, dashboards and system states, with 40+ more in progress.',
      'Prototyped key interactions in Figma before handoff to cut down dev rework.',
    ] },
  { company: 'Creative Banjara', role: 'Visual Design Intern', when: 'May to Jul 2025 · Noida', href: '#',
    points: [
      'Branding, packaging and presentation decks for 6+ client brands across legal, F&B, fashion and nutrition, working directly with the founder.',
      'Took projects from brand discovery to final delivery alongside the strategy, social media and 3D teams.',
      'Self-taught Illustrator in two weeks.',
    ] },
  { company: 'ArtLabs', role: 'Workshop Facilitator', when: 'Apr 2023 to May 2024 · Jamshedpur', href: '#',
    points: [
      'One of six core team members behind one of the city\'s first creative workshop studios.',
      'Researched workshop formats, planned the launch and designed a QR campaign to build early curiosity.',
      'Grew the community to 1,200+ members and ran 20+ workshops in a year, leading to free public events like nature walks and pop-up stores.',
    ] },
]

export type FlowKey = 'projects' | 'experience' | 'about'

export type Flow = {
  /** What the visitor "asks". */
  prompt: string
  /** Tool-call rows shown before the answer: [verb, target, meta]. */
  steps: [string, string, string][]
  text: string | string[]
  /** Rich block shown under the answer. */
  render: 'projects' | 'experience' | null
  /** The question queued in the composer afterwards. */
  next: FlowKey | null
}

export const flows: Record<FlowKey, Flow> = {
  projects: {
    prompt: 'What have you built?',
    steps: [['Opened', 'projects/', '4 folders']],
    text: 'Here are four. Three are my own projects, and Wordgate is from my internship.',
    render: 'projects',
    next: 'experience',
  },
  experience: {
    prompt: 'Where have you worked?',
    steps: [['Opened', 'experience/', '3 roles']],
    text: 'Three places so far.',
    render: 'experience',
    next: 'about',
  },
  about: {
    prompt: 'What are you into?',
    steps: [['Opened', 'about.md', '']],
    text: [
      'I love how humans interact with cool tech. I want to make those interactions easier and more fun, and build immersive tech that feels natural and accessible to everyone.',
      'Outside design, I lift (I made the IIT Guwahati weightlifting team through institute-wide trials), I\'m learning Japanese, and I led the design team for IITG MUN\'26. I also gave a talk on design and AI to school students in Seraikella.',
    ],
    render: null,
    next: null,
  },
}

/** Shown in the composer once every flow has run. */
export const DONE_PROMPT = 'That\'s all for now. Everything else is in the sidebar.'

/** The chips above the composer. Any of them starts the conversation. */
export const suggestions = [
  { q: 'Walk me through ResQ.', img: '/assets/thumb-resq.jpg', tag: 'Self-guided', title: 'ResQ', sub: 'Disaster comms over a mesh network' },
  { q: 'How was Prescribble tested?', img: '/assets/thumb-prescribble.jpg', tag: 'Course project', title: 'Prescribble', sub: 'Handwritten prescriptions on iPad' },
  { q: 'Show me ChemAR running.', img: '/assets/thumb-chemar.jpg', tag: 'Research', title: 'ChemAR', sub: 'AR chemistry, built with AI' },
]

/** Words the intro kicker types through. */
export const ROLES = ['product', 'interaction']
