import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { PoolsPage } from './pages/PoolsPage'
import { PoolDetailPage } from './pages/PoolDetailPage'
import { SwapPage } from './pages/SwapPage'
import { LiquidityPage } from './pages/LiquidityPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/pools" replace />} />
        <Route path="/pools" element={<PoolsPage />} />
        <Route path="/pools/:id" element={<PoolDetailPage />} />
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/liquidity" element={<LiquidityPage />} />
      </Route>
    </Routes>
  )
}
