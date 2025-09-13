import Home from './Components/Home.jsx'
import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard.jsx'

const App = () => {
  return (
    
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Dashboard/:id' element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>

  )
}

export default App

