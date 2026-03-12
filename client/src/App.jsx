import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

function App() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className={isAuthenticated ? "dashboard-layout" : ""}>
        {isAuthenticated && (
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        )}
        
        <div className="flex-1">
          {isAuthenticated && (
            <Navbar 
              isSidebarOpen={isSidebarOpen} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          )}
          
          <main 
            className={isAuthenticated ? "main-content" : ""} 
            style={isAuthenticated ? { 
              marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)',
              transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            } : undefined}
          >
            <div className={isAuthenticated ? "max-w-[1440px] mx-auto" : ""}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
