/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Search from './components/Search'
import MyVaultLayout from './components/MyVault'
import Curator from './components/Curator'
import VaultViewer from './components/VaultViewer'
import StarBackground from './components/StarBackground'

export default function App() {
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
