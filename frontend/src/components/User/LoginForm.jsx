import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Typography, Button, TextField, Alert, Link } from '@mui/material'

import { ErrMessage } from './UserForm'
import UserForm from './UserForm'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '../../utils/UserContext'
import { useNavigate } from 'react-router'
import { validationRules, validateForm, sanitizeInput } from '../../utils/validation'

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit(formData) {
    setLoading(true)
    setError('')

    // Additional client-side validation
    const validation = validateForm(formData, 'login')
    if (!validation.isValid) {
      setLoading(false)
      return
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(formData.email),
      password: formData.password // Don't sanitize password
    }

    try {
      const result = await loginUser(sanitizedData.email, sanitizedData.password)

      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserForm title="Login to MediaVault">
      {error && (
        <Alert
          severity="error"
          sx={{ marginBottom: '16px' }}
          action={
            error.includes('Invalid email or password') ? (
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/createuser')}
                sx={{ color: 'white', textDecoration: 'underline' }}
              >
                Create account
              </Link>
            ) : null
          }
        >
          {error}
        </Alert>
      )}
      <TextField
        {...register('email', validationRules.email)}
        style={{ marginTop: '11px' }}
        label="Email"
        type="email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        type="password"
        label="Password"
        style={{ marginTop: '11px' }}
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password', validationRules.loginPassword)}
      />
      {errors.email && (
        <ErrMessage errors={errors} elementID="email" />
      )}

      {errors.password && (
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
