import { useEffect, useState } from 'react'
import { STATUS_OPTIONS, getStatusClass } from '../../utils/liveLeads'

const emptyLead = {
  id: null,
  name: '',
  phone: '',
  destination: '',
  date: '',
  budget: '',
  status: 'New',
  followUp: '',
  followUpNote: '',
  followUpCompleted: false,
}

export function LeadEditorModal({ isOpen, lead, onClose, onSave, title = 'Add Lead' }) {
  const [draft, setDraft] = useState(lead || emptyLead)

  useEffect(() => {
    const nextDraft = lead
      ? {
          ...emptyLead,
          ...lead,
          budget: lead.budget ? String(lead.budget).replace(/[^\d]/g, '') : '',
        }
      : emptyLead

    setDraft(nextDraft)
  }, [lead, isOpen])

  if (!isOpen) return null

  const handleChange = (event) => {
    const { name, value } = event.target
    setDraft((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({
      ...draft,
      status: draft.status || 'New',
      date: draft.date || 'Not set',
      budget: draft.budget || '—',
      followUp: draft.followUp || '',
      followUpNote: draft.followUpNote || '',
    })
  }

  return (
    <div className="lead-modal-overlay" onClick={onClose}>
      <div className="lead-modal" onClick={(event) => event.stopPropagation()}>
        <div className="lead-modal-header">
          <div>
            <h2>{title}</h2>
            <p>Update customer and trip details.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <label>
            Customer Name
            <input
              type="text"
              name="name"
              value={draft.name}
              onChange={handleChange}
              placeholder="Customer name"
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={draft.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
            />
          </label>

          <label>
            Destination
            <input
              type="text"
              name="destination"
              value={draft.destination}
              onChange={handleChange}
              placeholder="Goa / Munnar / Bali"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Travel Date
              <input type="date" name="date" value={draft.date} onChange={handleChange} />
            </label>

            <label>
              Status
              <select name="status" value={draft.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Budget
            <input
              type="number"
              name="budget"
              value={draft.budget}
              onChange={handleChange}
              placeholder="50000"
            />
          </label>

          <label>
            Next Follow-up
            <input type="date" name="followUp" value={draft.followUp} onChange={handleChange} />
          </label>

          <label>
            Follow-up Note
            <textarea
              name="followUpNote"
              rows="3"
              value={draft.followUpNote}
              onChange={handleChange}
              placeholder="Share package details and confirm preferred dates"
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-lead-btn">
              {lead ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function LeadDetailModal({ lead, onClose, onEdit, onUpdateLead }) {
  if (!lead) return null

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value
    onUpdateLead({
      ...lead,
      status: nextStatus,
      followUpCompleted: nextStatus === 'Completed' || nextStatus === 'Booked' ? true : lead.followUpCompleted,
    })
  }

  const handleFollowUpChange = (event) => {
    const nextFollowUp = event.target.value
    onUpdateLead({
      ...lead,
      followUp: nextFollowUp,
      followUpCompleted: false,
    })
  }

  return (
    <div className="lead-modal-overlay" onClick={onClose}>
      <div className="lead-details-modal" onClick={(event) => event.stopPropagation()}>
        <div className="lead-modal-header">
          <div>
            <span className="lead-details-label">LEAD DETAILS</span>
            <h2>{lead.name}</h2>
            <p>
              {lead.destination} • {lead.date || 'No travel date'}
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="lead-detail-status">
          <span>Status</span>
          <select value={lead.status} onChange={handleStatusChange}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="lead-info-grid">
          <div className="lead-info-box">
            <span>Customer</span>
            <strong>{lead.name}</strong>
          </div>

          <div className="lead-info-box">
            <span>Phone</span>
            <strong>{lead.phone}</strong>
          </div>

          <div className="lead-info-box">
            <span>Destination</span>
            <strong>{lead.destination}</strong>
          </div>

          <div className="lead-info-box">
            <span>Travel Date</span>
            <strong>{lead.date || 'Not set'}</strong>
          </div>

          <div className="lead-info-box">
            <span>Budget</span>
            <strong>{lead.budget || '—'}</strong>
          </div>

          <div className="lead-info-box">
            <span>Follow-up</span>
            <strong>{lead.followUp || 'Not scheduled'}</strong>
          </div>
        </div>

        <div className="lead-action-buttons">
          <a href={`tel:${lead.phone}`} className="lead-action call">
            📞 Call
          </a>
          <a href={`https://wa.me/${String(lead.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="lead-action whatsapp">
            💬 WhatsApp
          </a>
        </div>

        <div className="followup-box">
          <div>
            <span>Next Follow-up</span>
            <strong>{lead.followUp || 'Schedule follow-up'}</strong>
          </div>
          <input type="date" value={lead.followUp || ''} onChange={handleFollowUpChange} />
        </div>

        <div className="lead-notes">
          <span>Notes</span>
          <p>
            {lead.followUpNote || `Customer enquiry for ${lead.destination}. Follow up with package details and availability.`}
          </p>
        </div>

        <div className="lead-details-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Close
          </button>
          <button type="button" className="save-lead-btn" onClick={onEdit}>
            ✏️ Edit Lead
          </button>
        </div>
      </div>
    </div>
  )
}

export function getLeadBadgeClass(status) {
  return getStatusClass(status)
}
