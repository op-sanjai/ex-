import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import Sidebar from '../../components/crm/Sidebar'
import { getStoredLeads, persistLeads, useLiveLeads } from '../../utils/liveLeads'
import './crm.css'

const leadData = [
  { name: 'Oct 1', leads: 8 },
  { name: 'Oct 5', leads: 16 },
  { name: 'Oct 10', leads: 26 },
  { name: 'Oct 15', leads: 18 },
  { name: 'Oct 20', leads: 28 },
  { name: 'Oct 25', leads: 31 },
  { name: 'Oct 31', leads: 42 },
]

const statusData = [
  { name: 'New', value: 24 },
  { name: 'Contacted', value: 21 },
  { name: 'Follow-up', value: 18 },
  { name: 'Quoted', value: 12 },
  { name: 'Booked', value: 31 },
  { name: 'Completed', value: 12 },
]

const STATUS_COLORS = [
  '#2196f3',
  '#64b5f6',
  '#ffc107',
  '#ab47bc',
  '#20c997',
  '#90a4ae',
]

const DASHBOARD_DEFAULT_LEADS = [
  {
    id: 1,
    name: 'Arun Kumar',
    phone: '+91 9876543210',
    destination: 'Goa',
    date: '20 Oct 2026',
    budget: '₹50,000',
    status: 'New',
    followUp: '2026-10-06',
    followUpNote: 'Call and confirm travel dates',
    followUpCompleted: false,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    destination: 'Kerala',
    date: '02 Nov 2026',
    budget: '₹30,000',
    status: 'Follow-up',
    followUp: '2026-10-06',
    followUpNote: 'Ask about hotel preference',
    followUpCompleted: false,
  },
  {
    id: 3,
    name: 'Rahul Nair',
    phone: '+91 9876543212',
    destination: 'Bali',
    date: '15 Nov 2026',
    budget: '₹75,000',
    status: 'Contacted',
    followUp: '2026-10-08',
    followUpNote: 'Send Bali package quotation',
    followUpCompleted: false,
  },
]

