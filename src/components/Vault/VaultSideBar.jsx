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
      <NavLink to="movie">
        <ToggleButton
          className="vault-sidebar-button"
          value="movie"
          aria-label="movie">
          <MovieIcon className="vault-sidebar-icon" /> Movie
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
      <NavLink to="game">
        <ToggleButton
          className="vault-sidebar-button"
          value="game"
          aria-label="game">
          <SportsEsportsIcon className="vault-sidebar-icon" /> Game
        </ToggleButton>
      </NavLink>
      <NavLink to="book">
        <ToggleButton
          className="vault-sidebar-button"
          value="book"
          aria-label="book">
          <AutoStoriesIcon className="vault-sidebar-icon" /> Book
        </ToggleButton>
      </NavLink>
    </ToggleButtonGroup>
  )
}
