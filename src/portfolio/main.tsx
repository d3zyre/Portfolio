import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { readSavedChat } from './savedChat'

// Read once, outside React: it consumes the one-time "Back to chat" flag.
const saved = readSavedChat()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App saved={saved} /></React.StrictMode>
)
