import { useForm } from 'react-hook-form'
import { baseURL } from '../../utils/FetchData'
import { useState } from 'react'
import { Box, Paper, Typography, Button, TextField } from '@mui/material'
import { ErrorMessage } from '@hookform/error-message'
import { ErrMessage } from './UserForm'
import UserForm from './UserForm'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '../../utils/UserContext'
import { useNavigate } from 'react-router'
import { authHelper } from './login'

export default function CreateUserForm() {
  const [loading, setLoading] = useState(false)
  const { currentUser, setCurrentUser } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit(formData) {
    console.log(formData)
    setLoading(true)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }
    try {
      const response = await fetch(`${baseURL}users`, requestOptions)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      if (response.status === 200) {
        console.log('data: ', formData)
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
