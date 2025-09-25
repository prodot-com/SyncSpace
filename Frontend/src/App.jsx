import Home from './Components/Home.jsx'
import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard/Dashboard.jsx'
import Workspace from './Components/Workspace.jsx'
import Tasks from './Components/Tasks.jsx'
import AdminPage from './Components/Admin.jsx'
import TeamsPage from './Components/Teams.jsx'


const App = () => {
  return (
    
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Dashboard/:id' element={<Dashboard/>}/>
        <Route path='/Workspace/:id' element={<Workspace/>} />
        <Route path='/Tasks/:id' element={<Tasks/>} />
        <Route path='/Admin/:id' element={<AdminPage/>} />
        <Route path='/Team/:id' element={<TeamsPage/>} />
    </Routes>
    </BrowserRouter>

  )
}

export default App

