// import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import ResponsiveAppBar from './NavBar'

export default function Dashboard() {
  return (
    <>
      <ResponsiveAppBar />
      <br />
      <NavLinkButton to={'/'}>Home</NavLinkButton>
      <NavLinkButton to={'/myvault'}>My Vault</NavLinkButton>
      <NavLinkButton to={'/curator'}>Curator</NavLinkButton>
      <br />
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
    <NavLink
      style={({ isActive }) => (isActive ? activeButton : notActive)}
      to={to}>
      {children}
    </NavLink>
  )
}
