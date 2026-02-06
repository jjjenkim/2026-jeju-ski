import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'  // Tailwind CSS 켜기
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
