import { createRoot } from 'react-dom/client'
import './case-study-bar.css'
import { CaseStudyBar } from './CaseStudyBar'

// Follow the theme chosen on the main site (light unless they picked dark there).
let theme = 'light'
try { if (localStorage.getItem('theme-choice') === 'dark') theme = 'dark' } catch { /* storage blocked */ }

// Each case study page has <div id="case-study-bar" data-slug="…"> above its own root.
const host = document.getElementById('case-study-bar')
if (host) host.dataset.theme = theme
if (host) createRoot(host).render(<CaseStudyBar slug={host.dataset.slug ?? ''} />)