export default function Dashboard() {
  /* =========================
     MODAL
  ========================= */
const [showLeadModal, setShowLeadModal] = useState(false)
const [selectedLead, setSelectedLead] = useState(null)
const [showEditModal, setShowEditModal] = useState(false)

const [searchTerm, setSearchTerm] = useState('')
const [statusFilter, setStatusFilter] = useState('All')

  const [leads, setLeads] = useLiveLeads(DASHBOARD_DEFAULT_LEADS)
  const updateLeads = (updater) => {
    setLeads((prev) => {
      const nextValue = typeof updater === 'function' ? updater(prev) : updater
      persistLeads(nextValue)
      return nextValue
    })
  }

  useEffect(() => {
    const storedLeads = getStoredLeads()
    if (storedLeads.length === 0) {
      persistLeads(DASHBOARD_DEFAULT_LEADS)
    }
  }, [])

  /* =========================
     FORM DATA
  ========================= */
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    destination: '',
    date: '',
    travellers: 1,
    budget: '',
    notes: '',
  })

  /* =========================
     INPUT CHANGE
  ========================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /* =========================
     SAVE NEW LEAD
  ========================= */
  const handleSaveLead = (e) => {
    e.preventDefault()

    const formattedDate = formData.date
      ? new Date(`${formData.date}T00:00:00`).toLocaleDateString(
          'en-GB',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }
        )
      : 'Not set'

    const newLead = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      destination: formData.destination,
      date: formattedDate,
      budget: formData.budget
        ? `₹${Number(formData.budget).toLocaleString('en-IN')}`
        : '—',
      status: 'New',
    }

    /* Add new lead at top */
    updateLeads((prev) => [newLead, ...prev])

    /* Reset form */
    setFormData({
      name: '',
      phone: '',
      destination: '',
      date: '',
      travellers: 1,
      budget: '',
      notes: '',
    })

    /* Close modal */
    setShowLeadModal(false)
  
  }
  const filteredLeads = leads.filter((lead) => {
  const search = searchTerm.toLowerCase().trim()

  const matchesSearch =
    lead.name.toLowerCase().includes(search) ||
    lead.phone.toLowerCase().includes(search) ||
    lead.destination.toLowerCase().includes(search)

  const matchesStatus =
    statusFilter === 'All' ||
    lead.status === statusFilter

  return matchesSearch && matchesStatus
})

  return (
    <div className="crm-layout">

      {/* =========================
          SIDEBAR
      ========================= */}
      <Sidebar />

      <main className="crm-main">

        {/* =========================
            HEADER
        ========================= */}
        <header className="crm-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Track your leads, follow-ups and bookings in one place.
            </p>
          </div>

          <button
            className="crm-add-btn"
            onClick={() => setShowLeadModal(true)}
          >
            + Add New Lead
          </button>

        </header>


        {/* =========================
            STATS
        ========================= */}
        <section className="crm-stats">

          <div className="crm-card">
            <span>Total Leads</span>
            <strong>{128 + (leads.length - 3)}</strong>
            <small>↑ 12% vs last month</small>
          </div>

          <div className="crm-card">
            <span>New Leads</span>
            <strong>
              {24 +
                leads.filter(
                  (lead) => lead.status === 'New'
                ).length -
                1}
            </strong>
            <small>↑ 8% vs last month</small>
          </div>

          <div className="crm-card">
            <span>Follow-ups</span>
            <strong>18</strong>
            <small>↑ 20% vs last month</small>
          </div>

          <div className="crm-card">
            <span>Booked</span>
            <strong>31</strong>
            <small>↑ 15% vs last month</small>
          </div>

          <div className="crm-card">
            <span>Completed</span>
            <strong>55</strong>
            <small>↑ 10% vs last month</small>
          </div>

        </section>


        {/* =========================
            CHARTS
        ========================= */}
        <section className="crm-content-grid">

          {/* LEADS OVERVIEW */}
          <div className="crm-panel">

            <h2>Leads Overview</h2>

            <div className="chart-box">

              <ResponsiveContainer
                width="100%"
                height={260}
              >

                <AreaChart data={leadData}>

                  <defs>

                    <linearGradient
                      id="leadGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#20c997"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#20c997"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#718090"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#718090"
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#20c997"
                    strokeWidth={3}
                    fill="url(#leadGradient)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* LEAD STATUS */}
          <div className="crm-panel">

            <h2>Lead Status</h2>

            <div className="chart-box">

              <ResponsiveContainer
                width="100%"
                height={260}
              >

                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                  >

                    {statusData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[index]}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

              <div className="chart-center">

                <strong>{128 + (leads.length - 3)}</strong>

                <span>Total Leads</span>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            RECENT LEADS
        ========================= */}
        <section className="crm-panel">
          <div className="panel-heading">

  <div>
    <h2>Recent Leads</h2>
    <p className="lead-count">
      {filteredLeads.length} leads found
    </p>
  </div>

  <div className="lead-filters">

    <input
      type="text"
      placeholder="🔍 Search leads..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="All">All Status</option>
      <option value="New">New</option>
      <option value="Contacted">Contacted</option>
      <option value="Follow-up">Follow-up</option>
      <option value="Quoted">Quoted</option>
      <option value="Booked">Booked</option>
      <option value="Completed">Completed</option>
    </select>

  </div>

