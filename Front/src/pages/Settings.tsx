import React, { useState } from 'react'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { imgReader } from '../utils/helpers'
import ImgPreview from '../components/ImgPreview'

// Component for user settings. For now, only the user image can be changed.
const Settings = () => {  
  const navigate = useNavigate()
  const { user, editUser } = useAuth()
	const [attachment, setAttachment] = useState<string>(user?.img ? user.img : '')
  
  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const form = e.target as HTMLFormElement
      editUser(user?.user_id as number, attachment)			
      form.reset()
      navigate('/')
    } catch (err) {
      console.log('error:', err)
    }
  }
  
  return (
    <div className='form'>
      <h1 style={{ margin: '1em' }}>{user?.name}</h1>
      <form className='grid-settings' onSubmit={(e) => handleSaveSettings(e)}>        
				<p>Profile image</p>
				<label htmlFor='input-file' className='grid-item'>
          <ImgPreview
            className='settings'
            attachment={ attachment }
            setAttachment={ setAttachment }
          />
				</label>
				<input
					type='file'
					id='input-file'
					accept='image/png, image/jpeg, image/gif'
					onChange={async ({ target }) => {
						if (target.files) {
							const img = await imgReader(target.files, 50)
							setAttachment(img as string)
						}
					}
        }/>
        <Button
          type='submit'
          text='Save'
          className='button-form'
        />
				<Button
          text='Cancel'
          className='button-form button-cancel'
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        />
      </form>
    </div>
  )
}

export default Settings