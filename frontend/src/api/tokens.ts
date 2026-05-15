export interface Token {
  symbol: string
  name: string
  price: number
  change_24h: number
  chain: string
}

export async function fetchTokens(): Promise<Token[]> {
  const res = await fetch('http://localhost:3001/api/tokens')
  if (!res.ok) throw new Error(`Failed to fetch tokens: ${res.status}`)
  return res.json()
}
