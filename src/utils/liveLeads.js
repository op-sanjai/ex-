import { useEffect, useRef, useState } from 'react'

export const LEADS_STORAGE_KEY = 'explorekey_leads'
export const LEADS_UPDATED_EVENT = 'explorekey:leads-updated'
export const STATUS_OPTIONS = ['New', 'Contacted', 'Follow-up', 'Quoted', 'Booked', 'Completed']

export const DEFAULT_LEADS = [
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

export function getStoredLeads() {
  const savedLeads = localStorage.getItem(LEADS_STORAGE_KEY)

  if (!savedLeads) {
    return []
  }

  try {
    const parsed = JSON.parse(savedLeads)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getStatusClass(status = '') {
  return String(status).toLowerCase().replace(/\s+/g, '')
}

export function formatBudget(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'number') {
    return `₹${value.toLocaleString('en-IN')}`
  }

  const asString = String(value).trim()
  if (!asString) {
    return '—'
  }

  if (asString.startsWith('₹')) {
    return asString
  }

  const numericValue = Number(asString.replace(/[^\d]/g, ''))
  if (Number.isFinite(numericValue)) {
    return `₹${numericValue.toLocaleString('en-IN')}`
  }

  return asString
}

export function normalizeLeadData(lead) {
  const numericBudget = Number(String(lead?.budget ?? '').replace(/[^\d]/g, ''))

  return {
    id: lead?.id ?? Date.now(),
    name: lead?.name || 'Customer',
    phone: lead?.phone || 'Not provided',
    destination: lead?.destination || 'Not set',
    date: lead?.date || 'Not set',
    budget: Number.isFinite(numericBudget) ? formatBudget(numericBudget) : formatBudget(lead?.budget ?? '—'),
    status: lead?.status || 'New',
    followUp: lead?.followUp || '',
    followUpNote: lead?.followUpNote || '',
    followUpCompleted: Boolean(lead?.followUpCompleted),
  }
}

export function downloadCsv(rows, filename) {
  if (!rows || rows.length === 0) {
    return
  }

  const headers = ['Name', 'Phone', 'Destination', 'Date', 'Budget', 'Status', 'Follow Up', 'Notes']
  const csvRows = [headers]

  rows.forEach((lead) => {
    csvRows.push([
      lead.name || '',
      lead.phone || '',
      lead.destination || '',
      lead.date || '',
      lead.budget || '',
      lead.status || '',
      lead.followUp || '',
      lead.followUpNote || '',
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`))
  })

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function persistLeads(leads) {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads))

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(LEADS_UPDATED_EVENT, { detail: leads })
    )
  }

  return leads
}

export function useLiveLeads(initialLeads = DEFAULT_LEADS) {
  const fallbackLeads = useRef(
    Array.isArray(initialLeads) && initialLeads.length > 0
      ? initialLeads
      : DEFAULT_LEADS
  ).current

  const [leads, setLeads] = useState(() => {
    const storedLeads = getStoredLeads()
    if (storedLeads.length > 0) {
      return storedLeads
    }

    persistLeads(fallbackLeads)
    return fallbackLeads
  })

  useEffect(() => {
    const storedLeads = getStoredLeads()
    if (storedLeads.length === 0) {
      persistLeads(fallbackLeads)
      setLeads(fallbackLeads)
      return
    }

    setLeads(storedLeads)

    const syncLeads = () => {
      setLeads(getStoredLeads())
    }

    const handleStorage = (event) => {
      if (event.key === LEADS_STORAGE_KEY) {
        syncLeads()
      }
    }

    window.addEventListener(LEADS_UPDATED_EVENT, syncLeads)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(LEADS_UPDATED_EVENT, syncLeads)
      window.removeEventListener('storage', handleStorage)
    }
  }, [fallbackLeads])

  return [leads, setLeads]
}
