import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Routes , Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Appointment from './pages/Appointments'
import Patient from './pages/Patients'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>


  
     <div className="flex flex-col h-screen">

  <Navbar />

  <div className="flex flex-1">
    
    <Sidebar />

    <div className="flex-1 p-4 bg-gray-100">
        <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/appointments' element={<Appointment/>}/>
      <Route path='/patients' element={<Patient/>}/>
    </Routes>
    </div>

  </div>

</div>
    </>
  )
}

export default App
