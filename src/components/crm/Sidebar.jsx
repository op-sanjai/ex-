import { useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { pathname } = useLocation()

  const isDashboard = pathname === '/crm' || pathname === '/crm/'
  const isLeads = pathname === '/crm/leads'
  const isFollowups = pathname === '/crm/followups'
  const isBookings = pathname === '/crm/bookings'
  const isCustomers = pathname === '/crm/customers'
  const isMessages = pathname === '/crm/messages'
  const isReports = pathname === '/crm/reports'

  return (
    <aside className="crm-sidebar">
      <div className="crm-logo">
        <h2>ExploreKey</h2>
        <span>HOLIDAYS</span>
        <small>Unlock Your Perfect Journey</small>
      </div>

      <nav>
        <a href="/crm" className={isDashboard ? 'active' : ''}>⌂ Dashboard</a>
        <a href="/crm/leads" className={isLeads ? 'active' : ''}>♙ Leads</a>
        <a href="/crm/followups" className={isFollowups ? 'active' : ''}>◷ Follow-ups</a>
        <a href="/crm/bookings" className={isBookings ? 'active' : ''}>▣ Bookings <b>31</b></a>
        <a href="/crm/customers" className={isCustomers ? 'active' : ''}>♙ Customers</a>
        <a href="/crm/messages" className={isMessages ? 'active' : ''}>◉ Messages</a>
        <a href="/crm/reports" className={isReports ? 'active' : ''}>▥ Reports</a>
        <a>⚙ Settings</a>
      </nav>
    </aside>
  )
}