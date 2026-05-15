import { createContext, useContext, useState, type ReactNode } from 'react'

const CHAINS = [
  { id: 'all',      name: 'All Chains' },
  { id: 'solana',   name: 'Solana' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'arbitrum', name: 'Arbitrum' },
  { id: 'bsc',      name: 'BSC' },
]

interface ChainCtx { chain: string; setChain: (c: string) => void }
const ChainContext = createContext<ChainCtx>({ chain: 'all', setChain: () => {} })

export function ChainProvider({ children }: { children: ReactNode }) {
  const [chain, setChain] = useState('all')
  return <ChainContext.Provider value={{ chain, setChain }}>{children}</ChainContext.Provider>
}

export function useChain() { return useContext(ChainContext) }

export function ChainSelector() {
  const { chain, setChain } = useChain()
  return (
    <div className="chain-tabs">
      {CHAINS.map((c) => (
        <button
          key={c.id}
          className={`chain-tab${chain === c.id ? ' active' : ''}`}
          onClick={() => setChain(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
