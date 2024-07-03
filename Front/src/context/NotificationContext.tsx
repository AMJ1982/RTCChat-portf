import React, { useState, createContext, useContext } from 'react'
import { NotificationContext, NotificationProviderProps, ShowMessageHandle } from '../types'

const Context = createContext<ShowMessageHandle | null>(null)

// A custom hook for sharing the showNotification method to other components.
export const useNotification = () => {
  return useContext(Context) as NotificationContext
}

// The component for showing toast-like notifications for the user. Showing and dismissing notifications
// is handled within this component. Used in the ContextWrapper defined in router.tsx.
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState<string>()
  const [type, setType] = useState<string>()

  // A method for showing and dismissing notifications. The 'type' property determines the type of the
  // message: success or error.
  const showNotification = (text: string, type: string) => {
    setText(text)
    setType(type)
    setVisible(true)
    setTimeout(() => setVisible(false), 4000)
  }
  
  return (
    <Context.Provider value={showNotification}>
      {visible
        ? <div className={`notification ${type}`}>{text}</div>
        : null}
      {children}
    </Context.Provider>
  )
}