import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button, CircularProgress, TextField, Alert, Link } from '@mui/material'
import { ErrMessage } from './UserForm'
import UserForm from './UserForm'
import { useAuth } from '../../utils/UserContext'
import { useNavigate } from 'react-router'
import { validationRules, validateForm, sanitizeInput } from '../../utils/validation'
import PasswordStrengthIndicator from './PasswordStrengthIndicator'

export default function CreateUserForm() {
  const [loading, setLoading] = useState(false)
  const { register: registerUser, error, clearError } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const watchedPassword = watch('password', '')

  async function onSubmit(formData) {
    setLoading(true)
    clearError()

    // Additional client-side validation
    const validation = validateForm(formData, 'register')
    if (!validation.isValid) {
      setLoading(false)
      // The errors will be shown by react-hook-form
      return
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      password: formData.password // Don't sanitize password
    }

    try {
      const result = await registerUser(sanitizedData.email, sanitizedData.name, sanitizedData.password)

      setTimeout(() => {
        setLoading(false)
      }, 1000)

      if (result.success) {
        navigate('/')
      }
    } catch (error) {
      setLoading(false)
      console.error('Registration error:', error)
    }
  }

  return (
    <UserForm title="Create Account">
      {error && (
        <Alert
          severity="error"
          sx={{ marginBottom: '16px' }}
          action={
            error.includes('already exists') ? (
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ color: 'white', textDecoration: 'underline' }}
              >
                Login instead
              </Link>
            ) : null
          }
        >
          {error}
        </Alert>
      )}
      <TextField
        label="Name"
        style={{ marginTop: '11px' }}
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name', validationRules.name)}
      />
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
        {...register('password', validationRules.password)}
      />
      <PasswordStrengthIndicator password={watchedPassword} />
      {errors.name && <ErrMessage errors={errors} elementID="name" />}
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
        {loading ? <CircularProgress /> : 'Create Account'}
      </Button>
    </UserForm>
  )
}
