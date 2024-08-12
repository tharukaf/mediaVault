import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

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
      <ToggleButton className="searchTypeButton" value="movie">
        Movie
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="tv">
        TV
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="music">
        Music
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="game">
        Game
      </ToggleButton>
      <ToggleButton className="searchTypeButton" value="book">
        Book
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
