import React from 'react'
import { Outlet, Link, useLocation  } from 'react-router-dom'
import { FullScreenCard } from '../../components/FullScreenCard'
import { isDecember } from '../../utils/helpers'

// The layout component used for showing login and registering forms.
const AuthLayout = () => {
  // Current location for showing correct link under the card.
  const { pathname } = useLocation()

  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <Outlet />
      </FullScreenCard.Body>
      <FullScreenCard.Below>
        <Link 
          className={`card-below-link ${isDecember()}`}
          to={pathname === '/login' ? '/signup' : '/login'}
        >{pathname === '/login' ? 'Create account' : 'Login'}</Link>
      </FullScreenCard.Below>      
    </FullScreenCard>    
  )
}

export default AuthLayout