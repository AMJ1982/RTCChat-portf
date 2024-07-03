import React from 'react'
import { Button } from './Button'
import { ConfirmProps } from '../types'

// Confirmation dialog for receiving push notifications. Functions provided by useDialog hook are wired up to the buttons.
const Confirm = ({ onConfirm, onCancel }: ConfirmProps) => {
    
  return (
    <div className='card-body' style={{ width: '100%' }}>      
      <h4 style={{ margin: '1em' }}>Allow RTTChat to send notifications about new messages?</h4>
        
        <div className='link-group' style={{ 'margin': '2em', 'gap': '3em'}}>
          <Button
            text='Allow'
            className='button-form'
            style={{ padding: '0.2em'}}
            onClick={async (e) => {
							onConfirm()
            }}
          />          
          <Button
            text='Deny'
            className='button-form button-cancel'            
            style={{ padding: '0.2em'}}
            onClick={async (e) => {
							onCancel()
            }}
          />
        </div>
    </div>
  )
}

export default Confirm