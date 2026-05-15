import { MOCK_TOKENS } from './mockData'

export interface Token {
  symbol: string
  name: string
  price: number
  change_24h: number
  chain: string
}

const API = import.meta.env.VITE_API_URL ?? ''

export async function fetchTokens(): Promise<Token[]> {
  if (!API) return MOCK_TOKENS
  const res = await fetch(`${API}/api/tokens`)
  if (!res.ok) throw new Error(`Failed to fetch tokens: ${res.status}`)
  return res.json()
}
