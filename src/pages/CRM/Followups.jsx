import { useState } from 'react'
import Sidebar from '../../components/crm/Sidebar'
import { LeadDetailModal, LeadEditorModal } from '../../components/crm/LeadCrudModals'
import { downloadCsv, getStatusClass, normalizeLeadData, persistLeads, useLiveLeads } from '../../utils/liveLeads'
import './crm.css'

const getLocalDateString = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().split('T')[0]
}

export default function Followups() {
  const [leads, setLeads] = useLiveLeads([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [editorLead, setEditorLead] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const followups = leads.filter((lead) => lead.followUp && !lead.followUpCompleted)
  const today = getLocalDateString()
  const overdue = followups.filter((item) => item.followUp < today)
  const todayFollowups = followups.filter((item) => item.followUp === today)
  const upcoming = followups.filter((item) => item.followUp > today)

  const visibleFollowups = [...overdue, ...todayFollowups, ...upcoming].filter((lead) => {
    const search = searchTerm.toLowerCase().trim()
    const matchesSearch = !search || lead.name.toLowerCase().includes(search) || lead.destination.toLowerCase().includes(search)
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Overdue' && lead.followUp < today) ||
      (statusFilter === 'Today' && lead.followUp === today) ||
      (statusFilter === 'Upcoming' && lead.followUp > today)
    return matchesSearch && matchesStatus
  })

  const updateLeads = (updater) => {
    setLeads((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persistLeads(next)
      return next
    })
  }

  const markCompleted = (id) => {
    updateLeads((previous) =>
      previous.map((lead) =>
        lead.id === id ? { ...lead, completed: true, followUpCompleted: true } : lead
      )
    )
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

  const exportFollowups = () => {
    downloadCsv(visibleFollowups, 'followups-export.csv')
  }

  return (
    <div className="crm-layout crm-page">
      <Sidebar />

      <main className="crm-main">
        <header className="crm-header crm-topbar">
          <div>
            <h1>Follow-ups</h1>
            <p>Manage your customer follow-ups and keep every lead moving.</p>
          </div>

          <div className="crm-toolbar-actions">
            <button className="crm-add-btn" onClick={() => { setEditorLead(null); setShowEditor(true) }}>
              + Add New Lead
            </button>
          </div>
        </header>

        <section className="crm-kpis">
          <div className="kpi-card overdue-card">
            <span>Overdue</span>
            <strong>{overdue.length}</strong>
            <small>Needs attention</small>
          </div>

          <div className="kpi-card today-card">
            <span>Today</span>
            <strong>{todayFollowups.length}</strong>
            <small>Today's follow-ups</small>
          </div>

          <div className="kpi-card upcoming-card">
            <span>Upcoming</span>
            <strong>{upcoming.length}</strong>
            <small>Scheduled ahead</small>
          </div>
        </section>

        <section className="crm-panel">
          <div className="panel-heading">
            <div>
              <h2>Follow-up Queue</h2>
              <p>Customers needing action across upcoming and overdue tasks.</p>
            </div>

            <div className="crm-toolbar-actions">
              <div className="lead-filters">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search follow-ups..."
                />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="All">All</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Today">Today</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <button type="button" className="secondary-btn" onClick={exportFollowups}>
                Export CSV
              </button>
            </div>
          </div>

          {visibleFollowups.length === 0 ? (
            <div className="empty-state">🎉 No follow-ups match the current filters.</div>
          ) : (
            <div className="followup-list">
              {visibleFollowups.map((item) => (
                <div className="followup-card" key={item.id}>
                  <div className="followup-info">
                    <div className="followup-header-row">
                      <h3>{item.name}</h3>
                      <span className={`followup-badge ${item.followUp > today ? 'upcoming' : ''}`}>
                        {item.followUp < today ? 'Overdue' : item.followUp === today ? 'Today' : 'Upcoming'}
                      </span>
                    </div>

                    <p>📍 {item.destination}</p>
                    <p>📞 {item.phone}</p>
                    <div className="followup-meta-row">
                      <span>📅 {item.followUp}</span>
                    </div>
                    <span className="followup-note">📝 {item.followUpNote || 'No note added yet.'}</span>
                    <span className={`status ${getStatusClass(item.status)}`} style={{ marginTop: '12px' }}>{item.status}</span>
                  </div>

                  <div className="followup-actions">
                    <button type="button" className="mini-btn" onClick={() => setSelectedLead(item)}>
                      View
                    </button>
                    <button type="button" className="mini-btn alt" onClick={() => { setEditorLead(item); setShowEditor(true) }}>
                      Edit
                    </button>
                    <a href={`tel:${item.phone}`} className="lead-action call">
                      📞 Call
                    </a>
                    <a href={`https://wa.me/${item.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="lead-action whatsapp">
                      💬 WhatsApp
                    </a>
                    <button onClick={() => markCompleted(item.id)} className="complete-followup-btn">
                      ✓ Complete
                    </button>
                  </div>
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
