import { useEffect, useState } from 'react'
import { fetchPools, type Pool } from '../api/pools'
import './PoolList.css'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(n)
}

export function PoolList() {
  const [pools, setPools] = useState<Pool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPools()
      .then(setPools)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="pool-status">Loading pools…</p>
  if (error) return <p className="pool-status pool-error">Error: {error}</p>

  return (
    <div className="pool-list">
      <h1>Liquidity Pools</h1>
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Liquidity</th>
            <th>Volume (24h)</th>
            <th>Fee</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr key={pool.id}>
              <td className="pool-pair">
                {pool.token_a} / {pool.token_b}
              </td>
              <td>{fmt(pool.liquidity)}</td>
              <td>{fmt(pool.volume_24h)}</td>
              <td>{(pool.fee * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
