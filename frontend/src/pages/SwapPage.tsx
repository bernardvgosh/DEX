import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TokenSelector } from '../components/TokenSelector'
import { fetchSwapQuote } from '../api/swap'
import './SwapPage.css'

const TOKEN_PRICES: Record<string, number> = {
  BTC: 103240.50, ETH: 3841.20, SOL: 178.45, ARB: 1.23, BNB: 612.80,
  USDC: 1.00, USDT: 1.00, RAY: 4.85, JUP: 1.42, CAKE: 3.18, UNI: 12.40, WBTC: 103180.00,
}

const SLIPPAGE_OPTIONS = ['0.1', '0.5', '1.0']

export function SwapPage() {
  const [fromToken, setFromToken] = useState('SOL')
  const [toToken, setToToken]     = useState('USDC')
  const [amount, setAmount]       = useState('')
  const [slippage, setSlippage]   = useState('0.5')
  const [showSlippage, setShowSlippage] = useState(false)
  const [debouncedAmount, setDebouncedAmount] = useState('')
  const slippageRef = useRef<HTMLDivElement>(null)

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedAmount(amount), 400)
    return () => clearTimeout(t)
  }, [amount])

  // close slippage popover on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (slippageRef.current && !slippageRef.current.contains(e.target as Node)) {
        setShowSlippage(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const numAmount = parseFloat(debouncedAmount) || 0
  const enabled = numAmount > 0 && fromToken !== toToken

  const { data: quote, isFetching } = useQuery({
    queryKey: ['swap-quote', fromToken, toToken, debouncedAmount],
    queryFn: () => fetchSwapQuote(fromToken, toToken, numAmount),
    enabled,
  })

  function flipTokens() {
    setFromToken(toToken)
    setToToken(fromToken)
    setAmount('')
  }

  const fromUSD = numAmount * (TOKEN_PRICES[fromToken] ?? 1)
  const toUSD   = (quote?.amount_out ?? 0) * (TOKEN_PRICES[toToken] ?? 1)

  const impactClass =
    !quote ? '' :
    quote.price_impact < 0.5 ? 'impact-low' :
    quote.price_impact < 1.0 ? 'impact-mid' : 'impact-high'

  return (
    <div className="swap-wrap">
      <div className="swap-card">
        <div className="swap-card-title">
          <span>Swap</span>
          <div style={{ position: 'relative' }} ref={slippageRef}>
            <button className="slippage-btn" onClick={() => setShowSlippage((s) => !s)}>
              ⚙ Slippage {slippage}%
            </button>
            {showSlippage && (
              <div className="slippage-popover">
                <div className="slippage-label">Max slippage</div>
                <div className="slippage-options">
                  {SLIPPAGE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      className={`slippage-option${slippage === s ? ' active' : ''}`}
                      onClick={() => { setSlippage(s); setShowSlippage(false) }}
                    >
                      {s}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pay */}
        <div className="token-input-box">
          <div className="token-input-label">You pay</div>
          <div className="token-input-row">
            <input
              className="token-amount-input"
              placeholder="0"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TokenSelector value={fromToken} onChange={setFromToken} exclude={toToken} />
          </div>
          {fromUSD > 0 && <div className="token-usd">≈ ${fromUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>}
        </div>

        {/* Flip */}
        <div className="swap-arrow-wrap">
          <button className="swap-arrow-btn" onClick={flipTokens}>⇅</button>
        </div>

        {/* Receive */}
        <div className="token-input-box">
          <div className="token-input-label">You receive</div>
          <div className="token-input-row">
            <input
              className="token-amount-input"
              placeholder={isFetching ? '…' : '0'}
              readOnly
              value={quote ? quote.amount_out.toLocaleString('en-US', { maximumFractionDigits: 6 }) : ''}
            />
            <TokenSelector value={toToken} onChange={setToToken} exclude={fromToken} />
          </div>
          {toUSD > 0 && <div className="token-usd">≈ ${toUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>}
        </div>

        {/* Quote info */}
        {quote && (
          <div className="quote-info">
            <div className="quote-row">
              <span className="quote-label">Rate</span>
              <span className="quote-value">1 {fromToken} = {quote.rate.toFixed(4)} {toToken}</span>
            </div>
            <div className="quote-row">
              <span className="quote-label">Price impact</span>
              <span className={`quote-value ${impactClass}`}>{quote.price_impact.toFixed(2)}%</span>
            </div>
            <div className="quote-row">
              <span className="quote-label">Fee</span>
              <span className="quote-value">{quote.fee_pct}%</span>
            </div>
            <div className="quote-row">
              <span className="quote-label">Route</span>
              <span className="quote-value" style={{ fontSize: 12, color: 'var(--muted)' }}>{quote.route}</span>
            </div>
          </div>
        )}

        <button className="swap-cta" disabled>
          Connect Wallet to Swap
        </button>
      </div>
    </div>
  )
}
