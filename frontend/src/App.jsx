/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Search from './components/Search/Search'
import VaultLayout from './components/Vault/VaultLayout'
import Curator from './components/Curator/Curator'
import VaultViewer from './components/Vault/VaultViewer'
import StarBackground from './utils/StarBackground'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Login, { authHelper } from './components/User/login'
import { AuthContext, useAuth } from './utils/UserContext'
import CreateUser from './components/User/createUser'
import CreateUserForm from './components/User/CreateUserForm'
import MediaItemViewer from './components/Vault/MediaItemViewer'

// axios.defaults.withCredentials = true

function App() {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('token')
      ? {
          token: localStorage.getItem('token'),
          email: localStorage.getItem('email'),
          name: localStorage.getItem('name'),
        }
      : {
          name: 'Guest',
          email: null,
          token: null,
        }
  )

  useEffect(() => {
    if (localStorage.getItem('token')) {
      authHelper(
        'cookie/refresh',
        localStorage.getItem('email'),
        setCurrentUser
      )
    }
  }, [])

  return (
    <>
      <StarBackground />
      <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Search />} />
            <Route path="myvault" element={<VaultLayout />}>
              <Route index element={<VaultViewer />} />
              <Route path=":media" element={<VaultViewer />} />
              <Route path=":media/:id" element={<MediaItemViewer />} />
            </Route>
            <Route path="curator" element={<Curator />}></Route>
            <Route path="login" element={<Login />} />
            <Route path="createuser" element={<CreateUserForm />} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </>
  )
}

export default function AppWrapper() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}
