import React, { useState } from 'react'
import { Button } from '../components/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import { ApolloError, useMutation } from '@apollo/client'
import { EDIT_MESSAGE } from '../graphql/queries'

// Editing tools for own messages. The message text is received through location.state.
const EditMsg = () => {
  const location = useLocation()	
  const navigate = useNavigate()
	if (!location.state) navigate('/')
  const { node } = location.state
	const [text, setText] = useState<string>(node.message_text || '')

	const [editMessage] = useMutation(EDIT_MESSAGE, {
    onError: (err: ApolloError) => {
      console.log(err)
      //showNotification(getErrorMessage(err) as string, 'error')
    }
  })

  // Handler method for updating the changes to the message.
  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
		
		if (text === '') return
    
		try {
			await editMessage({
        variables: {
          user_id: node.user_id,
					message_id: node.message_id,
          message_text: text,
        }
      })
			navigate(-1)
    } catch (err) {
      console.log('error:', err)
    }
  }
  
  return (
    <div>
      <form onSubmit={(e) => handleSaveSettings(e)} id='edit-form'>
      <h1 style={{ margin: '1em' }}>Edit message</h1>
        <textarea 
          id='edit-msg-input'
          value={text}
          autoFocus
          onChange={({ target }) => setText(target.value)}
          onFocus={({ target }) => target.selectionStart = target.value.length}
          rows={3}
          onKeyDown={(e) => {
            // If enter is pressed, the submit of this form is called.
            if (e.key === 'Enter' && e.shiftKey == false) {
              e.preventDefault()
              const form = document.getElementById('edit-form') as HTMLFormElement
              form.requestSubmit()                
            }
          }}
        />
        <div className='link-group' style={{ 'margin': '2em', 'gap': '3em'}}>
          <Button
            type='submit'
            text='Save'
            className='button-form'
            disabled={text === ''}
            style={{ padding: '0.2em'}}
          />          
          <Button
            text='Cancel'
            className='button-form button-cancel'
            onClick={(e) => {
              e.preventDefault()
              navigate(-1)
            }}
            style={{ padding: '0.2em'}}
          />
        </div>
      </form>
    </div>
  )
}

export default EditMsg