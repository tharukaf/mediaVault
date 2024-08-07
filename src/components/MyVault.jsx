import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
// import Typography from '@mui/material/Typography'
// import Box from '@mui/material/Box'
import { Outlet, NavLink } from 'react-router-dom'
import '@fontsource/roboto/700.css'

export default function MyVaultLayout() {
  const [value, setValue] = useState(1)

  function handleChange() {
    console.log('heh')
  }

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        orientation="vertical"
        scrollButtons={false}
        aria-label="scrollable prevent tabs">
        <NavLink to="movies">
          <Tab label="Movies" />
        </NavLink>
        <NavLink to="tv">
          <Tab label="tv" />
        </NavLink>
        <NavLink to="music">
          <Tab label="Music" />
        </NavLink>
        <NavLink to="games">
          <Tab label="Games" />
        </NavLink>
        <NavLink to="books">
          <Tab label="books" />
        </NavLink>
      </Tabs>
      <Outlet />
    </>
  )
}
