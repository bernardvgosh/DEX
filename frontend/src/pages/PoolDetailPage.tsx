import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { fetchPoolDetail, type HistoryPoint } from '../api/pools'
import './PoolDetailPage.css'

type ChartType = 'tvl' | 'volume'
type Range = 7 | 30

function fmtUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2,
  }).format(n)
}

function fmtPrice(n: number) {
  return n >= 1000
    ? `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}>
      <div style={{ color: 'var(--accent2)', fontWeight: 600 }}>{fmtUSD(payload[0].value)}</div>
      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Day {payload[0].payload.day}</div>
    </div>
  )
}

export function PoolDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [chartType, setChartType] = useState<ChartType>('tvl')
  const [range, setRange] = useState<Range>(30)

  const { data, isLoading, error } = useQuery({
    queryKey: ['pool', id],
    queryFn: () => fetchPoolDetail(id!),
    enabled: !!id,
  })

  if (isLoading) return <p style={{ color: 'var(--muted)' }}>Loading pool…</p>
  if (error || !data) return <p style={{ color: 'var(--red)' }}>Pool not found.</p>

  const { pool, history, transactions } = data
  const chartData: HistoryPoint[] = history.slice(-range)
  const dataKey = chartType === 'tvl' ? 'tvl' : 'volume'

  // mock 24h change for tokens (±5%)
  const changeA = ((pool.token_a.charCodeAt(0) % 10) - 4) * 1.2
  const changeB = ((pool.token_b.charCodeAt(0) % 10) - 5) * 0.9

  return (
    <div>
      {/* Header */}
      <div className="detail-header">
        <div className="detail-pair">
          <div className="detail-pair-icons">
            <div className="detail-pair-icon">{pool.token_a[0]}</div>
            <div className="detail-pair-icon">{pool.token_b[0]}</div>
          </div>
          <div>
            <div className="detail-pair-name">{pool.token_a} / {pool.token_b}</div>
            <div className="detail-pair-meta">
              <span className="chain-badge">{pool.chain}</span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Fee {(pool.fee * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <Link to="/pools" className="back-btn">← Back to Pools</Link>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">TVL</div>
          <div className="stat-value">{fmtUSD(pool.tvl)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Volume 24h</div>
          <div className="stat-value">{fmtUSD(pool.volume_24h)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">APY</div>
          <div className="stat-value positive">{pool.apy.toFixed(1)}%</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Fee Tier</div>
          <div className="stat-value">{(pool.fee * 100).toFixed(2)}%</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card chart-section">
        <div className="chart-toolbar">
          <div className="chart-type-tabs">
            {(['tvl', 'volume'] as ChartType[]).map((t) => (
              <button key={t} className={`chart-tab${chartType === t ? ' active' : ''}`} onClick={() => setChartType(t)}>
                {t === 'tvl' ? 'TVL' : 'Volume'}
              </button>
            ))}
          </div>
          <div className="chart-range-tabs">
            {([7, 30] as Range[]).map((r) => (
              <button key={r} className={`chart-tab${range === r ? ' active' : ''}`} onClick={() => setRange(r)}>
                {r}D
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252840" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={dataKey} stroke="#7c3aed" strokeWidth={2}
              fill="url(#areaGrad)" dot={false} activeDot={{ r: 4, fill: '#a78bfa' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Token cards */}
      <div className="token-cards">
        {[
          { symbol: pool.token_a, price: pool.token_a_price, change: changeA },
          { symbol: pool.token_b, price: pool.token_b_price, change: changeB },
        ].map((t) => (
          <div key={t.symbol} className="token-card">
            <div className="token-card-icon">{t.symbol[0]}</div>
            <div>
              <div className="token-card-name">{t.symbol}</div>
              <div className="token-card-price">{fmtPrice(t.price)}</div>
              <div className={`token-card-change ${t.change >= 0 ? 'positive' : 'negative'}`}>
                {t.change >= 0 ? '+' : ''}{t.change.toFixed(2)}% 24h
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Recent Transactions</div>
        <table className="txn-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount (USD)</th>
              <th>Wallet</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i}>
                <td className={tx.type === 'Buy' ? 'txn-buy' : 'txn-sell'}>{tx.type}</td>
                <td>{fmtUSD(tx.amount_usd)}</td>
                <td className="txn-wallet">{tx.wallet}</td>
                <td className="txn-time">{tx.mins_ago}m ago</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
