import { useEffect, useState } from 'react'
import VaultSideBar from './VaultSideBar'
import { Outlet } from 'react-router-dom'
import '@fontsource/roboto/700.css'
import '../../styles/vault.css'
import { useAuth } from '../../App'
import { useNavigate } from 'react-router-dom'

export default function VaultLayout() {
  const [view, setView] = useState('list')
  const user = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.currentUser.token) {
      // navigate('/login')
    }
  })
  return (
    <div className="vault-flex-container">
      <VaultSideBar view={view} setView={setView} />
      <div className="vault-items-view">
        {/* <Outlet /> */}
        {user.currentUser.token && <Outlet />}
      </div>
    </div>
  )
}
