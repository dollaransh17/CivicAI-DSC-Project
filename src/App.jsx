import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/HomePage'
import NotReady from './pages/NotReady'
import ReportPage from './pages/ReportPage'
import TrackPage from './pages/TrackPage'
import BotPage from './pages/BotPage'
import MayorSimulator from './components/MayorSimulator'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/bot" element={<BotPage />} />
        <Route path="/mayor-simulator" element={<MayorSimulator />} />
        <Route path="/:feature" element={<NotReady />} />
      </Routes>
    </BrowserRouter>
  )
}
