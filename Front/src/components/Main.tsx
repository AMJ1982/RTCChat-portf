import React, { useRef, lazy, Suspense } from 'react'
import { useAuth } from '../context/AuthContext'
import { Input } from './Input'
import { Button } from './Button'
import { Connection, UnseenMsgIdentifier } from '../types'
import { GET_UNSEEN_MSGS } from '../graphql/queries'
import { useQuery, ApolloError } from '@apollo/client'
const UserListItem = lazy(() => import('./UserListItem'))
const channel = new BroadcastChannel('sw-messages')

// The main view of the application consisting of a list of friends and tools for adding new contacts.
export const Main = () => {
  const finderRef = useRef<HTMLInputElement>(null)
  const { user, addFriend } = useAuth()
  const hasContacts = user?.connections.length as number > 0
  
  // Apollo query for checking if user has unseen messages in their conversations.
  const { data, loading, refetch } = useQuery(GET_UNSEEN_MSGS, {
    variables: { user_id: user?.user_id },
    fetchPolicy: 'network-only',
    onError: (err: ApolloError) => {
      console.log('Error checking unseen messages', err)
    },
  })
  
  // When a new message arrives, the service worker sends a message to channel 'message'
  // triggering refetching of unseen message status.
  channel.addEventListener('message', event => {
    refetch()
  })
  
  // Handler method for adding new friends to the users connection list.
  const handleAddContact = () => {
    if (finderRef.current?.value === '') return
    addFriend(
      finderRef.current?.value as string
    )
  }
  
  // Loading animation shown while loading the component.
  if (loading) return <div className='loader-ring'></div>

  // The results of unseen messages query into an array. This is used in construction of UserListItems.
  const unseenMessages = data 
    ? JSON.parse(data.getUnseenMsgs)
    : []
  
  return (
    <div className='list'>
      <div id='contact-tools' className={!hasContacts ? 'no-contacts' : ''}>
        <h1>{hasContacts ? 'Your contacts': `You don't have any contacts`}</h1>
        <div id='add-contact'>
          <Input id='find' className='grid-item' placeholder='Add contact' required ref={finderRef}/>
          <Button text='Add' className='button-form' onClick={handleAddContact} />
        </div>
      </div>
      <Suspense>     
        {user && user !== undefined &&
          user.connections.map((friend: Connection) => 
            // Iterating users connections and creating a UserListItem of each connection
            // Setting prop unseenMsg true if the unseen column of table unseen_msgs is true 
            // on the connection currently handled.
            <UserListItem 
              key={friend.user_id}
              friend={friend}
              unseenMsg={unseenMessages.find(
                (o: UnseenMsgIdentifier) => 
                  o.connection_id === Number(friend.connection_id) && o.unseen)
                  ? true
                  : false
              }              
            />
          )
        }
      </Suspense>
    </div>
  )
}
