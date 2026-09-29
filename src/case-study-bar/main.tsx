import { createRoot } from 'react-dom/client'
import './case-study-bar.css'
import { CaseStudyBar } from './CaseStudyBar'

// Each case study page has <div id="case-study-bar" data-slug="…"> above its own root.
const host = document.getElementById('case-study-bar')
if (host) createRoot(host).render(<CaseStudyBar slug={host.dataset.slug ?? ''} />)
