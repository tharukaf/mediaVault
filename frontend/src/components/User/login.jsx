import { Box, Paper, Typography, Button, TextField } from '@mui/material'

import { useState, useContext } from 'react'
import { AuthContext } from '../../utils/UserContext'
import passwordValidator from 'password-validator'
import { useNavigate } from 'react-router-dom'
import { baseURL } from '../../utils/FetchData'
import Cookies from 'js-cookie'
import { useAuth } from '../../App'

// axios.defaults.withCredentials = true

export default function Login() {
  const { currentUser, setCurrentUser } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [isEmailError, setIsEmailError] = useState(false)
  const [firstClicked, setFirstClicked] = useState(false)
  const [userForm, setUserForm] = useState({ password: '' })
  const [isLoginError, setIsLoginError] = useState(false)
  const navigate = useNavigate()

  let schema = new passwordValidator()
  schema.is().min(8).max(30)

  function handleCreateAccountRoute() {
    navigate('/createuser')
  }

  async function fetchUserData() {
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
    }
    const res = await fetch(`${baseURL}login`, requestOptions)
    fetchHelper('cookie/refresh', userForm.email, setCurrentUser)

    if (res.status === 200) {
      setIsLoggedIn(true)
      navigate('/')
    } else {
      setIsLoginError(true)
    }
  }

  function validateForm() {
    setIsEmailError(userForm.email ? false : true)
    setIsPasswordError(schema.validate(userForm.password))
    return !isEmailError && !isPasswordError
  }

  function handleLogin() {
    setFirstClicked(true)
    if (validateForm()) {
      fetchUserData()
    }
  }

  async function handleFormChange(e) {
    const target = e.target
    setUserForm(prev => {
      return { ...prev, [target.id]: target.value }
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}>
      <Typography>Login to MediaVault</Typography>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: 'flex',
          width: '40%',
          flexDirection: 'column',
          margin: '5px',
        }}>
        <TextField
          onChange={handleFormChange}
          style={{ marginTop: '7px' }}
          error={isEmailError}
          id="email"
          label="Email"
        />
        <TextField
          onChange={handleFormChange}
          error={isPasswordError}
          style={{ marginTop: '15px' }}
          id="password"
          label="Password"
          type="password"
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          style={{ marginTop: '20px', marginBottom: '10px' }}>
          Login
        </Button>
        <Button
          color="success"
          onClick={handleCreateAccountRoute}
          variant="contained"
          style={{ marginTop: '20px', marginBottom: '10px' }}>
          <Typography style={{ textDecoration: 'none' }}>
            Create Account
          </Typography>
        </Button>
        {firstClicked &&
          schema.validate(userForm.password, { details: true }).map(item => (
            <Typography key={item.index} sx={{ color: 'error.main' }}>
              {item.message}
            </Typography>
          ))}
        {isLoginError && (
          <Typography sx={{ color: 'error.main' }}>
            Email or password is incorrect
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export async function fetchHelper(path, email, mSetCurrentUser) {
  const res = await fetch(`${baseURL}${path}/${email}`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })

  const data = await res.json()
  mSetCurrentUser({ name: data.name, email: data.email, token: data.token })
}
