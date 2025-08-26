import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ThemeContextProvider } from './theme/ThemeContext'
import { PinContextProvider } from './PinContext'
import Home from './pages/HomePage'
import CryptoDetailPage from './pages/CryptoDetailPage'
import NotFound from './pages/NotFoundPage'
function App() {
  return (
    <ThemeContextProvider>
      <PinContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crypto/:coinId" element={<CryptoDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PinContextProvider>
    </ThemeContextProvider>
  )
}

export default App
