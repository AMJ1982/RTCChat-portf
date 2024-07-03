import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faBell, faSignOut, faTrash, faBroom } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { askNotificationPermission, enableSub, disableSub } from '../utils/helpers'
import { LoggedUser } from '../types'

interface UserMenuProps {
  user: LoggedUser
}

// Settings for user menu containing a link to Settings view, a slider for enabling and disabling push notifications,
// and some additional administration tools. This component is wrapped inside a Dropdown component in Nav.
const UserMenu: React.FunctionComponent<UserMenuProps> = ({ user }): JSX.Element => {
  const { handleLogout, setUser, clearVisitor } = useAuth()
  const [checked, setChecked] = useState<boolean | null>(user.pushNotifications)
  const showNotification = useNotification()

  if ((!user || user === undefined) || (checked === null || checked === undefined)) {
    return <div></div>
  }

  // Handler method for slider.
  const handleChange = (checkedValue: boolean) => {
    setChecked(checkedValue)
    
    checkedValue
      ? enableSub(user.user_id)
      : disableSub(user.user_id)
    
    setUser({
      ...user,
      pushNotifications: checkedValue
    })
  }

  return (
    <>
      <div className='dropdown-header'>{user.name.replace(/_/g, ' ')}</div>
      <div className={`separator-line`}></div>
      <Link className='link' to={'/settings'}>
        <div className='icon-div'>
          <FontAwesomeIcon icon={faCog} />
        </div>
        Settings
      </Link>
      <div className='link'>
        <div className='icon-div'>
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div>
          Notifications
          <label className='switch'>
            <input
              type='checkbox'
              checked={checked}
              onChange={async ({ target }) => {
                const checked = target.checked
                if (await askNotificationPermission() !== 'granted') {
                  // If notification permission is denied in browser settings, the permission can't be granted on code level.
                  // Prompting the user to enable the feature.
                  showNotification('Enable permission for notifications from browser settings!', 'error')
                  handleChange(false)
                  return
                }

                handleChange(checked)
            }}/>
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      {user.name === 'Antti' &&
        <>
          <div className='link'
            onClick={async () => {
              let reg = await navigator.serviceWorker.ready
              let sub = await reg.pushManager.getSubscription()
              console.log('Registered subscription: ', sub)
              if (sub && confirm('Clear subscription?')) {                
                await sub.unsubscribe()
              }
            }}
          >
            <div className='icon-div'>
              <FontAwesomeIcon icon={faTrash} />
            </div>
            Delete sub
          </div>
          <div className='link' onClick={() => {
              clearVisitor()              
            }
          }>
          <div className='icon-div'>
            <FontAwesomeIcon icon={faBroom} />
          </div>
          Clear Visitor
        </div>
        </>
      }
      <div className='link' id='logout' onClick={() => handleLogout()}>
        <div className='icon-div'>
          <FontAwesomeIcon className='icon' icon={faSignOut} />
        </div>
        Log out
      </div>      
    </>
  )
}

export default UserMenu