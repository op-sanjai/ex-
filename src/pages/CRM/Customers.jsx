import { useState } from 'react'
import Sidebar from '../../components/crm/Sidebar'
import { LeadDetailModal, LeadEditorModal } from '../../components/crm/LeadCrudModals'
import { downloadCsv, getStatusClass, normalizeLeadData, persistLeads, useLiveLeads } from '../../utils/liveLeads'
import './crm.css'

export default function Customers() {
  const [leads, setLeads] = useLiveLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [editorLead, setEditorLead] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase().trim()
    const matchesSearch = !search || lead.name.toLowerCase().includes(search) || lead.phone.toLowerCase().includes(search) || lead.destination.toLowerCase().includes(search)
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
            <h1>Customers</h1>
            <p>All customer records and latest engagement details behind your CRM.</p>
          </div>

          <div className="crm-toolbar-actions">
            <button className="crm-add-btn" onClick={() => { setEditorLead(null); setShowEditor(true) }}>
              + Add New Lead
            </button>
          </div>
        </header>

        <section className="crm-kpis">
          <div className="kpi-card">
            <span>Total Customers</span>
            <strong>{leads.length}</strong>
            <small>Active records</small>
          </div>

          <div className="kpi-card">
            <span>Booked</span>
            <strong>{leads.filter((lead) => lead.status === 'Booked').length}</strong>
            <small>Confirmed trips</small>
          </div>

          <div className="kpi-card">
            <span>Need Follow-up</span>
            <strong>{leads.filter((lead) => lead.status === 'Follow-up').length}</strong>
            <small>Pending outreach</small>
          </div>
        </section>

        <section className="crm-panel">
          <div className="panel-heading">
            <div>
              <h2>Customer Directory</h2>
              <p>Latest contact and travel details for each customer.</p>
            </div>

            <div className="crm-toolbar-actions">
              <div className="lead-filters">
                <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search customers..." />
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
              <button type="button" className="secondary-btn" onClick={() => downloadCsv(filteredLeads, 'customers-export.csv')}>
                Export CSV
              </button>
            </div>
          </div>

          <div className="lead-table-wrapper">
            <div className="lead-table-head">
              <span>Customer</span>
              <span>Phone</span>
              <span>Destination</span>
              <span>Next Follow-up</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredLeads.map((lead) => (
              <div className="lead-table-row" key={lead.id}>
                <span>{lead.name}</span>
                <span>{lead.phone}</span>
                <span>{lead.destination}</span>
                <span>{lead.followUp || 'Not scheduled'}</span>
                <span className={`status ${getStatusClass(lead.status)}`}>{lead.status}</span>
                <span className="table-actions">
                  <button type="button" className="mini-btn" onClick={() => setSelectedLead(lead)}>View</button>
                  <button type="button" className="mini-btn alt" onClick={() => { setEditorLead(lead); setShowEditor(true) }}>Edit</button>
                </span>
              </div>
            ))}
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
