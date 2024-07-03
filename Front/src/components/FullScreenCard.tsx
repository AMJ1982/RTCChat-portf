import React from 'react'
import { FullScreenCardProps, CardBodyProps } from '../types'

// A compound component for showing forms. The actual form is set into Body property, Below is for
// navigating between login and sign up forms.
// The component is used in AuthLayout and message editing.
export const FullScreenCard = ({ children }: FullScreenCardProps) => {
  return (
    <div className='card-bg'>
      { children }
    </div>
  )
}

FullScreenCard.Body = ({ children, ...rest }: CardBodyProps) => {
  return (
    <div className={`card-body`} {...rest}>
      {children}
    </div>
  )
}

FullScreenCard.Below = ({ children }: FullScreenCardProps) => {
    return (
      <div className='card-below'>
        {children}
      </div>
    )
  }