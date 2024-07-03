import React, { useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useAuth } from '../context/AuthContext'

// The component for login form.
export const Login = () => {
  const { user, userLogin } = useAuth()
  const userNameRef = useRef<HTMLInputElement>(null)
  const pwdRef = useRef<HTMLInputElement>(null)
  
  // If there's a logged user, redirecting to contacts page.
  if (user !== undefined) return <Navigate to='/' />

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    
    userLogin({
      name: (userNameRef.current?.value as string).trim(),
      pwd: (pwdRef.current?.value as string).trim()
    }, form)
  }
  
  return (
    <div className='form'>
      <h1>Login</h1>
      <form className='grid' onSubmit={(e) => handleLogin(e)}>
        <label htmlFor='userName'>Username</label>
        <Input id='userName' required ref={userNameRef}/>
        <label htmlFor='pwd'>Password</label>
        <Input id='pwd' className='grid-item' type='password' required ref={pwdRef}/>
        <Button
          id='login-btn'
          type='submit'
          text='Login'
          className='button-form'
        />
      </form>
    </div>
  )
}