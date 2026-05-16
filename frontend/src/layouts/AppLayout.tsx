import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Ticker } from '../components/Ticker'
import { ChainSelector } from '../components/ChainSelector'
import './AppLayout.css'

const NAV = [
  { to: '/pools',     label: 'Pools',     icon: '◈' },
  { to: '/swap',      label: 'Swap',      icon: '⇄' },
  { to: '/liquidity', label: 'Liquidity', icon: '≋' },
]

const PAGE_TITLES: Record<string, string> = {
  '/pools':     'Liquidity Pools',
  '/swap':      'Swap',
  '/liquidity': 'Liquidity',
}

export function AppLayout() {
  const { pathname } = useLocation()
  const title = pathname.startsWith('/pools/')
    ? 'Pool Detail'
    : (PAGE_TITLES[pathname] ?? 'DEXO')

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>DEXO</h2>
          <span>Multi-Chain DEX</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <Ticker />
        <div className="top-header">
          <span className="page-title">{title}</span>
          {pathname === '/pools' && <ChainSelector />}
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
