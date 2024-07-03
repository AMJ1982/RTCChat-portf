import React from 'react'
import { Connection } from '../types'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

// A component representing a connection in users friend list. Displays the avatar and the name of friend.
// If there are unseen messages in the conversation, an alert is shown.
const UserListItem: React.FC<{ friend: Connection, unseenMsg: boolean }> = ({ friend, unseenMsg }) => {  
  return (
    <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/chat/${friend.user_id}`}>
      <div className='list-item'>
        <div className='link-group'>
          {friend.img 
            ? <img className='user-img' src={friend.img}/>
            : <div className='user-img'>
                <FontAwesomeIcon className='icon' style={{ color: 'white' }} icon={faUser}/>
              </div>
          }
          <p style={{ pointerEvents: 'none' }}>{friend.name}</p>
        </div>
        {unseenMsg && <div className='alert'>!</div>}
      </div>
    </Link>
  )
}

export default UserListItem