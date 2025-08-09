import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from './theme/theme'
import Home from './pages/HomePage'
import CryptoDetailPage from './pages/CryptoDetailPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crypto/:coinId" element={<CryptoDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
