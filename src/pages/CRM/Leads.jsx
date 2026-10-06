import { useState } from 'react'
import Sidebar from '../../components/crm/Sidebar'
import { LeadDetailModal, LeadEditorModal } from '../../components/crm/LeadCrudModals'
import { downloadCsv, getStatusClass, normalizeLeadData, persistLeads, useLiveLeads } from '../../utils/liveLeads'
import './crm.css'

export default function Leads() {
  const [leads, setLeads] = useLiveLeads([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [editorLead, setEditorLead] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const newLeads = leads.filter((lead) => lead.status === 'New').length
  const followUpLeads = leads.filter((lead) => lead.status === 'Follow-up').length
  const bookedLeads = leads.filter((lead) => lead.status === 'Booked').length

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search) ||
      lead.phone.toLowerCase().includes(search) ||
      lead.destination.toLowerCase().includes(search)
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

  const handleExport = () => {
    downloadCsv(filteredLeads, 'leads-export.csv')
  }

  return (
    <div className="crm-layout crm-page">
      <Sidebar />

      <main className="crm-main">
        <header className="crm-header crm-topbar">
          <div>
            <h1>Leads</h1>
            <p>Track every enquiry, call, and booking opportunity in real time.</p>
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
            <span>New</span>
            <strong>{newLeads}</strong>
            <small>Fresh enquiries</small>
          </div>

          <div className="kpi-card">
            <span>Follow-up</span>
            <strong>{followUpLeads}</strong>
            <small>Waiting for contact</small>
          </div>

          <div className="kpi-card">
            <span>Booked</span>
            <strong>{bookedLeads}</strong>
            <small>Confirmed trips</small>
          </div>
        </section>

        <section className="crm-panel">
          <div className="panel-heading">
            <div>
              <h2>All Leads</h2>
              <p>Latest customer pipeline updates.</p>
            </div>

            <div className="crm-toolbar-actions">
              <div className="lead-filters">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search leads..."
                />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="All">All Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Booked">Booked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="button" className="secondary-btn" onClick={handleExport}>
                Export CSV
              </button>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="empty-state">No leads match the current filters.</div>
          ) : (
            <div className="lead-table-wrapper">
              <div className="lead-table-head">
                <span>Customer</span>
                <span>Destination</span>
                <span>Phone</span>
                <span>Date</span>
                <span>Budget</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {filteredLeads.map((lead) => (
                <div className="lead-table-row" key={lead.id}>
                  <span>{lead.name}</span>
                  <span>{lead.destination}</span>
                  <span>{lead.phone}</span>
                  <span>{lead.date}</span>
                  <span>{lead.budget || '—'}</span>
                  <span className={`status ${getStatusClass(lead.status)}`}>{lead.status}</span>
                  <span className="table-actions">
                    <button type="button" className="mini-btn" onClick={() => setSelectedLead(lead)}>
                      View
                    </button>
                    <button
                      type="button"
                      className="mini-btn alt"
                      onClick={() => {
                        setEditorLead(lead)
                        setShowEditor(true)
                      }}
                    >
                      Edit
                    </button>
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
          updateLeads((previous) =>
            previous.map((lead) => (lead.id === updatedLead.id ? normalizeLeadData(updatedLead) : lead))
          )
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
