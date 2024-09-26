import { useForm } from 'react-hook-form'
import { baseURL } from '../../utils/FetchData'
import { useState } from 'react'
import { Button, CircularProgress, TextField } from '@mui/material'
import { ErrMessage } from './UserForm'
import UserForm from './UserForm'
import { useAuth } from '../../utils/UserContext'
import { useNavigate } from 'react-router'
import { authHelper } from '../../utils/AuthHelper'
import { createUserRequestOptions } from '../../utils/FetchOptionObjects'

export default function CreateUserForm() {
  const [loading, setLoading] = useState(false)
  const { setCurrentUser } = useAuth()
  // eslint-disable-next-line no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit(formData) {
    setLoading(true)

    try {
      const response = await fetch(
        `${baseURL}users`,
        createUserRequestOptions(formData)
      )
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      if (response.status === 200) {
        authHelper('cookie/refresh', formData.email, setCurrentUser)
        navigate('/')
      }
      setIsLoggedIn(true)
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <UserForm title="Create Account">
      <TextField
        label="Name"
        style={{ marginTop: '11px' }}
        {...register('name', {
          required: true,
          maxLength: {
            value: 15,
            message: 'Name is too long',
          },
        })}
      />
      <TextField
        {...register('email', {
          required: true,
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          maxLength: { value: 32, message: 'Email is too long' },
        })} // pattern: /^\S+@\S+$/i
        style={{ marginTop: '11px' }}
        label="Email"
      />
      <TextField
        type="text"
        label="Username"
        style={{ marginTop: '11px' }}
        {...register('username', {
          required: true,
          maxLength: {
            value: 15,
            message: 'Username is too long',
          },
        })}
      />
      <TextField
        type="password"
        label="Password"
        style={{ marginTop: '11px' }}
        {...register('password', {
          required: true,
          maxLength: { value: 32, message: 'Password is too long' },
          minLength: { value: 8, message: 'Password is too short' },
        })}
      />
      {errors.name?.message && <ErrMessage errors={errors} elementID="name" />}
      {errors.email?.message && (
        <ErrMessage errors={errors} elementID="email" />
      )}
      {errors.username?.message && (
        <ErrMessage errors={errors} elementID="username" />
      )}
      {errors.password?.message && (
        <ErrMessage errors={errors} elementID="password" />
      )}

      <Button
        onClick={handleSubmit(onSubmit)}
        variant="contained"
        style={{ marginTop: '20px', marginBottom: '10px' }}>
        {loading ? <CircularProgress /> : 'Create Account'}
      </Button>
    </UserForm>
  )
}
