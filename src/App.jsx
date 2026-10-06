import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import StickyActions from './components/layout/StickyActions'
import Home from './pages/Home'
import Dashboard from './pages/CRM/Dashboard'
import Followups from './pages/CRM/Followups'
import Leads from './pages/CRM/Leads'
import Bookings from './pages/CRM/Bookings'
import Customers from './pages/CRM/Customers'
import Messages from './pages/CRM/Messages'
import Reports from './pages/CRM/Reports'
import { LenisProvider } from './hooks/useLenis'
import { DEFAULT_LEADS, getStoredLeads, persistLeads } from './utils/liveLeads'
import { ensureGsapRegistered } from './utils/gsapSetup'
import { refreshScrollTriggerAfterLoad } from './utils/animationCleanup'

ensureGsapRegistered()

function App() {
  useEffect(() => {
    refreshScrollTriggerAfterLoad()

    const storedLeads = getStoredLeads()
    if (storedLeads.length === 0) {
      persistLeads(DEFAULT_LEADS)
    }
  }, [])

  return (
    <BrowserRouter>
      <LenisProvider>
        <Routes>

          {/* Main Website */}
          <Route
            path="/"
            element={
              <>
                <a href="#home" className="skip-link">
                  Skip to content
                </a>

                <Header />

                <main>
                  <Home />
                </main>

                <Footer />
                <StickyActions />
              </>
            }
          />

          {/* CRM */}
          <Route
            path="/crm"
            element={<Dashboard />}
          />
          <Route path="/crm/leads" element={<Leads />} />
          <Route path="/crm/followups" element={<Followups />} />
          <Route path="/crm/bookings" element={<Bookings />} />
          <Route path="/crm/customers" element={<Customers />} />
          <Route path="/crm/messages" element={<Messages />} />
          <Route path="/crm/reports" element={<Reports />} />

        </Routes>
      </LenisProvider>
    </BrowserRouter>
  )
}

export default App