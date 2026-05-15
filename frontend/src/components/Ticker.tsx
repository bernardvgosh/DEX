import { useQuery } from '@tanstack/react-query'
import { fetchTokens } from '../api/tokens'

function fmt(n: number) {
  return n >= 1000
    ? n.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export function Ticker() {
  const { data: tokens = [] } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    refetchInterval: 30_000,
  })

  if (tokens.length === 0) return <div className="ticker-bar" />

  // duplicate for seamless loop
  const items = [...tokens, ...tokens]

  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-symbol">{t.symbol}</span>
            <span className="ticker-price">${fmt(t.price)}</span>
            <span className={t.change_24h >= 0 ? 'ticker-up' : 'ticker-down'}>
              {t.change_24h >= 0 ? '+' : ''}{t.change_24h.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
