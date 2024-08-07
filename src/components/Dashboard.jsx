// import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import ResponsiveAppBar from './NavBar'

export default function Dashboard() {
  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  )
}

const activeButton = {
  color: 'yellow',
  padding: '6px',
}

const notActive = {
  color: 'white',
  padding: '6px',
}

function NavLinkButton({ to, children }) {
  return (
    <>
      <NavLink
        style={({ isActive }) => (isActive ? activeButton : notActive)}
        to={to}>
        {children}
      </NavLink>
    </>
  )
}
