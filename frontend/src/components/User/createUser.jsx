import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  colors,
} from '@mui/material'
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../utils/UserContext'
import passwordValidator from 'password-validator'
import { baseURL } from '../../utils/FetchData'
import CircularProgress from '@mui/material/CircularProgress'

export default function CreateUser() {
  const { currentUser, setCurrentUser } = useContext(UserContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isNameError, setIsNameError] = useState(false)
  const [isEmailError, setIsEmailError] = useState(false)
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [isUsernameError, setIsUsernameError] = useState(false)
  const [firstClicked, setFirstClicked] = useState(false)
  const [userForm, setUserForm] = useState({ password: '' })
  const [responseError, setResponseError] = useState()
  const [loading, setLoading] = useState(false)

  let schema = new passwordValidator()
  schema.is().min(8).max(30)

  function validateForm() {
    setIsNameError(userForm.name ? false : true)
    setIsEmailError(userForm.email ? false : true)
    setIsUsernameError(userForm.username ? false : true)
    setIsPasswordError(schema.validate(userForm.password))

    return !isNameError && !isEmailError && !isPasswordError && !isUsernameError
  }

  useEffect(() => {
    console.log(currentUser)
  }, [isLoggedIn])

  async function handleCreateUser() {
    setLoading(true)
    setFirstClicked(true)

    if (validateForm()) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      }
      console.log(userForm)
      try {
        const data = await fetch(`${baseURL}users`, requestOptions)
        setTimeout(() => {
          setLoading(false)
        }, 1000)

        setIsLoggedIn(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  function handleFormChange(e) {
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
      <Typography>Create an Account</Typography>
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
          required={true}
          id="name"
          onChange={handleFormChange}
          style={{ marginTop: '7px' }}
          error={isNameError}
          label="Name"
        />
        <TextField
          required={true}
          id="email"
          onChange={handleFormChange}
          style={{ marginTop: '7px' }}
          error={isEmailError}
          label="Email"
        />
        <TextField
          required={true}
          onChange={handleFormChange}
          style={{ marginTop: '7px' }}
          error={isUsernameError}
          id="username"
          label="Username"
        />
        <TextField
          required={true}
          onChange={handleFormChange}
          error={!isPasswordError}
          style={{ marginTop: '15px' }}
          id="password"
          label="Password"
          type="password"
        />
        <Button
          onClick={handleCreateUser}
          variant="contained"
          style={{ marginTop: '20px', marginBottom: '10px' }}>
          {loading ? <CircularProgress /> : 'Create Account'}
        </Button>
        {firstClicked &&
          schema.validate(userForm.password, { details: true }).map(item => (
            <Typography key={item.index} sx={{ color: 'error.main' }}>
              {item.message}
            </Typography>
          ))}
        {responseError && 'User Already Exists'}
      </Paper>
    </Box>
  )
}
