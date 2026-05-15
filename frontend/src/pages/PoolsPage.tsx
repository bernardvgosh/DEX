import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPools, type Pool } from '../api/pools'
import { useChain } from '../components/ChainSelector'
import './PoolsPage.css'

type SortKey = 'tvl' | 'volume_24h' | 'apy' | 'fee'

function fmtUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2,
  }).format(n)
}

export function PoolsPage() {
  const navigate = useNavigate()
  const { chain } = useChain()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('tvl')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

  const { data: pools = [], isLoading, error } = useQuery({
    queryKey: ['pools', chain],
    queryFn: () => fetchPools(chain),
  })

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...pools]
    .filter((p: Pool) => {
      const q = search.toLowerCase()
      return p.token_a.toLowerCase().includes(q) || p.token_b.toLowerCase().includes(q)
    })
    .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey])

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return ' ↕'
    return sortDir === 'desc' ? ' ↓' : ' ↑'
  }

  if (isLoading) return <p style={{ color: 'var(--muted)' }}>Loading pools…</p>
  if (error) return <p style={{ color: 'var(--red)' }}>Error loading pools.</p>

  return (
    <div>
      <div className="pools-toolbar">
        <input
          className="search-input"
          placeholder="Search by token…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="sort-select" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
          <option value="tvl">Sort: TVL</option>
          <option value="volume_24h">Sort: Volume 24h</option>
          <option value="apy">Sort: APY</option>
          <option value="fee">Sort: Fee</option>
        </select>
      </div>

      <div className="card pools-table-wrap">
        {sorted.length === 0 ? (
          <div className="empty-state">No pools found.</div>
        ) : (
          <table className="pools-table">
            <thead>
              <tr>
                <th>Pool</th>
                <th>Chain</th>
                <th className="sortable" onClick={() => handleSort('tvl')}>TVL{sortIcon('tvl')}</th>
                <th className="sortable" onClick={() => handleSort('volume_24h')}>Volume 24h{sortIcon('volume_24h')}</th>
                <th className="sortable" onClick={() => handleSort('apy')}>APY{sortIcon('apy')}</th>
                <th className="sortable" onClick={() => handleSort('fee')}>Fee{sortIcon('fee')}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((pool) => (
                <tr key={pool.id} onClick={() => navigate(`/pools/${pool.id}`)}>
                  <td>
                    <div className="pair-cell">
                      <div className="pair-icons">
                        <div className="pair-icon">{pool.token_a[0]}</div>
                        <div className="pair-icon">{pool.token_b[0]}</div>
                      </div>
                      <span className="pair-name">{pool.token_a} / {pool.token_b}</span>
                    </div>
                  </td>
                  <td><span className="chain-badge">{pool.chain}</span></td>
                  <td>{fmtUSD(pool.tvl)}</td>
                  <td>{fmtUSD(pool.volume_24h)}</td>
                  <td><span className="apy-value">{pool.apy.toFixed(1)}%</span></td>
                  <td>{(pool.fee * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
