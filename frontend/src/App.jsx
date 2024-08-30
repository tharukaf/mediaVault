/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
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
import { UserContext } from './utils/UserContext'
import CreateUser from './components/User/createUser'

function App() {
  const [currentUser, setCurrentUser] = useState('Guest')

  return (
    <>
      <StarBackground />
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
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
      </UserContext.Provider>
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
