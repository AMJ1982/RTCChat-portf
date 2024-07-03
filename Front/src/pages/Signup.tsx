import React, { useRef, useState } from 'react'
import ImgPreview from '../components/ImgPreview'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { imgReader } from '../utils/helpers'

// A form for signing up as a new user.
export const Signup = () => {
  const { createUser } = useAuth()
  const navigate = useNavigate()
  const userNameRef = useRef<HTMLInputElement>(null)
  const pwdRef = useRef<HTMLInputElement>(null)
  const imageUrlRef = useRef<HTMLInputElement>(null)
  const [attachment, setAttachment] = useState<string>('')

  // Handling the request to create a new user.
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const form = e.target as HTMLFormElement
      await createUser({
        name: userNameRef.current?.value as string,
        pwd: pwdRef.current?.value as string,
        img: imageUrlRef.current?.value as string,
      })
      form.reset()
      navigate('/')
    } catch (err) {
      console.log('error:', err)
    }
  }

  return (
    <div className='form'>
      <h1>Sign up</h1>
      <form className='grid' onSubmit={(e) => handleCreateUser(e)}>
        <label htmlFor='userName'>Username</label>
        <Input id='userName' className='input' required ref={userNameRef}/>
        <label htmlFor='pwd'>Password</label>
        <Input id='pwd' type='password' className='input' required ref={pwdRef}/>
        <label htmlFor='pwd'>Profile image</label>
        <label htmlFor='input-file'>
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
            // File input for user image. If an image file is selected, it's resized and converted into base64 format.
						if (target.files) {
							const img = await imgReader(target.files, 50)
							setAttachment(img as string)
						}
					}
        }/>
        <Button
          id='signup-btn'
          text='Sign up'
          className='button-form'
        />
      </form>
    </div>
  )
}