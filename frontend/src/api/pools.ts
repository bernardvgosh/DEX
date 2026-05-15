import { MOCK_POOLS, getMockPoolDetail } from './mockData'

export interface Pool {
  id: string
  chain: string
  token_a: string
  token_b: string
  token_a_price: number
  token_b_price: number
  liquidity: number
  tvl: number
  volume_24h: number
  fee: number
  apy: number
}

export interface HistoryPoint {
  day: number
  tvl: number
  volume: number
}

export interface Transaction {
  type: 'Buy' | 'Sell'
  amount_usd: number
  wallet: string
  mins_ago: number
}

export interface PoolDetail {
  pool: Pool
  history: HistoryPoint[]
  transactions: Transaction[]
}

const API = import.meta.env.VITE_API_URL ?? ''

export async function fetchPools(chain?: string): Promise<Pool[]> {
  if (!API) {
    return chain && chain !== 'all'
      ? MOCK_POOLS.filter((p) => p.chain === chain)
      : MOCK_POOLS
  }
  const url = chain && chain !== 'all'
    ? `${API}/api/pools?chain=${chain}`
    : `${API}/api/pools`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch pools: ${res.status}`)
  return res.json()
}

export async function fetchPoolDetail(id: string): Promise<PoolDetail> {
  if (!API) {
    const detail = getMockPoolDetail(id)
    if (!detail) throw new Error('Pool not found')
    return detail
  }
  const res = await fetch(`${API}/api/pools/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch pool: ${res.status}`)
  return res.json()
}
