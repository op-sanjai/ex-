import { useState } from 'react'
import Sidebar from '../../components/crm/Sidebar'
import { LeadDetailModal, LeadEditorModal } from '../../components/crm/LeadCrudModals'
import { downloadCsv, getStatusClass, normalizeLeadData, persistLeads, useLiveLeads } from '../../utils/liveLeads'
import './crm.css'

const parseBudget = (budget) => {
  if (!budget) return 0
  const digits = Number(String(budget).replace(/[^\d]/g, ''))
  return Number.isFinite(digits) ? digits : 0
}

export default function Reports() {
  const [leads, setLeads] = useLiveLeads()
  const [selectedLead, setSelectedLead] = useState(null)
  const [editorLead, setEditorLead] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const totalRevenue = leads.reduce((sum, lead) => sum + parseBudget(lead.budget), 0)
  const totalBooked = leads.filter((lead) => lead.status === 'Booked').length
  const totalFollowUps = leads.filter((lead) => lead.status === 'Follow-up').length
  const conversionRate = leads.length ? Math.round((totalBooked / leads.length) * 100) : 0

  const destinationSummary = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.destination] = (acc[lead.destination] || 0) + 1
      return acc
    }, {})
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const updateLeads = (updater) => {
    setLeads((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persistLeads(next)
      return next
    })
  }

  const saveLead = (draftLead) => {
    const normalized = normalizeLeadData(draftLead)
    updateLeads((previous) => {
      const next = draftLead.id
        ? previous.map((lead) => (lead.id === draftLead.id ? normalized : lead))
        : [normalized, ...previous]
      return next
    })
    setSelectedLead(normalized)
    setShowEditor(false)
    setEditorLead(null)
  }

  const exportSummary = () => {
    const rows = leads.map((lead) => ({
      ...lead,
      budget: lead.budget || '—',
      followUp: lead.followUp || 'Not scheduled',
    }))
    downloadCsv(rows, 'crm-report-export.csv')
  }

  return (
    <div className="crm-layout crm-page">
      <Sidebar />

      <main className="crm-main">
        <header className="crm-header crm-topbar">
          <div>
            <h1>Reports</h1>
            <p>Business overview driven by the current lead pipeline and booking performance.</p>
          </div>

          <div className="crm-toolbar-actions">
            <button className="crm-add-btn" onClick={() => { setEditorLead(null); setShowEditor(true) }}>
              + Add New Lead
            </button>
          </div>
        </header>

        <section className="crm-kpis">
          <div className="kpi-card">
            <span>Total Leads</span>
            <strong>{leads.length}</strong>
            <small>Across all stages</small>
          </div>

          <div className="kpi-card">
            <span>Booked</span>
            <strong>{totalBooked}</strong>
            <small>Confirmed customers</small>
          </div>

          <div className="kpi-card">
            <span>Conversion</span>
            <strong>{conversionRate}%</strong>
            <small>Booking conversion</small>
          </div>

          <div className="kpi-card">
            <span>Revenue</span>
            <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
            <small>Pipeline value</small>
          </div>
        </section>

        <section className="crm-panel">
          <div className="panel-heading">
            <div>
              <h2>Top Destinations</h2>
              <p>Most requested travel destinations in your live pipeline.</p>
            </div>
            <button type="button" className="secondary-btn" onClick={exportSummary}>Export Report</button>
          </div>

          <div className="report-grid">
            {destinationSummary.map(([destination, count]) => (
              <div className="report-item" key={destination}>
                <span>{destination}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="crm-panel">
          <div className="panel-heading">
            <div>
              <h2>Pipeline Health</h2>
              <p>Key lead stages across the sales funnel.</p>
            </div>
          </div>

          <div className="lead-table-wrapper">
            <div className="lead-table-head">
              <span>Stage</span>
              <span>Count</span>
              <span>Share</span>
              <span>Actions</span>
            </div>

            {['New', 'Follow-up', 'Contacted', 'Quoted', 'Booked', 'Completed'].map((stage) => {
              const count = leads.filter((lead) => lead.status === stage).length
              const share = leads.length ? Math.round((count / leads.length) * 100) : 0

              return (
                <div className="lead-table-row" key={stage}>
                  <span>{stage}</span>
                  <span>{count}</span>
                  <span>{share}%</span>
                  <span className="table-actions">
                    <button type="button" className="mini-btn" onClick={() => setSelectedLead(leads.find((lead) => lead.status === stage) || null)}>View</button>
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onEdit={() => {
          setEditorLead(selectedLead)
          setShowEditor(true)
        }}
        onUpdateLead={(updatedLead) => {
          updateLeads((previous) => previous.map((lead) => (lead.id === updatedLead.id ? normalizeLeadData(updatedLead) : lead)))
          setSelectedLead(normalizeLeadData(updatedLead))
        }}
      />

      <LeadEditorModal
        isOpen={showEditor}
        lead={editorLead}
        onClose={() => {
          setShowEditor(false)
          setEditorLead(null)
        }}
        onSave={saveLead}
        title={editorLead ? 'Edit Lead' : 'Add New Lead'}
      />
    </div>
  )
}
