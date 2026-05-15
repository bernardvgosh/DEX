import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPools } from '../api/pools'
import { fetchTokens } from '../api/tokens'
import { MOCK_POOLS } from '../api/mockData'
import './HomePage.css'

const CHAIN_INFO = [
  { id: 'solana',   name: 'Solana',   color: '#9945FF' },
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#12AAFF' },
  { id: 'bsc',      name: 'BSC',      color: '#F0B90B' },
]

function fmtUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2,
  }).format(n)
}

const RECENT_ACTIVITY = [
  { type: 'Buy',  pair: 'SOL/USDC',  amount: '$12,400', time: '1m ago' },
  { type: 'Sell', pair: 'ETH/USDC',  amount: '$8,200',  time: '2m ago' },
  { type: 'Buy',  pair: 'BNB/USDT',  amount: '$3,150',  time: '4m ago' },
  { type: 'Buy',  pair: 'ARB/USDC',  amount: '$920',    time: '5m ago' },
  { type: 'Sell', pair: 'CAKE/BNB',  amount: '$2,780',  time: '7m ago' },
]

export function HomePage() {
  const navigate = useNavigate()

  const { data: pools = MOCK_POOLS } = useQuery({
    queryKey: ['pools'],
    queryFn: () => fetchPools(),
  })

  const { data: tokens = [] } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
  })

  const totalTVL    = pools.reduce((s, p) => s + p.tvl, 0)
  const totalVol24h = pools.reduce((s, p) => s + p.volume_24h, 0)
  const topPools    = [...pools].sort((a, b) => b.tvl - a.tvl).slice(0, 5)

  const chainStats = CHAIN_INFO.map((c) => {
    const cp = pools.filter((p) => p.chain === c.id)
    return { ...c, count: cp.length, tvl: cp.reduce((s, p) => s + p.tvl, 0) }
  })

  const ethToken = tokens.find((t) => t.symbol === 'ETH')
  const solToken = tokens.find((t) => t.symbol === 'SOL')

  return (
    <div>
      {/* Hero */}
      <div className="home-hero">
        <div className="hero-glow" />
        <div className="hero-glow-right" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Live on 4 chains
          </div>
          <h1 className="hero-title">
            Trade Any Token.<br />
            <span>Any Chain. Instantly.</span>
          </h1>
          <p className="hero-sub">
            DEXO is the fastest multi-chain DEX — swap tokens, provide liquidity,
            and earn yield across Solana, Ethereum, Arbitrum and BSC.
          </p>
          <div className="hero-ctas">
            <Link to="/swap" className="btn-primary">⇄ Start Trading</Link>
            <Link to="/pools" className="btn-ghost">◈ Explore Pools</Link>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-cell">
          <div className="stat-cell-label">Total Value Locked</div>
          <div className="stat-cell-value">{fmtUSD(totalTVL)}</div>
          <div className="stat-cell-change positive">↑ +3.2% this week</div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell-label">24h Volume</div>
          <div className="stat-cell-value">{fmtUSD(totalVol24h)}</div>
          <div className="stat-cell-change positive">↑ +8.7% vs yesterday</div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell-label">Active Pools</div>
          <div className="stat-cell-value">{pools.length}</div>
          <div className="stat-cell-change" style={{ color: 'var(--muted)' }}>Across 4 chains</div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell-label">Avg. APY</div>
          <div className="stat-cell-value positive">
            {(pools.reduce((s, p) => s + p.apy, 0) / pools.length).toFixed(1)}%
          </div>
          <div className="stat-cell-change" style={{ color: 'var(--muted)' }}>Across all pools</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="home-main-grid">
        {/* Left — top pools */}
        <div>
          <div className="section-hdr">
            <span className="section-hdr-title">Top Pools by TVL</span>
            <Link to="/pools" className="see-all">See all pools →</Link>
          </div>
          <div className="top-pools-card">
            <table className="top-pools-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pool</th>
                  <th>Chain</th>
                  <th>TVL</th>
                  <th>Volume 24h</th>
                  <th>APY</th>
                </tr>
              </thead>
              <tbody>
                {topPools.map((pool, i) => (
                  <tr key={pool.id} onClick={() => navigate(`/pools/${pool.id}`)}>
                    <td><div className="pool-rank">{i + 1}</div></td>
                    <td>
                      <div className="mini-pair">
                        <div className="mini-icons">
                          <div className="mini-icon">{pool.token_a[0]}</div>
                          <div className="mini-icon">{pool.token_b[0]}</div>
                        </div>
                        <span className="mini-pair-name">{pool.token_a}/{pool.token_b}</span>
                      </div>
                    </td>
                    <td><span className="chain-badge">{pool.chain}</span></td>
                    <td style={{ fontWeight: 600 }}>{fmtUSD(pool.tvl)}</td>
                    <td style={{ color: 'var(--muted)' }}>{fmtUSD(pool.volume_24h)}</td>
                    <td><span className="apy-value positive">{pool.apy.toFixed(1)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent activity */}
          <div style={{ marginTop: 20 }}>
            <div className="section-hdr">
              <span className="section-hdr-title">Recent Activity</span>
              <span style={{ fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
                Live
              </span>
            </div>
            <div className="activity-card">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="activity-row">
                  <span className={`activity-type ${a.type === 'Buy' ? 'act-buy' : 'act-sell'}`}>{a.type}</span>
                  <span className="activity-pair">{a.pair}</span>
                  <span className="activity-amt">{a.amount}</span>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="home-sidebar">
          {/* Quick swap */}
          <div className="quick-swap">
            <div className="quick-swap-title">Quick Swap</div>
            <div className="qs-box">
              <div className="qs-label">You pay</div>
              <div className="qs-row">
                <div className="qs-token">
                  <div className="qs-icon">E</div>
                  ETH
                </div>
                <div className="qs-price">{ethToken ? `$${ethToken.price.toLocaleString()}` : '—'}</div>
              </div>
            </div>
            <div className="qs-divider"><div className="qs-arrow">⇅</div></div>
            <div className="qs-box">
              <div className="qs-label">You receive</div>
              <div className="qs-row">
                <div className="qs-token">
                  <div className="qs-icon">U</div>
                  USDC
                </div>
                <div className="qs-price">$1.00</div>
              </div>
            </div>
            <Link to="/swap" className="qs-cta">Open Swap →</Link>
          </div>

          {/* Chains */}
          <div className="chains-card">
            <div className="section-hdr" style={{ marginBottom: 12 }}>
              <span className="section-hdr-title">Supported Chains</span>
            </div>
            <div className="chain-list">
              {chainStats.map((c) => (
                <Link key={c.id} to={`/pools`} className="chain-row">
                  <span className="chain-dot" style={{ background: c.color, color: c.color }} />
                  <span className="chain-row-name">{c.name}</span>
                  <span className="chain-row-tvl">{fmtUSD(c.tvl)}</span>
                  <span className="chain-row-pools">{c.count} pools</span>
                </Link>
              ))}
            </div>
          </div>

          {/* SOL price card */}
          {solToken && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #9945FF, #60a5fa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>S</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Solana</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>${solToken.price.toLocaleString()}</div>
              </div>
              <div className={solToken.change_24h >= 0 ? 'positive' : 'negative'}
                style={{ fontWeight: 700, fontSize: 14 }}>
                {solToken.change_24h >= 0 ? '+' : ''}{solToken.change_24h.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
