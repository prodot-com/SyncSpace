import Home from './Components/Home.jsx'
import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard.jsx'
import Workspace from './Components/Workspace.jsx'
import Tasks from './Components/Tasks.jsx'


const App = () => {
  return (
    
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Dashboard/:id' element={<Dashboard/>}/>
        <Route path='/Workspace/:id' element={<Workspace/>} />
        <Route path='/Tasks/:id' element={<Tasks/>} />
    </Routes>
    </BrowserRouter>

  )
}

export default App