</div>


          <div className="crm-table">

            {/* TABLE HEADER */}
            <div className="table-row table-head">

              <span>Customer</span>

              <span>Destination</span>

              <span>Travel Date</span>

              <span>Budget</span>

              <span>Status</span>

              <span>Action</span>

            </div>


            {/* LIVE LEADS */}
            {filteredLeads.map((lead) => (

              <div
                className="table-row"
                key={lead.id}
              >

                <span>
                  {lead.name}
                </span>

                <span>
                  {lead.destination}
                </span>

                <span>
                  {lead.date}
                </span>

                <span>
                  {lead.budget}
                </span>

                <span
                  className={`status ${
                    lead.status
                      .toLowerCase()
                      .replace(/\s+/g, '')
                  }`}
                >
                  {lead.status}
                </span>
                 <button
  onClick={() => setSelectedLead(lead)}
>
  View
</button>

<button
  className="delete-lead-btn"
  onClick={() => {
    const confirmed = window.confirm(
      `Delete ${lead.name}?`
    )

    if (confirmed) {
      updateLeads((prev) =>
        prev.filter((item) => item.id !== lead.id)
      )

      if (selectedLead?.id === lead.id) {
        setSelectedLead(null)
      }
    }
  }}
>
  Delete
</button>
              </div>

            ))}

          </div>

        </section>


        {/* =========================
            ADD LEAD MODAL
        ========================= */}
        {showLeadModal && (

          <div
            className="lead-modal-overlay"
            onClick={() =>
              setShowLeadModal(false)
            }
          >

            <div
              className="lead-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}
              <div className="lead-modal-header">

                <div>

                  <h2>
                    Add New Lead
                  </h2>

                  <p>
                    Create a new customer enquiry.
                  </p>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowLeadModal(false)
                  }
                >
                  ×
                </button>

              </div>


              {/* FORM */}
              <form
                className="lead-form"
                onSubmit={handleSaveLead}
              >

                {/* CUSTOMER NAME */}
                <label>

                  Customer Name

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                  />

                </label>


                {/* PHONE */}
                <label>

                  Phone Number

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                  />

                </label>


                {/* DESTINATION */}
                <label>

                  Destination

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Goa / Kerala / Bali..."
                    required
                  />

                </label>


                {/* DATE + TRAVELLERS */}
                <div className="form-row">

                  <label>

                    Travel Date

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />

                  </label>


                  <label>

                    Travellers

                    <input
                      type="number"
                      name="travellers"
                      min="1"
                      value={formData.travellers}
                      onChange={handleInputChange}
                    />

                  </label>

                </div>


                {/* BUDGET */}
                <label>

                  Budget

                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="50000"
                  />

                </label>


                {/* NOTES */}
                <label>

                  Notes

                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Customer requirements..."
                  />

                </label>


                {/* ACTIONS */}
                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setShowLeadModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-lead-btn"
                  >
                    Save Lead
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}
{/* =========================
    LEAD DETAILS MODAL
========================= */}
{selectedLead && (
  <div
    className="lead-modal-overlay"
    onClick={() => setSelectedLead(null)}
  >
    <div
      className="lead-details-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="lead-modal-header">

        <div>
          <span className="lead-details-label">
            LEAD DETAILS
          </span>

          <h2>
            {selectedLead.name}
          </h2>

          <p>
            {selectedLead.destination} • {selectedLead.date}
          </p>
        </div>

        <button
          className="modal-close"
          onClick={() => setSelectedLead(null)}
        >
          ×
        </button>

      </div>


      {/* STATUS */}
      <div className="lead-detail-status">

        <span>Status</span>

        <select
          value={selectedLead.status}
          onChange={(e) => {
            const newStatus = e.target.value

            updateLeads((prev) =>
              prev.map((lead) =>
                lead.id === selectedLead.id
                  ? {
                      ...lead,
                      status: newStatus,
                    }
                  : lead
              )
            )

            setSelectedLead((prev) => ({
              ...prev,
              status: newStatus,
            }))
          }}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Quoted">Quoted</option>
          <option value="Booked">Booked</option>
          <option value="Completed">Completed</option>
        </select>

      </div>


      {/* CUSTOMER INFO */}
      <div className="lead-info-grid">

        <div className="lead-info-box">

          <span>Customer</span>

          <strong>
            {selectedLead.name}
          </strong>

        </div>


        <div className="lead-info-box">

          <span>Phone</span>

          <strong>
            {selectedLead.phone}
          </strong>

        </div>


        <div className="lead-info-box">

          <span>Destination</span>

          <strong>
            {selectedLead.destination}
          </strong>

        </div>


        <div className="lead-info-box">

          <span>Travel Date</span>

          <strong>
            {selectedLead.date}
          </strong>

        </div>


        <div className="lead-info-box">

          <span>Budget</span>

          <strong>
            {selectedLead.budget}
          </strong>

        </div>

      </div>


      {/* ACTION BUTTONS */}
      <div className="lead-action-buttons">

        <a
          href={`tel:${selectedLead.phone}`}
          className="lead-action call"
        >
          📞 Call
        </a>

        <a
          href={`https://wa.me/${selectedLead.phone.replace(
            /\D/g,
            ''
          )}`}
          target="_blank"
          rel="noreferrer"
          className="lead-action whatsapp"
        >
          💬 WhatsApp
        </a>

      </div>


      {/* FOLLOW UP */}
      <div className="followup-box">

        <div>
          <span>Next Follow-up</span>

          <strong>
            Schedule follow-up
          </strong>
        </div>

        <input
          type="date"
          onChange={(e) => {
            updateLeads((prev) =>
              prev.map((lead) =>
                lead.id === selectedLead.id
                  ? {
                      ...lead,
                      followUp: e.target.value,
                    }
                  : lead
              )
            )

            setSelectedLead((prev) => ({
              ...prev,
              followUp: e.target.value,
            }))
          }}
        />

      </div>


      {/* NOTES */}
      <div className="lead-notes">

        <span>Notes</span>

        <p>
          Customer enquiry for{' '}
          <strong>
            {selectedLead.destination}
          </strong>
          . Follow up with package details
          and availability.
        </p>

      </div>


      {/* FOOTER */}
         <div className="lead-details-footer">

  <button
    className="cancel-btn"
    onClick={() => setSelectedLead(null)}
  >
    Close
  </button>

  <button
    className="save-lead-btn"
    onClick={() => setShowEditModal(true)}
  >
    ✏️ Edit Lead
  </button>

</div>
    </div>
  </div>
)}
{/* =========================
    EDIT LEAD MODAL
========================= */}
{showEditModal && selectedLead && (

  <div
    className="lead-modal-overlay"
    onClick={() => setShowEditModal(false)}
  >

    <div
      className="lead-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="lead-modal-header">

        <div>
          <h2>Edit Lead</h2>
          <p>Update customer information.</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setShowEditModal(false)}
        >
          ×
        </button>

      </div>


      <form
        className="lead-form"
        onSubmit={(e) => {
          e.preventDefault()

          updateLeads((prev) =>
            prev.map((lead) =>
              lead.id === selectedLead.id
                ? {
                    ...lead,
                    name: selectedLead.name,
                    phone: selectedLead.phone,
                    destination: selectedLead.destination,
                    date: selectedLead.date,
                    budget: selectedLead.budget,
                    status: selectedLead.status,
                  }
                : lead
            )
          )

          setShowEditModal(false)
        }}
      >

        <label>
          Customer Name

          <input
            type="text"
            value={selectedLead.name}
            onChange={(e) =>
              setSelectedLead({
                ...selectedLead,
                name: e.target.value,
              })
            }
            required
          />
        </label>


        <label>
          Phone Number

          <input
            type="tel"
            value={selectedLead.phone}
            onChange={(e) =>
              setSelectedLead({
                ...selectedLead,
                phone: e.target.value,
              })
            }
            required
          />
        </label>


        <label>
          Destination

          <input
            type="text"
            value={selectedLead.destination}
            onChange={(e) =>
              setSelectedLead({
                ...selectedLead,
                destination: e.target.value,
              })
            }
            required
          />
        </label>


        <label>
          Travel Date

          <input
            type="text"
            value={selectedLead.date}
            onChange={(e) =>
              setSelectedLead({
                ...selectedLead,
                date: e.target.value,
              })
            }
          />
        </label>


        <label>
          Budget

          <input
            type="text"
            value={selectedLead.budget}
            onChange={(e) =>
              setSelectedLead({
                ...selectedLead,
                budget: e.target.value,
              })
            }
          />
        </label>


        <label>
          Status

          <select
            value={selectedLead.status}
            onChange={(e) =>
              setSelectedLead({
                ...selectedLead,
                status: e.target.value,
              })
            }
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Quoted">Quoted</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
          </select>
        </label>


        <div className="modal-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-lead-btn"
          >
            Update Lead
          </button>

        </div>

      </form>

    </div>

  </div>
)}
      </main>

    </div>
  )
}