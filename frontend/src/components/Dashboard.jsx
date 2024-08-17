// import React from 'react'
import { Outlet } from 'react-router-dom'
import ResponsiveAppBar from './NavBar'

export default function Dashboard() {
  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  )
}
