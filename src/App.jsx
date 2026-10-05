import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import StickyActions from './components/layout/StickyActions'
import Home from './pages/Home'
import { LenisProvider } from './hooks/useLenis'
import { ensureGsapRegistered } from './utils/gsapSetup'
import { refreshScrollTriggerAfterLoad } from './utils/animationCleanup'

ensureGsapRegistered()

function App() {
  useEffect(() => {
    refreshScrollTriggerAfterLoad()
  }, [])

  return (
    <BrowserRouter>
      <LenisProvider>
        <a href="#home" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <StickyActions />
      </LenisProvider>
    </BrowserRouter>
  )
}

export default App
