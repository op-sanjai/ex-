import { useState } from 'react'
import Sidebar from '../../components/crm/Sidebar'
import { LeadDetailModal, LeadEditorModal } from '../../components/crm/LeadCrudModals'
import { downloadCsv, getStatusClass, normalizeLeadData, persistLeads, useLiveLeads } from '../../utils/liveLeads'
import './crm.css'

export default function Messages() {
  const [leads, setLeads] = useLiveLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [editorLead, setEditorLead] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const statusTone = {
    New: 'Pending',
    'Follow-up': 'Awaiting reply',
    Contacted: 'Sent',
    Quoted: 'Quoted',
    Booked: 'Confirmed',
    Completed: 'Closed',
  }

  const filteredLeads = leads.filter((lead) => {
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
            <h1>Messages</h1>
            <p>Live customer communication tracker for all outbound CRM conversations.</p>
          </div>

          <div className="crm-toolbar-actions">
            <button className="crm-add-btn" onClick={() => { setEditorLead(null); setShowEditor(true) }}>
              + Add New Lead
            </button>
          </div>
        </header>

        <section className="crm-kpis">
          <div className="kpi-card">
            <span>Pending</span>
            <strong>{leads.filter((lead) => lead.status === 'New').length}</strong>
            <small>New leads</small>
          </div>

          <div className="kpi-card">
            <span>Awaiting Reply</span>
            <strong>{leads.filter((lead) => lead.status === 'Follow-up').length}</strong>
            <small>Follow-up stage</small>
          </div>

          <div className="kpi-card">
            <span>Confirmed</span>
            <strong>{leads.filter((lead) => lead.status === 'Booked').length}</strong>
            <small>Booked conversations</small>
          </div>
        </section>

        <section className="crm-panel">
          <div className="panel-heading">
            <div>
              <h2>Inbox Summary</h2>
              <p>Latest message intent based on lead status and follow-up schedule.</p>
            </div>

            <div className="crm-toolbar-actions">
              <div className="lead-filters">
                <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search messages..." />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="All">All Status</option>
                  <option value="New">New</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Booked">Booked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="button" className="secondary-btn" onClick={() => downloadCsv(filteredLeads, 'messages-export.csv')}>
                Export CSV
              </button>
            </div>
          </div>

          <div className="message-list">
            {filteredLeads.map((lead) => {
              const status = statusTone[lead.status] || 'Sent'
              const preview = lead.followUpNote || `Hi ${lead.name}, your ${lead.destination} package is ready for review.`

              return (
                <div className="message-card" key={lead.id}>
                  <div className="message-header">
                    <strong>{lead.name}</strong>
                    <span className={`status ${getStatusClass(lead.status)}`}>{status}</span>
                  </div>

                  <p>{preview}</p>

                  <div className="message-meta">
                    <span>{lead.phone}</span>
                    <span>{lead.destination}</span>
                    <span>{lead.followUp || 'No follow-up set'}</span>
                  </div>

                  <div className="table-actions" style={{ marginTop: '12px' }}>
                    <button type="button" className="mini-btn" onClick={() => setSelectedLead(lead)}>View</button>
                    <button type="button" className="mini-btn alt" onClick={() => { setEditorLead(lead); setShowEditor(true) }}>Edit</button>
                  </div>
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
