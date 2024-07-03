import React from 'react'
import { Outlet } from 'react-router-dom'
import { FullScreenCard } from '../../components/FullScreenCard'

// The layout for settings view.
const SettingsLayout = () => {

  return (
    <FullScreenCard>
			<FullScreenCard.Body style={{ maxWidth: '600px' }}>
				<Outlet />
			</FullScreenCard.Body>    	
    </FullScreenCard>    
  )
}

export default SettingsLayout