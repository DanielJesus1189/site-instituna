import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PaperBackground } from './components/ui/PaperBackground'
import { SvgDefs } from './components/ui/SvgDefs'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SvgDefs />
    <PaperBackground />
    <App />
  </StrictMode>,
)
