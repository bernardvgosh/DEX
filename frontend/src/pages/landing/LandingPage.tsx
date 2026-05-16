import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchTokens } from '../../api/tokens'
import { fetchPools } from '../../api/pools'
import { MOCK_TOKENS, MOCK_POOLS } from '../../api/mockData'
import './LandingPage.css'

const CHAIN_CHIPS = [
  { name: 'Solana',   color: '#9945FF' },
  { name: 'Ethereum', color: '#627EEA' },
  { name: 'Arbitrum', color: '#12AAFF' },
  { name: 'BSC',      color: '#F0B90B' },
]

const TOKEN_COLORS: Record<string, string> = {
  BTC: '#F7931A', ETH: '#627EEA', SOL: '#9945FF', ARB: '#12AAFF',
  BNB: '#F0B90B', USDC: '#2775CA', USDT: '#26A17B', RAY: '#4E44CE',
  JUP: '#C7A853', CAKE: '#1FC7D4', UNI: '#FF007A', WBTC: '#F7931A',
}

function fmtUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2,
  }).format(n)
}

function fmtPrice(n: number) {
  return n >= 1000
    ? `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
}

const FEATURES = [
  {
    tag: 'Trade',
    title: 'Swap Any Token, Instantly.',
    desc: 'Get the best prices across all chains with smart routing, minimal slippage, and fees as low as 0.01%.',
    link: '/swap',
    linkText: 'Start swapping →',
    icon: '⇄',
    glowColor: '#7c3aed',
  },
  {
    tag: 'Earn',
    title: 'Provide Liquidity, Earn Fees.',
    desc: 'Put your assets to work. Add liquidity to any pool and earn a share of trading fees — up to 31% APY.',
    link: '/liquidity',
    linkText: 'Explore pools →',
    icon: '≋',
    glowColor: '#22c55e',
  },
  {
    tag: 'Discover',
    title: 'Multi-Chain Analytics.',
    desc: 'Track TVL, volume, and APY across 10 pools on 4 chains. Deep charts, real-time data, full transparency.',
    link: '/pools',
    linkText: 'View analytics →',
    icon: '◈',
    glowColor: '#60a5fa',
  },
]

export function LandingPage() {
  const { data: tokens = MOCK_TOKENS } = useQuery({ queryKey: ['tokens'], queryFn: fetchTokens, refetchInterval: 30_000 })
  const { data: pools  = MOCK_POOLS  } = useQuery({ queryKey: ['pools'],  queryFn: () => fetchPools() })

  const totalTVL    = pools.reduce((s, p) => s + p.tvl, 0)
  const totalVol24h = pools.reduce((s, p) => s + p.volume_24h, 0)
  const avgAPY      = pools.reduce((s, p) => s + p.apy, 0) / pools.length
  const topPools    = [...pools].sort((a, b) => b.apy - a.apy).slice(0, 3)
  const tickerItems = [...tokens, ...tokens]

  const ethToken = tokens.find(t => t.symbol === 'ETH')
  const solToken = tokens.find(t => t.symbol === 'SOL')

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <a href="/" className="lp-nav-logo">DEXO</a>
        <div className="lp-nav-links">
          <Link to="/swap">Trade</Link>
          <Link to="/liquidity">Earn</Link>
          <Link to="/pools">Pools</Link>
        </div>
        <div className="lp-nav-right">
          <Link to="/pools" className="lp-nav-app">Launch App</Link>
          <Link to="/swap" className="lp-nav-cta">⇄ Trade Now</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* Floating balls */}
        <div className="hero-balls">
          {[
            { sym:'ETH', color:'#627EEA', size:56, top:'18%', left:'8%',  dur:'6s'  },
            { sym:'BTC', color:'#F7931A', size:48, top:'60%', left:'4%',  dur:'8s'  },
            { sym:'SOL', color:'#9945FF', size:52, top:'25%', right:'6%', dur:'7s'  },
            { sym:'BNB', color:'#F0B90B', size:44, top:'65%', right:'8%', dur:'9s'  },
            { sym:'ARB', color:'#12AAFF', size:38, top:'80%', left:'20%', dur:'5.5s'},
            { sym:'UNI', color:'#FF007A', size:34, top:'15%', left:'30%', dur:'7.5s'},
          ].map((b, i) => (
            <div key={i} className="hero-ball" style={{
              width: b.size, height: b.size,
              background: b.color,
              top: b.top, left: (b as any).left, right: (b as any).right,
              fontSize: Math.floor(b.size * 0.28),
              animationDuration: b.dur,
              animationDelay: `${i * 0.8}s`,
              opacity: 0.75,
            }}>{b.sym[0]}</div>
          ))}
        </div>

        <div className="hero-inner">
          {/* Copy */}
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Multi-Chain · 4 Networks · 10+ Pools
            </div>
            <h1 className="hero-h1">
              <span className="hero-h1-white">Everyone's</span>
              <span className="hero-h1-grad">Favorite DEX.</span>
            </h1>
            <p className="hero-p">
              Trade crypto instantly across Solana, Ethereum, Arbitrum and BSC.
              Best prices, lowest fees, deepest liquidity — all in one place.
            </p>
            <div className="hero-ctas">
              <Link to="/swap" className="btn-hero-primary">⇄ Start Trading</Link>
              <Link to="/pools" className="btn-hero-ghost">◈ Explore Pools</Link>
            </div>
            <div className="hero-chains">
              <span className="hero-chains-label">Live on</span>
              {CHAIN_CHIPS.map(c => (
                <span key={c.name} className="chain-chip">
                  <span className="chain-chip-dot" style={{ background: c.color }} />
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Swap widget */}
          <div className="hero-swap-card">
            <div className="swap-card-header">
              <span className="swap-card-title">Swap</span>
              <button className="swap-card-settings">⚙</button>
            </div>

            <div className="swap-token-box">
              <div className="swap-box-label">You pay</div>
              <div className="swap-box-row">
                <div className="swap-token-selector">
                  <div className="swap-token-icon" style={{ background: TOKEN_COLORS['ETH'] }}>E</div>
                  ETH
                  <span className="swap-token-caret">▾</span>
                </div>
                <span className="swap-amount-zero">0</span>
              </div>
              <div className="swap-usd">{ethToken ? fmtPrice(ethToken.price) : '—'}</div>
            </div>

            <div className="swap-arrow-center">
              <button className="swap-arrow-btn">⇅</button>
            </div>

            <div className="swap-token-box">
              <div className="swap-box-label">You receive</div>
              <div className="swap-box-row">
                <div className="swap-token-selector">
                  <div className="swap-token-icon" style={{ background: TOKEN_COLORS['SOL'] }}>S</div>
                  SOL
                  <span className="swap-token-caret">▾</span>
                </div>
                <span className="swap-amount-zero">0</span>
              </div>
              <div className="swap-usd">{solToken ? fmtPrice(solToken.price) : '—'}</div>
            </div>

            <Link to="/swap" className="swap-cta-btn">Get Started</Link>
            <div className="swap-fee-note">
              Swap with fees as low as <strong>0.01%</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="lp-ticker">
        <div className="lp-ticker-track">
          {tickerItems.map((t, i) => (
            <span key={i} className="lp-ticker-item">
              <span className="lp-ticker-sym">{t.symbol}</span>
              <span className="lp-ticker-price">{fmtPrice(t.price)}</span>
              <span className={t.change_24h >= 0 ? 'lp-ticker-up' : 'lp-ticker-down'}>
                {t.change_24h >= 0 ? '+' : ''}{t.change_24h.toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="lp-stats-bg">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-item-num accent">{fmtUSD(totalTVL)}</div>
            <div className="stat-item-label">Total Value Locked</div>
            <div className="stat-item-sub">Across all pools</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-num" style={{ color: '#60a5fa' }}>{fmtUSD(totalVol24h)}</div>
            <div className="stat-item-label">24h Trading Volume</div>
            <div className="stat-item-sub">↑ +8.7% vs yesterday</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-num" style={{ color: '#fff' }}>{pools.length}</div>
            <div className="stat-item-label">Active Pools</div>
            <div className="stat-item-sub">On 4 networks</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-num green">{avgAPY.toFixed(1)}%</div>
            <div className="stat-item-label">Average APY</div>
            <div className="stat-item-sub">Earn by providing liquidity</div>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="lp-section">
        <div className="lp-section-label">What you can do</div>
        <div className="lp-section-title">Built for every<br />way you trade.</div>
        <div className="lp-section-sub">
          One platform, everything you need — swap, earn, and track across chains.
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <Link key={f.tag} to={f.link} className="feature-card">
              <div className="feature-card-glow" style={{ background: f.glowColor }} />
              <div className="feature-icon-large">{f.icon}</div>
              <div className="feature-tag">{f.tag}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
              <div className="feature-link">{f.linkText}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Top yield pools ── */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="lp-section">
          <div className="lp-section-label">Earn</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div className="lp-section-title" style={{ marginBottom: 8 }}>Top Yield Pools</div>
              <div style={{ color: 'var(--muted)', fontSize: 15 }}>Provide liquidity and earn trading fees.</div>
            </div>
            <Link to="/pools" style={{ color: 'var(--accent2)', fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              View all pools →
            </Link>
          </div>
          <div className="pools-preview-grid">
            {topPools.map((pool) => (
              <Link key={pool.id} to={`/pools/${pool.id}`} className="pool-preview-card">
                <div className="pool-card-top">
                  <div className="pool-card-icons">
                    <div className="pool-card-icon" style={{ background: TOKEN_COLORS[pool.token_a] ?? 'var(--accent)' }}>
                      {pool.token_a[0]}
                    </div>
                    <div className="pool-card-icon" style={{ background: TOKEN_COLORS[pool.token_b] ?? '#60a5fa' }}>
                      {pool.token_b[0]}
                    </div>
                  </div>
                  <div className="pool-apy-badge">Up to {pool.apy.toFixed(2)}% APY</div>
                </div>
                <div className="pool-card-pair">{pool.token_a}/{pool.token_b}</div>
                <div className="pool-card-chain" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: CHAIN_CHIPS.find(c => c.name.toLowerCase() === pool.chain)?.color ?? '#888',
                    display: 'inline-block',
                  }} />
                  {pool.chain.charAt(0).toUpperCase() + pool.chain.slice(1)}
                </div>
                <div className="pool-card-stats">
                  <div className="pool-card-stat">
                    <div className="pool-card-stat-label">TVL</div>
                    <div className="pool-card-stat-val">{fmtUSD(pool.tvl)}</div>
                  </div>
                  <div className="pool-card-stat">
                    <div className="pool-card-stat-label">Volume 24h</div>
                    <div className="pool-card-stat-val">{fmtUSD(pool.volume_24h)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trusted ── */}
      <div className="lp-trusted-bg">
        <div className="trusted-inner">
          <div className="trusted-h2">
            Trusted by <span className="grad">traders</span>.<br />
            Powered by <span className="grad">liquidity</span>.
          </div>
          <div className="trusted-stats">
            <div className="trusted-stat-card">
              <div className="trusted-stat-val purple">{fmtUSD(totalTVL)}</div>
              <div className="trusted-stat-label">Total Value Locked</div>
              <div className="trusted-stat-sub">Across all chains</div>
            </div>
            <div className="trusted-stat-card">
              <div className="trusted-stat-val blue">{fmtUSD(totalVol24h)}</div>
              <div className="trusted-stat-label">24h Volume</div>
              <div className="trusted-stat-sub">↑ Growing daily</div>
            </div>
            <div className="trusted-stat-card">
              <div className="trusted-stat-val green">{pools.length}+</div>
              <div className="trusted-stat-label">Active Pools</div>
              <div className="trusted-stat-sub">4 chains supported</div>
            </div>
            <div className="trusted-stat-card">
              <div className="trusted-stat-val yellow">{avgAPY.toFixed(1)}%</div>
              <div className="trusted-stat-label">Avg. APY</div>
              <div className="trusted-stat-sub">Earn while you hold</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-logo">DEXO</div>
              <div className="footer-brand-desc">
                The fastest multi-chain DEX. Trade any token on any chain, instantly.
              </div>
            </div>
            <div>
              <div className="footer-col-title">Trade</div>
              <div className="footer-links">
                <Link to="/swap">Swap</Link>
                <Link to="/pools">Pools</Link>
                <Link to="/liquidity">Liquidity</Link>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Developers</div>
              <div className="footer-links">
                <a href="#">Documentation</a>
                <a href="#">GitHub</a>
                <a href="#">Bug Bounty</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Support</div>
              <div className="footer-links">
                <a href="#">Get Help</a>
                <a href="#">Discord</a>
                <a href="#">FAQ</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">About</div>
              <div className="footer-links">
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Brand Assets</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 DEXO. All rights reserved.</span>
            <span style={{ display: 'flex', gap: 20 }}>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terms of Service</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
