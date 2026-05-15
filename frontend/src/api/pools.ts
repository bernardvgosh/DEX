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

export async function fetchPools(chain?: string): Promise<Pool[]> {
  const url = chain && chain !== 'all'
    ? `http://localhost:3001/api/pools?chain=${chain}`
    : 'http://localhost:3001/api/pools'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch pools: ${res.status}`)
  return res.json()
}

export async function fetchPoolDetail(id: string): Promise<PoolDetail> {
  const res = await fetch(`http://localhost:3001/api/pools/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch pool: ${res.status}`)
  return res.json()
}
