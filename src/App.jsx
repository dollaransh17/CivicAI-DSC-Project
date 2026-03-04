import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/HomePage'
import NotReady from './pages/NotReady'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:feature" element={<NotReady />} />
      </Routes>
    </BrowserRouter>
  )
}
