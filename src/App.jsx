/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Search from './components/Search/Search'
import MyVaultLayout from './components/MyVault'
import Curator from './components/Curator'
import VaultViewer from './components/VaultViewer'
import StarBackground from './utils/StarBackground'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

function App() {
  return (
    <>
      <StarBackground />
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Search />} />
          <Route path="myVault" element={<MyVaultLayout />}>
            <Route index element={<VaultViewer />} />
            <Route path=":media" element={<VaultViewer />} />
          </Route>
          <Route path="curator" element={<Curator />}></Route>
        </Route>
      </Routes>
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
