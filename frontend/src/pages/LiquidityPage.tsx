import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPools, type Pool } from '../api/pools'
import './LiquidityPage.css'

const MOCK_POSITIONS = [
  { poolId: 'sol-usdc-1', lpTokens: 142.5, valueUSD: 2840 },
  { poolId: 'eth-usdc-1', lpTokens: 0.031, valueUSD: 1250 },
]

function fmtUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2,
  }).format(n)
}

function AddTab({ pools }: { pools: Pool[] }) {
  const [selectedId, setSelectedId] = useState(pools[0]?.id ?? '')
  const [amountA, setAmountA] = useState('')

  const pool = pools.find((p) => p.id === selectedId)

  const ratio = pool ? pool.token_b_price / pool.token_a_price : 1
  const numA = parseFloat(amountA) || 0
  const amountB = numA > 0 ? (numA * ratio).toFixed(4) : ''

  const usdValueA = numA * (pool?.token_a_price ?? 1)
  const usdValueB = parseFloat(amountB) * (pool?.token_b_price ?? 1)
  const totalUSD = usdValueA + usdValueB
  const poolShare = pool ? (totalUSD / pool.tvl) * 100 : 0
  const estimatedLP = totalUSD > 0 ? (totalUSD / 10).toFixed(4) : '—'

  return (
    <div>
      <select className="pool-select" value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setAmountA('') }}>
        {pools.map((p) => (
          <option key={p.id} value={p.id}>{p.token_a} / {p.token_b} ({p.chain})</option>
        ))}
      </select>

      {pool && (
        <>
          <div className="dual-inputs">
            <div className="liq-input-box">
              <div className="liq-input-label">{pool.token_a} amount</div>
              <div className="liq-input-row">
                <input
                  className="liq-amount-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={amountA}
                  onChange={(e) => setAmountA(e.target.value)}
                />
                <span className="liq-token-label">{pool.token_a}</span>
              </div>
            </div>
            <div className="plus-divider">+</div>
            <div className="liq-input-box">
              <div className="liq-input-label">{pool.token_b} amount (auto-balanced)</div>
              <div className="liq-input-row">
                <input className="liq-amount-input" readOnly placeholder="0" value={amountB} />
                <span className="liq-token-label">{pool.token_b}</span>
              </div>
            </div>
          </div>

          {totalUSD > 0 && (
            <div className="liq-preview">
              <div className="liq-preview-row">
                <span className="liq-preview-label">Total value</span>
                <span className="liq-preview-value">{fmtUSD(totalUSD)}</span>
              </div>
              <div className="liq-preview-row">
                <span className="liq-preview-label">Share of pool</span>
                <span className="liq-preview-value">{poolShare.toFixed(4)}%</span>
              </div>
              <div className="liq-preview-row">
                <span className="liq-preview-label">Estimated LP tokens</span>
                <span className="liq-preview-value">{estimatedLP}</span>
              </div>
              <div className="liq-preview-row">
                <span className="liq-preview-label">Pool APY</span>
                <span className="liq-preview-value positive">{pool.apy.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </>
      )}

      <button className="liq-cta" disabled>Connect Wallet to Add Liquidity</button>
    </div>
  )
}

function RemoveTab({ pools }: { pools: Pool[] }) {
  const [selectedId, setSelectedId] = useState(MOCK_POSITIONS[0]?.poolId ?? '')
  const [pct, setPct] = useState(50)

  const position = MOCK_POSITIONS.find((p) => p.poolId === selectedId)
  const pool = pools.find((p) => p.id === selectedId)

  const receiveUSD = (position?.valueUSD ?? 0) * (pct / 100)
  const receiveA = pool ? (receiveUSD / 2 / pool.token_a_price).toFixed(4) : '—'
  const receiveB = pool ? (receiveUSD / 2 / pool.token_b_price).toFixed(6) : '—'

  return (
    <div>
      <select className="pool-select" value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setPct(50) }}>
        {MOCK_POSITIONS.map((pos) => {
          const p = pools.find((pl) => pl.id === pos.poolId)
          return (
            <option key={pos.poolId} value={pos.poolId}>
              {p ? `${p.token_a} / ${p.token_b}` : pos.poolId} — {fmtUSD(pos.valueUSD)}
            </option>
          )
        })}
      </select>

      {position && pool && (
        <>
          <div className="remove-slider-wrap">
            <div className="slider-pct">{pct}%</div>
            <div className="pct-btns">
              {[25, 50, 75, 100].map((v) => (
                <button key={v} className={`pct-btn${pct === v ? ' active' : ''}`} onClick={() => setPct(v)}>
                  {v}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
            />
          </div>

          <div className="liq-preview">
            <div className="liq-preview-row">
              <span className="liq-preview-label">You receive ({pool.token_a})</span>
              <span className="liq-preview-value">{receiveA} {pool.token_a}</span>
            </div>
            <div className="liq-preview-row">
              <span className="liq-preview-label">You receive ({pool.token_b})</span>
              <span className="liq-preview-value">{receiveB} {pool.token_b}</span>
            </div>
            <div className="liq-preview-row">
              <span className="liq-preview-label">Total value</span>
              <span className="liq-preview-value">{fmtUSD(receiveUSD)}</span>
            </div>
            <div className="liq-preview-row">
              <span className="liq-preview-label">LP tokens burned</span>
              <span className="liq-preview-value">{(position.lpTokens * pct / 100).toFixed(4)}</span>
            </div>
          </div>
        </>
      )}

      <button className="liq-cta" disabled>Connect Wallet to Remove Liquidity</button>
    </div>
  )
}

export function LiquidityPage() {
  const [tab, setTab] = useState<'add' | 'remove'>('add')
  const { data: pools = [], isLoading } = useQuery({ queryKey: ['pools'], queryFn: () => fetchPools() })

  if (isLoading) return <p style={{ color: 'var(--muted)' }}>Loading…</p>

  return (
    <div className="liquidity-wrap">
      <div className="liq-tabs">
        <button className={`liq-tab${tab === 'add' ? ' active' : ''}`} onClick={() => setTab('add')}>Add Liquidity</button>
        <button className={`liq-tab${tab === 'remove' ? ' active' : ''}`} onClick={() => setTab('remove')}>Remove Liquidity</button>
      </div>
      <div className="card">
        {tab === 'add' ? <AddTab pools={pools} /> : <RemoveTab pools={pools} />}
      </div>
    </div>
  )
}
