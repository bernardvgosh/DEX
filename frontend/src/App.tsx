import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { LandingPage } from './pages/landing/LandingPage'
import { PoolsPage } from './pages/PoolsPage'
import { PoolDetailPage } from './pages/PoolDetailPage'
import { SwapPage } from './pages/SwapPage'
import { LiquidityPage } from './pages/LiquidityPage'

export default function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path="/pools" element={<PoolsPage />} />
        <Route path="/pools/:id" element={<PoolDetailPage />} />
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/liquidity" element={<LiquidityPage />} />
      </Route>
    </Routes>
  )
}
