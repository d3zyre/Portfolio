/**
 * Everything the portfolio says: the projects, the experience, and the scripted
 * chat. Edit copy here; the components only lay it out.
 */

/**
 * Case study routes. Each is its own page (see vite.config.ts), opened in the same tab.
 * The trailing slash matters: it is what resolves to <folder>/index.html in dev,
 * in preview and on Vercel.
 */
export const CASE_STUDIES = {
  resq: '/resq/',
  prescribble: '/prescribble/',
  chemar: '/chem-ar/',
} as const

/** A project with a case study. Selecting one opens its summary in the chat. */
export type ProjectKey = keyof typeof CASE_STUDIES

export type Project = {
  key: ProjectKey | 'wordgate'
  tag: string
  title: string
  href: string
  /** 16:10 thumbnail in public/assets. If the file is missing, the card shows its gradient placeholder. */
  img: string
  desc: string
  meta: string[]
  /** Kept here but left out of the projects answer. */
  hidden?: boolean
}

export const projects: Project[] = [
  { key: 'resq', tag: 'Mobile App · Jul 2026', title: 'ResQ', href: CASE_STUDIES.resq, img: '/assets/thumb-resq.jpg',
    desc: 'A disaster communication platform for Assam that keeps working over a mesh network when the cell network fails. Emergency workflows, AI-assisted request routing and dashboards for coordinators and field teams, with a human making the final call.',
    meta: ['User research', 'Mesh network', 'AI ethics'] },
  { key: 'prescribble', tag: 'iPad App · 2026', title: 'Prescribble', href: CASE_STUDIES.prescribble, img: '/assets/thumb-prescribble.jpg',
    desc: 'An iPad prescription system for busy government OPDs, where doctors keep writing by hand with Apple Scribble. Stakeholder interviews, a service blueprint of the full journey, and a working prototype deployed on Vercel to test the flow.',
    meta: ['Service blueprint', 'Healthcare', 'Deployed prototype'] },
  { key: 'chemar', tag: 'Research project · 2025', title: 'ChemAR', href: CASE_STUDIES.chemar, img: '/assets/thumb-chemar.jpg',
    desc: 'A workflow for building AR learning experiences with AI, without writing code. Tested by building ChemAR, where students assemble organic molecules with hand tracking. Presented at RIC, IIT Guwahati and accepted by Springer Nature.',
    meta: ['Human-AI workflow', 'AR', 'Published'] },
  { key: 'wordgate', tag: 'Internship · 2026', title: 'Wordgate', href: '#', img: '/assets/thumb-wordgate.jpg', hidden: true,
    desc: 'Redesign of a strategy word game as the sole designer. Rebuilt the information architecture, replaced a hardcoded interface with a design system, and delivered 80+ high-fidelity screens.',
    meta: ['Design system', 'IA', 'Game UX'] },
]

/** The projects the chat shows. */
export const shownProjects = projects.filter((p) => !p.hidden)

export const projectByKey = (key: ProjectKey) => projects.find((p) => p.key === key)!

/** Narrows a project to one that has a case study (and so a summary to open). */
export const isCaseStudy = (key: string): key is ProjectKey => key in CASE_STUDIES

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
      'Sole designer for Wordgate, a strategy word game at an early-stage startup; owned end-to-end UX decisions.',
      'Rebuilt the information architecture around drop-offs and onboarding issues from a trial release, reducing steps and clicks across core flows.',
      'Ran continuous user testing and A/B tests on competing flows, adopting the most intuitive one for a clearer user journey.',
      'Built a scalable design system from scratch with clearer component grouping, replacing a fully hardcoded interface.',
      'Delivered 120+ high-fidelity screens across gameplay, onboarding, dashboards and system states (loading, error, modal, transition).',
      'Prototyped key component interactions in Figma to validate behaviour before developer handoff, reducing dev rework.',
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

export type FlowKey = 'projects' | 'experience' | 'about' | ProjectKey

export type Flow = {
  /** What the visitor "asks". */
  prompt: string
  /** Tool-call rows shown before the answer: [verb, target, meta]. */
  steps: [string, string, string][]
  text: string | string[]
  /** Rich block shown under the answer. 'project' is one project's summary card plus the others. */
  render: 'projects' | 'experience' | 'project' | null
  /** The question queued in the composer afterwards. Left out, whatever was queued stays queued. */
  next?: FlowKey | null
}

export const flows: Record<FlowKey, Flow> = {
  projects: {
    prompt: 'What have you built?',
    steps: [['Opened', 'projects/', `${shownProjects.length} folders`]],
    // With Wordgate shown: 'Here are four. Three are my own projects, and Wordgate is from my internship.'
    text: 'Here are three, all my own projects.',
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

  // One project's summary, opened by selecting it anywhere on the page.
  resq: {
    prompt: 'Walk me through ResQ.',
    steps: [['Opened', 'projects/resq/', 'case study']],
    text: 'Opening the ResQ case study. It starts with Assam\'s floods and follows a request all the way to the field team.',
    render: 'project',
  },
  prescribble: {
    prompt: 'How was Prescribble tested?',
    steps: [['Opened', 'projects/prescribble/', 'case study']],
    text: 'Seven interviews with doctors, patients and pharmacists, then a working build deployed on Vercel. The case study has the live build in it.',
    render: 'project',
  },
  chemar: {
    prompt: 'Show me ChemAR running.',
    steps: [['Opened', 'projects/chem-ar/', 'case study']],
    text: 'Here it is running in the browser with hand tracking. Pinch to spawn an atom, then drag two together to form a bond.',
    render: 'project',
  },
}

export const OTHER_PROJECTS_LABEL = 'Check out my other projects'

/** Shown in the composer once every flow has run. */
export const DONE_PROMPT = 'That\'s all for now. Everything else is in the sidebar.'

/** The project chips above the composer. Each opens that project's summary in the chat. */
export const suggestions: { project: ProjectKey; img: string; tag: string; title: string; sub: string }[] = [
  { project: 'resq', img: '/assets/thumb-resq.jpg', tag: 'Mobile App', title: 'ResQ', sub: 'Disaster comms over a mesh network' },
  { project: 'prescribble', img: '/assets/thumb-prescribble.jpg', tag: 'iPad App', title: 'Prescribble', sub: 'Handwritten prescriptions on iPad' },
  { project: 'chemar', img: '/assets/thumb-chemar.jpg', tag: 'Research project', title: 'ChemAR', sub: 'AR chemistry, built with AI' },
]

/** Words the intro kicker types through. */
export const ROLES = ['product', 'interaction']
