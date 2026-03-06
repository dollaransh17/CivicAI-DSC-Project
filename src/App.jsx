import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/HomePage'
import NotReady from './pages/NotReady'
import ReportPage from './pages/ReportPage'
import TrackPage from './pages/TrackPage'
import BotPage from './pages/BotPage'
import MayorSimulator from './components/MayorSimulator'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/bot" element={<BotPage />} />
        <Route path="/mayor-simulator" element={<MayorSimulator />} />
        <Route path="/nearby" element={<NotReady />} />
        <Route path="/:feature" element={<NotReady />} />
      </Routes>
    </BrowserRouter>
  )
}
