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
  glance: '/glance/',
  prescribble: '/prescribble/',
  resq: '/resq/',
  chemar: '/chem-ar/',
  wordgate: '/wordgate/',
} as const

/** A project with a case study. Selecting one opens its summary in the chat. */
export type ProjectKey = keyof typeof CASE_STUDIES

export type Project = {
  key: ProjectKey
  tag: string
  title: string
  href: string
  /** 16:10 thumbnail in public/assets. If the file is missing, the card shows its gradient placeholder. */
  img: string
  desc: string
  meta: string[]
  /** Kept here but left out of the projects answer. */
  hidden?: boolean
  /** Lower priority: shown in a smaller "More work" row under the main projects, not in the sidebar. */
  minor?: boolean
}

export const projects: Project[] = [
  { key: 'glance', tag: 'Design Exercise · 2026', title: 'Glance Coach', href: CASE_STUDIES.glance, img: '/assets/thumb-glance.jpg',
    desc: 'An AI workout coach that lives on the phone and a shared family TV. It sizes each evening workout to the day you had, talks only on your phone, and counts a 15-minute session as a win. Built in 48 hours as a working two-screen prototype.',
    meta: ['Phone + TV', 'AI agent', 'Prototype'] },
  { key: 'prescribble', tag: 'iPad App · 2026', title: 'Prescribble', href: CASE_STUDIES.prescribble, img: '/assets/thumb-prescribble.jpg',
    desc: 'An iPad prescription system for busy government OPDs, where doctors keep writing by hand with Apple Scribble. Stakeholder interviews, a service blueprint of the full journey, and a working prototype deployed on Vercel to test the flow.',
    meta: ['Service blueprint', 'Healthcare', 'Deployed prototype'] },
  { key: 'wordgate', tag: 'Internship · 2026', title: 'Wordgate', href: CASE_STUDIES.wordgate, img: '/assets/thumb-wordgate.jpg',
    desc: 'Redesign of a shipped strategy word game as the sole designer, so the whole game is easy to understand in fewer taps. Rebuilt the information architecture, added the missing hosting and Wordmine flows, and delivered 120+ screens across 10+ flows.',
    meta: ['Information architecture', 'Game UX', 'Shipped app'] },
  { key: 'resq', tag: 'Mobile App · Jul 2026', title: 'ResQ', href: CASE_STUDIES.resq, img: '/assets/thumb-resq.jpg',
    desc: 'A disaster communication platform for Assam that keeps working over a mesh network when the cell network fails. Help requests that hop phone to phone, neighbours who can volunteer, and separate views for coordinators and field teams.',
    meta: ['User research', 'Mesh network', 'Multilingual'] },
  { key: 'chemar', tag: 'Research Project · 2025', title: 'ChemAR', href: CASE_STUDIES.chemar, img: '/assets/thumb-chemar.jpg', minor: true,
    desc: 'A no-code, AI-assisted workflow that lets non-technical educators build interactive AR lessons, tested by building ChemAR, an organic chemistry lab.',
    meta: ['Human-AI workflow', 'AR', 'Accepted for publication'] },
]

/** The projects the chat shows. */
export const shownProjects = projects.filter((p) => !p.hidden)
/** The selected works, then the rest. */
export const mainProjects = shownProjects.filter((p) => !p.minor)
export const minorProjects = shownProjects.filter((p) => p.minor)

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

  { company: 'Mobiclay Technology', role: 'UI/UX Intern', when: 'Summer 2026 · 3 months · Remote', href: '#',
    points: [
      'Sole designer for Wordgate, a strategy word game at an early-stage startup; owned end-to-end UX decisions.',
      'Rebuilt the information architecture around drop-offs and onboarding issues from a trial release, reducing steps and clicks across core flows.',
      'Brought 2–3 alternatives to every flow and tested Figma prototypes with returning players, adopting the most intuitive option.',
      'Set up reusable components and a colour system that kept 120+ screens consistent, replacing a fully hardcoded interface.',
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
    text: 'Selected works.',
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
    text: 'Hi! I love how humans interact with cool tech. I enjoy learning about unfamiliar domains and finding ways to make complex experiences feel intuitive. Outside of work, you\'ll find me solving a rubik\'s cube, playing chess or gaming.',
    render: null,
    next: null,
  },

  // One project's summary, opened by selecting it anywhere on the page.
  glance: {
    prompt: 'Tell me about Glance Coach.',
    steps: [['Opened', 'projects/glance/', 'case study']],
    text: 'Opening Glance Coach. It starts with one shared living-room TV and ends with "15 minutes. That counts."',
    render: 'project',
  },
  wordgate: {
    prompt: 'What did you do at Mobiclay?',
    steps: [['Opened', 'projects/wordgate/', 'case study']],
    text: 'Opening Wordgate, where I redesigned a shipped word game to be easy to understand in fewer taps.',
    render: 'project',
  },
  resq: {
    prompt: 'Walk me through ResQ.',
    steps: [['Opened', 'projects/resq/', 'case study']],
    text: 'Opening the ResQ case study. It starts with Assam\'s floods and follows a request all the way to the field team.',
    render: 'project',
  },
  prescribble: {
    prompt: 'What is Prescribble?',
    steps: [['Opened', 'projects/prescribble/', 'case study']],
    text: 'An iPad prescription system for busy government OPDs. Doctors keep writing by hand with Apple Pencil, and it makes the prescription readable for the pharmacist and the patient. You can try the live build inside the case study.',
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
export const suggestions: { project: ProjectKey; img: string; tag: string; title: string; sub: string; tags: string[] }[] = [
  // Category, one-liner and tags each say something new: no word repeats across them.
  { project: 'glance', img: '/assets/thumb-glance.jpg', tag: 'Phone + TV', title: 'Glance Coach', sub: 'An AI coach that fits each workout to your day and puts it on the TV',
    tags: ['AI agent', '48-hour sprint', 'Prototype'] },
  { project: 'prescribble', img: '/assets/thumb-prescribble.jpg', tag: 'iPad App', title: 'Prescribble', sub: 'Helping doctors write clear prescriptions in their natural flow',
    tags: ['Healthcare', 'Apple Pencil', 'Live build'] },
  { project: 'wordgate', img: '/assets/thumb-wordgate.jpg', tag: 'Internship', title: 'Wordgate', sub: 'Turning a confusing word game into one you learn by playing',
    tags: ['Sole designer', '120+ screens'] },
]

/** Words the intro kicker types through. */
export const ROLES = ['product', 'interaction']
