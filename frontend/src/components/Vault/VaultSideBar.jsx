import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import MovieIcon from '@mui/icons-material/Movie'
import { NavLink } from 'react-router-dom'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function VaultSideBar({ view, setView }) {
  //   const [view, setView] = React.useState('list')

  const handleChange = (event, nextView) => {
    setView(nextView)
  }

  const theme = useTheme()
  const isScreenBiggerThan737px = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <ToggleButtonGroup
      orientation={isScreenBiggerThan737px ? 'vertical' : 'horizontal'}
      value={view}
      className="vault-sidebar"
      exclusive
      onChange={handleChange}>
      <NavLink to="movies">
        <ToggleButton
          className="vault-sidebar-button"
          value="movies"
          aria-label="movies">
          <MovieIcon className="vault-sidebar-icon" /> Movies
        </ToggleButton>
      </NavLink>
      <NavLink to="tv">
        <ToggleButton
          className="vault-sidebar-button"
          value="tv"
          aria-label="tv">
          <LiveTvIcon className="vault-sidebar-icon" /> TV
        </ToggleButton>
      </NavLink>
      <NavLink to="music">
        <ToggleButton
          className="vault-sidebar-button"
          value="music"
          aria-label="music">
          <LibraryMusicIcon className="vault-sidebar-icon" /> Music
        </ToggleButton>
      </NavLink>
      <NavLink to="games">
        <ToggleButton
          className="vault-sidebar-button"
          value="games"
          aria-label="games">
          <SportsEsportsIcon className="vault-sidebar-icon" /> Games
        </ToggleButton>
      </NavLink>
      <NavLink to="books">
        <ToggleButton
          className="vault-sidebar-button"
          value="books"
          aria-label="books">
          <AutoStoriesIcon className="vault-sidebar-icon" /> Books
        </ToggleButton>
      </NavLink>
    </ToggleButtonGroup>
  )
}
