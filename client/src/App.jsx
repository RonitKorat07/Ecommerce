import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default App
