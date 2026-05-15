import { useState, useRef, useEffect } from 'react'
import './TokenSelector.css'

const ALL_TOKENS = [
  'BTC','ETH','SOL','ARB','BNB','USDC','USDT','RAY','JUP','CAKE','UNI','WBTC'
]

interface Props {
  value: string
  onChange: (t: string) => void
  exclude?: string
}

export function TokenSelector({ value, onChange, exclude }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const tokens = ALL_TOKENS.filter((t) => t !== exclude)

  return (
    <div className="token-selector" ref={ref}>
      <button className="token-btn" onClick={() => setOpen((o) => !o)}>
        <span className="token-icon">{value[0]}</span>
        <span>{value}</span>
        <span className="token-caret">▾</span>
      </button>
      {open && (
        <div className="token-dropdown">
          {tokens.map((t) => (
            <button
              key={t}
              className={`token-option${t === value ? ' selected' : ''}`}
              onClick={() => { onChange(t); setOpen(false) }}
            >
              <span className="token-icon">{t[0]}</span>
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
