export interface Chain {
  id: string
  name: string
  symbol: string
  color: string
}

export async function fetchChains(): Promise<Chain[]> {
  const res = await fetch('http://localhost:3001/api/chains')
  if (!res.ok) throw new Error(`Failed to fetch chains: ${res.status}`)
  return res.json()
}
