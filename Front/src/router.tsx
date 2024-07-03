import React, { lazy, ReactNode, Suspense } from 'react'
import { Outlet, createHashRouter, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { Main } from './components/Main'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { isDecember } from './utils/helpers'
const ChatLayout = lazy(() => import('./pages/layouts/ChatLayout'))
const AuthLayout = lazy(() => import('./pages/layouts/AuthLayout'))
const MainLayout = lazy(() => import('./pages/layouts/MainLayout'))
const SettingsLayout = lazy(() => import('./pages/layouts/SettingsLayout'))
const Settings = lazy(() => import('./pages/Settings'))
const EditMsg = lazy(() => import('./pages/EditMsg'))
const MessageView = lazy(() => import('./components/MessageView'))
const Snowfall = lazy(() => import('./components/Snowfall'))

// The component wrapping the whole app; the children of ContextWrapper are other components 
// of the app, which also contain children of their own. ContextWrapper gets child content 
// throught Outlet.
const ContextWrapper = () => {
  // Manually updating the service worker when navigating.
  const location = useLocation()
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg =>
        reg.update()
      )
    }
  }, [location])
  
  return (
    <NotificationProvider>      
      <AuthProvider>
        {isDecember() && <Snowfall />}
        <Nav />
        <Outlet />
      </AuthProvider>
    </NotificationProvider>
  )
}

const suspense = (element: ReactNode) => {
  return <Suspense>{element}</Suspense>
}

export const router = createHashRouter([
  {
    element: <ContextWrapper />,
    // The Outlet part starts here. Nav is given separately in ContextWrapper definition 
    // since it's always visible.
    children: [
      {
        path: '/',
        element: suspense(<MainLayout />),
        children: [
          { index: true, element: <Main /> },
        ]
      },
      {
        element: suspense(<AuthLayout />),
        children: [
          { path: 'login', element: <Login /> },
          { path: 'signup', element: <Signup /> }
        ]
      },
      {
        element: suspense(<ChatLayout />),
        children: [
          { path: 'chat/:id', element: <MessageView /> },
        ]
      },
      {
        element: suspense(<SettingsLayout />),
        children: [
          { path: 'settings', element: <Settings /> },
        ]
      },
      {
        element: suspense(<SettingsLayout />),
        children: [
          { path: 'edit-msg', element: <EditMsg /> },
        ]
      },
    ]
  }
])

