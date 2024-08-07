/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Search from './components/Search'
import MyVault from './components/MyVault'
import Curator from './components/Curator'
import VaultViewer from './components/VaultViewer'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Search />} />
          <Route path="myvault" element={<MyVault />}>
            <Route index element={<VaultViewer/>} />
            <Route path=":media" element={<VaultViewer />} />
          </Route>
          <Route path="curator" element={<Curator />}></Route>
        </Route>
      </Routes>
    </>
  )
}
