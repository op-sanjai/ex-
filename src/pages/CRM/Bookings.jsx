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

export default function Bookings() {
  const [leads, setLeads] = useLiveLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [editorLead, setEditorLead] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const bookings = leads.filter((lead) => ['Booked', 'Completed'].includes(lead.status))
  const totalRevenue = bookings.reduce((sum, lead) => sum + parseBudget(lead.budget), 0)
  const filteredBookings = bookings.filter((lead) => {
    const search = searchTerm.toLowerCase().trim()
    const matchesSearch = !search || lead.name.toLowerCase().includes(search) || lead.destination.toLowerCase().includes(search) || lead.phone.toLowerCase().includes(search)
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  return (
    <div className="crm-layout crm-page">
      <Sidebar />

      <main className="crm-main">
        <header className="crm-header crm-topbar">
          <div>
            <h1>Bookings</h1>
            <p>Confirmed trips and successful closings from your CRM pipeline.</p>
          </div>

          <div className="crm-toolbar-actions">
            <button className="crm-add-btn" onClick={() => { setEditorLead(null); setShowEditor(true) }}>
              + Add New Lead
            </button>
          </div>
        </header>

        <section className="crm-kpis">
          <div className="kpi-card">
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
            <small>Confirmed sales</small>
          </div>

          <div className="kpi-card">
            <span>Revenue</span>
            <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
            <small>Booked value</small>
          </div>

          <div className="kpi-card">
            <span>Active Trips</span>
            <strong>{bookings.filter((lead) => lead.status === 'Booked').length}</strong>
            <small>Currently booked</small>
          </div>
        </section>

        <section className="crm-panel">
          <div className="panel-heading">
            <div>
              <h2>Booking Pipeline</h2>
              <p>All confirmed and completed customer bookings.</p>
            </div>

            <div className="crm-toolbar-actions">
              <div className="lead-filters">
                <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search bookings..." />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Booked">Booked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="button" className="secondary-btn" onClick={() => downloadCsv(filteredBookings, 'bookings-export.csv')}>
                Export CSV
              </button>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="empty-state">No bookings match the current filters.</div>
          ) : (
            <div className="lead-table-wrapper">
              <div className="lead-table-head">
                <span>Customer</span>
                <span>Destination</span>
                <span>Phone</span>
                <span>Travel Date</span>
                <span>Budget</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filteredBookings.map((lead) => (
                <div className="lead-table-row" key={lead.id}>
                  <span>{lead.name}</span>
                  <span>{lead.destination}</span>
                  <span>{lead.phone}</span>
                  <span>{lead.date}</span>
                  <span>{lead.budget || '—'}</span>
                  <span className={`status ${getStatusClass(lead.status)}`}>{lead.status}</span>
                  <span className="table-actions">
                    <button type="button" className="mini-btn" onClick={() => setSelectedLead(lead)}>View</button>
                    <button type="button" className="mini-btn alt" onClick={() => { setEditorLead(lead); setShowEditor(true) }}>Edit</button>
                  </span>
                </div>
              ))}
            </div>
          )}
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
