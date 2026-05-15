import { MOCK_CHAINS } from './mockData'

export interface Chain {
  id: string
  name: string
  symbol: string
  color: string
}

const API = import.meta.env.VITE_API_URL ?? ''

export async function fetchChains(): Promise<Chain[]> {
  if (!API) return MOCK_CHAINS
  const res = await fetch(`${API}/api/chains`)
  if (!res.ok) throw new Error(`Failed to fetch chains: ${res.status}`)
  return res.json()
}
