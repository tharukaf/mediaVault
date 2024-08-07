import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Outlet, NavLink } from 'react-router-dom'
import '@fontsource/roboto/700.css'

export default function MyVault() {
  return (
    <>
      <Tabs
        // value={value}
        // onChange={handleChange}
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
        <Tab label="TV" />
        <Tab label="Item Three" />
        <Tab label="Item Four" />
        <Tab label="Item Five" />
        <Tab label="Item Six" />
        <Tab label="Item Seven" />
      </Tabs>
      <Outlet />
    </>
  )
}
