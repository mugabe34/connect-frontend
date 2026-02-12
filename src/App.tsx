import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { GlobalLoaderGate } from './components/GlobalLoaderGate'
import { ToastProvider } from './components/Toast'

function App() {
  const location = useLocation()
  const hideChrome =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/buyer/dashboard') ||
    location.pathname.startsWith('/admin')

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        {!hideChrome && <Navbar />}
        <main className="flex-1">
          <GlobalLoaderGate>
            <Outlet />
          </GlobalLoaderGate>
        </main>
        {!hideChrome && <Footer />}
      </div>
    </ToastProvider>
  )
}

export default App
