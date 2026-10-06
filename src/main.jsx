import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// iOS error debugging
window.addEventListener('error', (e) => {
  document.body.innerHTML = `
    <pre style="white-space:pre-wrap;padding:20px;color:red">
ERROR: ${e.message}
${e.filename}:${e.lineno}:${e.colno}
    </pre>
  `
})

window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML = `
    <pre style="white-space:pre-wrap;padding:20px;color:red">
PROMISE ERROR:
${e.reason}
    </pre>
  `
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)