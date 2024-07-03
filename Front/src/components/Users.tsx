import React from 'react'
import { UserListItem } from './UserListItem'
import { useQuery } from '@apollo/client'
import { ALL_USERS } from '../graphql/queries'
import { LoggedUser } from '../types'


export const Users = () => {
  const users = useQuery(ALL_USERS)
  
  return (
    <div className='list'>
      <h1>Contacts</h1>      
      {users.data !== undefined && users.data.allUsers.map((user: LoggedUser) => 
        <UserListItem key={user.name} user={user}/>
      )}    
    </div>
  )
}