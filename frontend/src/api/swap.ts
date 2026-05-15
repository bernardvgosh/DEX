import { getMockSwapQuote } from './mockData'

export interface SwapQuote {
  from: string
  to: string
  amount_in: number
  amount_out: number
  rate: number
  price_impact: number
  fee_pct: number
  route: string
}

const API = import.meta.env.VITE_API_URL ?? ''

export async function fetchSwapQuote(from: string, to: string, amount: number): Promise<SwapQuote> {
  if (!API) return getMockSwapQuote(from, to, amount)
  const res = await fetch(`${API}/api/swap/quote?from=${from}&to=${to}&amount=${amount}`)
  if (!res.ok) throw new Error(`Failed to fetch quote: ${res.status}`)
  return res.json()
}
