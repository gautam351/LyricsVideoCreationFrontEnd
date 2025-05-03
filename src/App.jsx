import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@mui/material'
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}  />
      </Routes>
      </Router>
    </>
  )
}

export default App
