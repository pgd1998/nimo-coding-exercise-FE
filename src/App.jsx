import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/HomePage'
import CryptoDetailPage from './pages/CryptoDetailPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crypto/:coinId" element={<CryptoDetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
