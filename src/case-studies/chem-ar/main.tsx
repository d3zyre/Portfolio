import React from 'react'
import { createRoot } from 'react-dom/client'
import './chem-ar.css'
import ChemAR from './ChemAR'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><ChemAR /></React.StrictMode>
)
