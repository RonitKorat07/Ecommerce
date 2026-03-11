import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

function App() {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {isAuthenticated && <Navbar />}
      <Outlet />
    </>
  )
}

export default App
