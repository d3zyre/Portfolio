import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LongForm from './longform/LongForm'


createRoot(document.getElementById('root')!).render(
  <React.StrictMode><LongForm /></React.StrictMode>
)
