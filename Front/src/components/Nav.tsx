import React, { lazy } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'
import { isDecember } from '../utils/helpers'
const Dropdown = lazy(() => import('./Dropdown'))
const UserMenu = lazy(() => import('./UserMenu'))
const Candles = lazy(() => import('./Candles'))

// Component for navigation bar.
export const Nav: React.FC  = () => {
  const { user } = useAuth()

  return (
    <div id='nav'>
      <Link className='nav-item' id='logo' to='/'>RTCC</Link>
      {isDecember() ? <Candles /> : null}
      <div className='link-group'>
        {user &&
        // If user is logged, user profile image is shown. If user hasn't defined an image, the default user icon is used.
        <div className='nav-item icon-div dropdown' data-dropdown>
          {user.img
            ? <img className='user-img' src={user.img} style={{ pointerEvents: 'none' }}/> 
            : <FontAwesomeIcon className='icon' icon={faUser}/>
          }          
            <Dropdown>
              <UserMenu user={ user } />  
            </Dropdown>              
        </div>}
      </div>
    </div>
  )
}