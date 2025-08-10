import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ThemeContextProvider } from './theme/ThemeContext'
import Home from './pages/HomePage'
import CryptoDetailPage from './pages/CryptoDetailPage'

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crypto/:coinId" element={<CryptoDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeContextProvider>
  )
}

export default App
