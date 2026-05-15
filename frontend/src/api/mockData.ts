import type { Chain } from './chains'
import type { Token } from './tokens'
import type { Pool, PoolDetail, HistoryPoint, Transaction } from './pools'

export const MOCK_CHAINS: Chain[] = [
  { id: 'solana',   name: 'Solana',   symbol: 'SOL', color: '#9945FF' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#12AAFF' },
  { id: 'bsc',      name: 'BSC',      symbol: 'BNB', color: '#F0B90B' },
]

export const MOCK_TOKENS: Token[] = [
  { symbol: 'BTC',  name: 'Bitcoin',     price: 103240.50, change_24h:  1.24, chain: 'ethereum' },
  { symbol: 'ETH',  name: 'Ethereum',    price:   3841.20, change_24h: -0.38, chain: 'ethereum' },
  { symbol: 'SOL',  name: 'Solana',      price:    178.45, change_24h:  2.15, chain: 'solana'   },
  { symbol: 'ARB',  name: 'Arbitrum',    price:      1.23, change_24h:  0.87, chain: 'arbitrum' },
  { symbol: 'BNB',  name: 'BNB',         price:    612.80, change_24h:  0.42, chain: 'bsc'      },
  { symbol: 'USDC', name: 'USD Coin',    price:      1.00, change_24h:  0.01, chain: 'ethereum' },
  { symbol: 'USDT', name: 'Tether',      price:      1.00, change_24h: -0.01, chain: 'ethereum' },
  { symbol: 'RAY',  name: 'Raydium',     price:      4.85, change_24h:  3.20, chain: 'solana'   },
  { symbol: 'JUP',  name: 'Jupiter',     price:      1.42, change_24h:  1.95, chain: 'solana'   },
  { symbol: 'CAKE', name: 'PancakeSwap', price:      3.18, change_24h: -1.10, chain: 'bsc'      },
  { symbol: 'UNI',  name: 'Uniswap',     price:     12.40, change_24h:  0.55, chain: 'ethereum' },
  { symbol: 'WBTC', name: 'Wrapped BTC', price: 103180.00, change_24h:  1.20, chain: 'ethereum' },
]

export const MOCK_POOLS: Pool[] = [
  { id: 'sol-usdc-1',   chain: 'solana',   token_a: 'SOL',  token_b: 'USDC', token_a_price: 178.45,    token_b_price: 1.00,      liquidity: 18_450_000, tvl: 18_450_000, volume_24h: 4_320_000,  fee: 0.0025, apy: 14.2 },
  { id: 'sol-ray-1',    chain: 'solana',   token_a: 'SOL',  token_b: 'RAY',  token_a_price: 178.45,    token_b_price: 4.85,      liquidity:  6_200_000, tvl:  6_200_000, volume_24h:   980_000,  fee: 0.003,  apy: 18.7 },
  { id: 'jup-usdc-1',   chain: 'solana',   token_a: 'JUP',  token_b: 'USDC', token_a_price:   1.42,    token_b_price: 1.00,      liquidity:  3_100_000, tvl:  3_100_000, volume_24h:   540_000,  fee: 0.003,  apy: 22.4 },
  { id: 'eth-usdc-1',   chain: 'ethereum', token_a: 'ETH',  token_b: 'USDC', token_a_price: 3841.20,   token_b_price: 1.00,      liquidity: 42_800_000, tvl: 42_800_000, volume_24h: 12_600_000, fee: 0.003,  apy:  8.9 },
  { id: 'eth-wbtc-1',   chain: 'ethereum', token_a: 'ETH',  token_b: 'WBTC', token_a_price: 3841.20,   token_b_price: 103180.00, liquidity: 28_500_000, tvl: 28_500_000, volume_24h:  7_200_000, fee: 0.003,  apy:  6.1 },
  { id: 'uni-usdc-1',   chain: 'ethereum', token_a: 'UNI',  token_b: 'USDC', token_a_price:  12.40,    token_b_price: 1.00,      liquidity:  9_400_000, tvl:  9_400_000, volume_24h:  2_100_000, fee: 0.003,  apy: 11.3 },
  { id: 'eth-usdc-arb', chain: 'arbitrum', token_a: 'ETH',  token_b: 'USDC', token_a_price: 3841.20,   token_b_price: 1.00,      liquidity: 14_200_000, tvl: 14_200_000, volume_24h:  3_800_000, fee: 0.0025, apy: 12.6 },
  { id: 'arb-usdc-1',   chain: 'arbitrum', token_a: 'ARB',  token_b: 'USDC', token_a_price:    1.23,   token_b_price: 1.00,      liquidity:  5_600_000, tvl:  5_600_000, volume_24h:  1_400_000, fee: 0.003,  apy: 19.8 },
  { id: 'bnb-usdt-1',   chain: 'bsc',      token_a: 'BNB',  token_b: 'USDT', token_a_price:  612.80,   token_b_price: 1.00,      liquidity: 22_300_000, tvl: 22_300_000, volume_24h:  5_900_000, fee: 0.002,  apy:  9.4 },
  { id: 'cake-bnb-1',   chain: 'bsc',      token_a: 'CAKE', token_b: 'BNB',  token_a_price:    3.18,   token_b_price: 612.80,    liquidity:  8_100_000, tvl:  8_100_000, volume_24h:  2_300_000, fee: 0.0025, apy: 31.5 },
]

function generateHistory(poolId: string): HistoryPoint[] {
  const seed = poolId.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const baseMap: Record<string, number> = {
    'eth-usdc-1': 42_000_000, 'bnb-usdt-1': 22_000_000, 'sol-usdc-1': 18_000_000,
    'eth-wbtc-1': 28_000_000, 'eth-usdc-arb': 14_000_000, 'uni-usdc-1': 9_000_000,
    'sol-ray-1': 6_000_000, 'arb-usdc-1': 5_500_000, 'jup-usdc-1': 3_000_000, 'cake-bnb-1': 8_000_000,
  }
  const baseTvl = baseMap[poolId] ?? 5_000_000

  return Array.from({ length: 30 }, (_, i) => {
    const day = 29 - i
    // deterministic pseudo-random variation ±8%
    const r = ((seed * 1664525 + i * 1013904223) >>> 0) / 0xffffffff
    const tvl = Math.round(baseTvl * (0.92 + r * 0.16) * 100) / 100
    const volR = ((seed * 22695477 + i * 1) >>> 0) % 100
    const volume = Math.round(tvl * (0.08 + volR / 1000) * 100) / 100
    return { day, tvl, volume }
  })
}

const WALLETS = [
  '7xKX...3mPq','Bz9R...4nWs','3aLM...9kTv','FqP2...7jYu',
  '9wCN...2hRe','KmD4...5oAb','1sQT...8pLx','Gh6V...0cFd',
]

function generateTransactions(poolId: string): Transaction[] {
  const seed = poolId.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return Array.from({ length: 10 }, (_, i) => {
    const r = ((seed * 1664525 + i * 1013904223) >>> 0)
    return {
      type: r % 2 === 0 ? 'Buy' : 'Sell',
      amount_usd: Math.round((500 + (r % 50000)) * 100) / 100,
      wallet: WALLETS[r % WALLETS.length],
      mins_ago: 2 + (r % 120),
    }
  })
}

export function getMockPoolDetail(id: string): PoolDetail | null {
  const pool = MOCK_POOLS.find((p) => p.id === id)
  if (!pool) return null
  return {
    pool,
    history: generateHistory(id),
    transactions: generateTransactions(id),
  }
}

const TOKEN_PRICES: Record<string, number> = Object.fromEntries(
  MOCK_TOKENS.map((t) => [t.symbol, t.price])
)

export function getMockSwapQuote(from: string, to: string, amount: number) {
  const fromPrice = TOKEN_PRICES[from] ?? 1
  const toPrice   = TOKEN_PRICES[to]   ?? 1
  const usdValue  = amount * fromPrice
  const priceImpact = usdValue > 100_000 ? 0.8 : usdValue > 10_000 ? 0.3 : 0.05
  const feePct = 0.25
  const output = (usdValue / toPrice) * (1 - (priceImpact + feePct) / 100)
  return {
    from, to,
    amount_in: amount,
    amount_out: Math.round(output * 1_000_000) / 1_000_000,
    rate: Math.round((output / amount) * 1_000_000) / 1_000_000,
    price_impact: priceImpact,
    fee_pct: feePct,
    route: `${from} → ${to} via DEXO Pool`,
  }
}
