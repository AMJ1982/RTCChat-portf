import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// The layout component for showing the main page. If a logged user isn't found in AuthContext, redirecting to login page.
const MainLayout = () => {
  const { user } = useAuth()
  
  if (!user || user === undefined) return <Navigate to='login' />
  
  return (
    <>
      <Outlet />
    </>
  )
}

export default MainLayout