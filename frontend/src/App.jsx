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
import Login from './components/User/login'
import { createContext } from 'react'
import { AuthContext } from './utils/UserContext'
import CreateUser from './components/User/createUser'
import axios from 'axios'
import { baseURL } from './utils/FetchData'

// axios.defaults.withCredentials = true

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Guest',
    email: '',
    token: '',
  })
  const [token, setToken] = useState(localStorage.getItem('site') || '')

  // useEffect(() => {
  //   async function fetchUser() {
  //     const options = {
  //       method: 'GET',
  //       mode: 'cors',
  //       credentials: 'include',
  //     }
  //     const url = `${baseURL}userdata`
  //     const data = await fetch(url, options)
  //   }
  //   const user = fetchUser()
  // }, [currentUser])

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
            </Route>
            <Route path="curator" element={<Curator />}></Route>
            <Route path="login" element={<Login />} />
            <Route path="createuser" element={<CreateUser />} />
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

export const useAuth = () => {
  return useContext(AuthContext)
}
