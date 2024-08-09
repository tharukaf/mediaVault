import { useState } from 'react'
import VaultSideBar from './VaultSideBar'
import { Outlet } from 'react-router-dom'
import '@fontsource/roboto/700.css'
import '../../styles/vault.css'

export default function VaultLayout() {
  const [view, setView] = useState('list')

  return (
    <div className="vault-flex-container">
      <VaultSideBar view={view} setView={setView} />
      <div className="vault-items-view">
        <Outlet />
      </div>
    </div>
  )
}
