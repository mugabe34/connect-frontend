import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { GlobalLoaderGate } from './components/GlobalLoaderGate'
import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1">
          <GlobalLoaderGate>
            <Outlet />
          </GlobalLoaderGate>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App
