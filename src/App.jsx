import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/HomePage'


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path = '/' element={<Home/>}/>
      {/* <Route path = '/${id}' element={<CryptoCard/>}/> */}
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
