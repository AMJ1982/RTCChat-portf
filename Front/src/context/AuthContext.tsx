import React, { createContext, useContext, useState, useEffect, lazy } from 'react'
import { getErrorMessage, updateStorage, getSubFromDB, enableSub, wakeUpCall } from '../utils/helpers'
import { useMutation, useLazyQuery, ApolloError, useApolloClient } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useNotification } from './NotificationContext'
import { ADD_USER, USER, LOGIN, ADD_CONTACT, UPDATE_USER, CLEAR_VISITOR } from '../graphql/queries'
import { AuthContext, AuthProviderProps, NewUser, Credentials, LoggedUser } from '../types'
import { useDialog } from '../hooks/useDialog'
const Confirm = lazy(() => import('../components/Confirm'))

const Context = createContext<AuthContext | null>(null)

// A custom hook to pass forward the methods defined in AuthProvider.
export const useAuth = () => {
  return useContext(Context) as AuthContext
}

// Polling the server every 2 minutes to keep the connection alive.
wakeUpCall()

// This component is basically wrapping the whole application. All layouts and components are received as children and
// passed through AuthProvider. All mutations and queries are handled here, although the operations not directly related
// to user handling could be transferred to a separate context.
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const client = useApolloClient()
  const showNotification = useNotification()
  const navigate = useNavigate()  
  const [user, setUser] = useState<LoggedUser>()
  const [token, setToken] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const { showDialog, onConfirm, onCancel } = useDialog({ setShowConfirmation })

  // Methods for performing queries and mutations.
  const [getUser] = useLazyQuery(USER, {
    onError: (err: ApolloError) => {
      showNotification(getErrorMessage(err) as string, 'error')
    }
  })
  const [login] = useMutation(LOGIN, {
    onError: (err: ApolloError) => {
      showNotification(getErrorMessage(err) as string, 'error')
      console.log('errori loginissa', err)
    }
  })
  const [addUser] = useMutation(ADD_USER, {
    onError: (err: ApolloError) => console.log(err.message)
  })
  const [addContact] = useMutation(ADD_CONTACT, {
    onError: (err: ApolloError) => showNotification(getErrorMessage(err) as string, 'error')
  })
  const [updateUser] = useMutation(UPDATE_USER, {
    onError: (err: ApolloError) => console.log(err),
  })
  const [clearVisitor] = useMutation(CLEAR_VISITOR, {
    onError: (err: ApolloError) => console.log(err),
  })

  // Setting possibly logged user to state.
  useEffect(() => {

    // Fetching the relevant user object by user_id.
    const getSingleUser = async (user_id: string, pushNotifications: boolean) => {
      try {
        const { data } = await getUser({ variables: { user_id } })
        if (data.findUser) {
          const notifPermission = Notification.permission === 'granted' ? true : false
          let pushSubscription = await getSubFromDB(Number(user_id))
          
          // If sub-object doesn't exist in db, but subs are activated in loggedUser-object 
          // OR permission on browser level isn't granted despite user having subs activated, 
          // a dialog to grant permission is shown.
          if ((!pushSubscription && pushNotifications) || (!notifPermission && pushNotifications) && await showDialog()) {            
            pushSubscription = await enableSub(Number(user_id))
          }

          const subIsActive = pushSubscription ? JSON.parse(pushSubscription).active : false

          const loggedUser = {
            ...data.findUser,
            pushNotifications: subIsActive
          }
          setUser(loggedUser)
          updateStorage(loggedUser, null)
        }        
        setLoading(false)
      } catch (err) {
        console.log('User does not exist')
        const loggedUser = localStorage.getItem('RTCChatUser')

        if (loggedUser) {
          const { user } = JSON.parse(loggedUser)
          setUser(user)
          setLoading(false)
        }
      }
    }
    
    // Checking if a logged user is found from local storage. If so, separating the user token from JSON object, saving it to the state,
    // and calling getSingleUser() with user id and push notification permission derived from user object. If not, loading is set to false 
    // and user is redirected to login form in MainLayout.
    const loggedUser = localStorage.getItem('RTCChatUser')

    if (loggedUser) {
      const { token, user } = JSON.parse(loggedUser)
      setToken(token)
      getSingleUser(user.user_id, user.pushNotifications)      
    } else {
      setLoading(false)
    }
  }, [])

  // Handler method for logging out: removing the user from local storage and clearing component states and Apollo cache.
  const handleLogout = () => {
    localStorage.removeItem('RTCChatUser')
    setToken(undefined)
    setUser(undefined)
    client.clearStore()
    navigate('/')
  }
  
  // Method for handling login mutation. This is called in Login component.
  const userLogin = async (credentials: Credentials, form: HTMLFormElement) => {
    try {
      // Succesful login mutation returns the user object and token.
      const { data } = await login({ variables: credentials })
      setToken(data.login.token)
      let pushSubscription = await getSubFromDB(Number(data.login.user.user_id))
      // If PushSubscription isn't registered for the user, a confirmation dialog for allowing 
      // notifications is shown.
      if (!pushSubscription && await showDialog()) {
        pushSubscription = await enableSub(Number(data.login.user.user_id))
        if (!pushSubscription) showNotification('Enable permission for notifications from browser settings!', 'error')
      }
      
      const subIsActive = pushSubscription ? JSON.parse(pushSubscription).active : false
      const loggedUser = {
        ...data.login.user,
        pushNotifications: subIsActive
      }
      setUser(loggedUser)
      updateStorage(loggedUser, data.login.token)
      form.reset()
    } catch (err) {
      console.log('error userLogin: ', getErrorMessage(err))
    }
  }
  
  // Method for handling addUser mutation. Called in Signup component.
  const createUser = async (user: NewUser) => {
    const res = await addUser({ variables: { ...user } })
    return res.data?.addUser
  }

  // Method for handling mutations for editing user. Called in Settings component.
  const editUser = async (user_id: number, attachment: string) => {
    try {
      const { data } = await updateUser({
        variables: {
          user_id: user_id.toString(),
          img: attachment === '' ? null : attachment
        }
      })
      setUser(data.updateUser)
    } catch (err) {
      console.log(err)
    }    
  }

  // Adding a new contact for user.
  const addFriend = async (name: string) => {
    try {
      // If the friend is already found in users connections an error is thrown.
      const alreadyFriend = user?.connections.findIndex(friend => friend.name === name) as number

      if (alreadyFriend > -1) throw new Error(`${name} is already on your friend list`)
      
      // Mutation addContact returns an updated user object for the logged in user including the new contact.
      const res = await addContact({ variables: { name } })
      setUser(res.data.addContact)
      updateStorage(res.data.addContact, token as string)
    } catch (err) {      
      console.log(getErrorMessage(err))
      showNotification(`User '${name}' not found`, 'error')
    }
  }  

  // If PushSubscription isn't found, a dialog for permission to enable notifications is shown.
  if (showConfirmation) return <Confirm onConfirm={ onConfirm } onCancel={ onCancel } />
  if (loading) return null
  
  return (
    <Context.Provider value={{ user, setUser, handleLogout, userLogin, getSingleUser, createUser, editUser, addFriend, clearVisitor }}>
      {children}
    </Context.Provider>
  )
}