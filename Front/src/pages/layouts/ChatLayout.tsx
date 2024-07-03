import React from 'react'
import { Outlet } from 'react-router-dom'

// Layout for chat view.
const ChatLayout = () => {
  return (
    <>      
      <Outlet />
    </>
  )
}

export default ChatLayout