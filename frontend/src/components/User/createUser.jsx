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

export default function CreateUser() {
  const { currentUser, setCurrentUser } = useContext(UserContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isPasswordError, setIsPasswordError] = useState(false)
  const [isUsernameError, setIsUsernameError] = useState(false)
  const [firstClicked, setFirstClicked] = useState(false)
  const [userForm, setUserForm] = useState({ passwordText: '' })

  let schema = new passwordValidator()
  schema.is().min(8).max(30)

  useEffect(() => {
    console.log(currentUser)
  }, [isLoggedIn])

  function handleLogin() {
    setFirstClicked(true)
    console.log(userForm.passwordText)
    if (!schema.validate(userForm.passwordText)) {
      setIsPasswordError(true)
    } else {
      setIsPasswordError(false)
    }
    if (!userForm.usernameText) {
      setIsUsernameError(true)
    } else {
      setIsUsernameError(false)
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
          onChange={handleFormChange}
          style={{ marginTop: '7px' }}
          error={isUsernameError}
          id="nameText"
          label="Name"
        />
        <TextField
          onChange={handleFormChange}
          style={{ marginTop: '7px' }}
          error={isUsernameError}
          id="email"
          label="Email"
        />
        <TextField
          onChange={handleFormChange}
          style={{ marginTop: '7px' }}
          error={isUsernameError}
          id="usernameText"
          label="Username"
        />
        <TextField
          onChange={handleFormChange}
          error={isPasswordError}
          style={{ marginTop: '15px' }}
          id="passwordText"
          label="Password"
          type="password"
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          
          style={{ marginTop: '20px', marginBottom: '10px' }}>
          Login
        </Button>
        {firstClicked &&
          schema
            .validate(userForm.passwordText, { details: true })
            .map(item => (
              <Typography key={item.index} sx={{ color: 'error.main' }}>
                {item.message}
              </Typography>
            ))}
      </Paper>
    </Box>
  )
}
