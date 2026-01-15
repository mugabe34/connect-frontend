import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { Dashboard } from './pages/Dashboard'
import { Admin } from './pages/Admin'
import { AuthSeller } from './pages/AuthSeller'
import { AuthBuyer } from './pages/AuthBuyer'
import { AuthAdmin } from './pages/AuthAdmin'
import { Auth } from './pages/Auth'
import { BuyerDashboard } from './pages/BuyerDashboard'
import { Contact } from './pages/Contact'
import { SellerProfile } from './pages/SellerProfile'
import { AuthProvider } from './providers/AuthProvider'

import { ProtectedRoute } from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'auth', element: <Auth /> },
      {
        element: <ProtectedRoute roles={['admin']} />,
        children: [
          { path: 'admin', element: <Admin /> },
        ],
      },
      {
        element: <ProtectedRoute roles={['seller', 'admin']} />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
        ],
      },
      {
        element: <ProtectedRoute roles={['buyer']} />,
        children: [{ path: 'buyer/dashboard', element: <BuyerDashboard /> }],
      },
      { path: 'auth/seller', element: <AuthSeller /> },
      { path: 'auth/buyer', element: <AuthBuyer /> },
      { path: 'auth/admin', element: <AuthAdmin /> },
      { path: 'contact', element: <Contact /> },
      { path: 'seller/:id', element: <SellerProfile /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
