import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className={isAuthenticated ? "dashboard-layout" : ""}>
        {isAuthenticated && isAdmin && (
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        )}
        
        <div className="flex-1 flex flex-col min-h-screen">
          {isAuthenticated && (
            <Navbar 
              isSidebarOpen={isSidebarOpen} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          )}
          
          <main 
            className={`${isAuthenticated ? "main-content" : ""} flex-1`}
            style={isAuthenticated && isAdmin ? { 
              marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)',
              transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            } : {
              marginLeft: 0,
              width: '100%',
              transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div className={`${isAuthenticated ? "max-w-[1440px] mx-auto" : ""} h-full`}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
