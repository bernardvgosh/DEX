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

export async function fetchSwapQuote(from: string, to: string, amount: number): Promise<SwapQuote> {
  const res = await fetch(
    `http://localhost:3001/api/swap/quote?from=${from}&to=${to}&amount=${amount}`
  )
  if (!res.ok) throw new Error(`Failed to fetch quote: ${res.status}`)
  return res.json()
}
