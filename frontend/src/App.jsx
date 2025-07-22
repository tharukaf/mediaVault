import { Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import UserProfile from './components/User/UserProfile'
import Search from './components/Search/Search'
import VaultLayout from './components/Vault/VaultLayout'
import Curator from './components/Curator/Curator'
import VaultViewer from './components/Vault/VaultViewer'
import StarBackground from './utils/StarBackground'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './utils/UserContext'
import CreateUserForm from './components/User/CreateUserForm'
import LoginForm from './components/User/LoginForm'
import MediaItemViewer from './components/Vault/MediaItemViewer'

function App() {
  return (
    <AuthProvider>
      <StarBackground />
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Search />} />
          <Route path="myvault" element={<VaultLayout />}>
            <Route index element={<VaultViewer />} />
            <Route path=":media" element={<VaultViewer />} />
            <Route path=":media/:id" element={<MediaItemViewer />} />
          </Route>
          <Route path="curator" element={<Curator />}></Route>
          <Route path="login" element={<LoginForm />} />
          <Route path="createuser" element={<CreateUserForm />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
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
