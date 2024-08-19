import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import '../../App.css'

export default function SearchToggleGroup({ searchType, handleChange }) {
  return (
    <ToggleButtonGroup
      style={{ padding: '20px' }}
      id="searchTypeButtonGroup"
      color="primary"
      value={searchType}
      exclusive
      onChange={handleChange}
      aria-label="Platform">
      <ToggleButton className="searchTypeButton" value="movies">
        Movie
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="tv">
        TV
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="music">
        Music
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="games">
        Game
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="books">
        Book
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
