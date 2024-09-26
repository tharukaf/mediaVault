import { useForm } from 'react-hook-form'
import { baseURL } from '../../utils/FetchData'
import { useState } from 'react'
import { Typography, Button, TextField } from '@mui/material'

import { ErrMessage } from './UserForm'
import UserForm from './UserForm'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '../../utils/UserContext'
import { useNavigate } from 'react-router'
import { authHelper } from '../../utils/AuthHelper'
import { loginRequestOptions } from '../../utils/FetchOptionObjects'

export default function LoginForm() {
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
        `${baseURL}login`,
        loginRequestOptions(formData)
      )
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      if (response.status === 200) {
        authHelper('cookie/refresh', formData.email, setCurrentUser)
        navigate('/')
      }
      setIsLoggedIn(true)
      setLoading(false)
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <UserForm title="Login to MediaVault">
      <TextField
        {...register('email', {
          required: {
            value: true,
            message: 'You must specify an email',
          },
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
        })}
        style={{ marginTop: '11px' }}
        label="Email"
      />

      <TextField
        type="password"
        label="Password"
        style={{ marginTop: '11px' }}
        {...register('password', {
          required: 'You must specify a password',
        })}
      />
      {errors.email?.message && (
        <ErrMessage errors={errors} elementID="email" />
      )}

      {errors.password?.message && (
        <ErrMessage errors={errors} elementID="password" />
      )}

      <Button
        onClick={handleSubmit(onSubmit)}
        variant="contained"
        style={{ marginTop: '20px', marginBottom: '10px' }}>
        {loading ? <CircularProgress /> : 'Login'}
      </Button>
      <Button
        onClick={() => navigate('/createuser')}
        color="success"
        variant="contained"
        style={{ marginTop: '20px', marginBottom: '10px' }}>
        <Typography style={{ textDecoration: 'none' }}>
          Create Account
        </Typography>
      </Button>
    </UserForm>
  )
}
