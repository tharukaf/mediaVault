import { useState, useEffect } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import SearchDropDown from './SearchDropDown'
import fetchData from '../../utils/FetchData'
import SearchToggleGroup from './SearchToggleGroup'
import {
  normalizeMovie,
  normalizeTvShow,
  normalizeTrack,
  normalizeGame,
  normalizeBook,
} from '../../utils/NormalizeData'

export default function Search() {
  const [searchText, setSearchText] = useState('')
  const [searchType, setSearchType] = useState('movie')
  const [movies, setMovies] = useState([])
  const [tv, setTV] = useState([])
  const [music, setMusic] = useState([])
  const [games, setGames] = useState([])
  const [books, setBooks] = useState([])

  const handleChange = (event, newAlignment) => {
    setSearchType(newAlignment)
  }
  const funcPointers = {
    setMovies,
    setTV,
    setMusic,
    setGames,
    setBooks,
  }

  // Fetch data from the server
  useEffect(() => {
    fetchData(searchType, searchText, funcPointers)
  }, [searchText])

  const movieList = movies.map(normalizeMovie)
  const tvList = tv.map(normalizeTvShow)
  const gameList = games && games?.map(normalizeGame)
  const musicList = music?.map(normalizeTrack)
  const bookList = books?.map(normalizeBook)

  return (
    <>
      <div className="searchUIContainer">
        <SearchToggleGroup
          searchType={searchType}
          handleChange={handleChange}
        />

        {searchType == 'movie' && (
          <SearchDropDown
            style={{ width: '90%' }}
            optionList={movieList}
            searchType={searchType}
            setSearchText={setSearchText}
            searchText={searchText}
          />
        )}
        {/* {searchType == 'movie' && movieList} */}
        {searchType == 'tv' && (
          <SearchDropDown
            optionList={tvList}
            searchType={searchType}
            setSearchText={setSearchText}
            searchText={searchText}
          />
        )}

        {searchType == 'music' && (
          <SearchDropDown
            optionList={musicList}
            searchType={searchType}
            setSearchText={setSearchText}
            searchText={searchText}
          />
        )}
        {searchType == 'game' && (
          <SearchDropDown
            optionList={gameList}
            searchType={searchType}
            setSearchText={setSearchText}
            searchText={searchText}
          />
        )}
        {searchType == 'book' && (
          <SearchDropDown
            optionList={bookList}
            searchType={searchType}
            setSearchText={setSearchText}
            searchText={searchText}
          />
        )}
      </div>
    </>
  )
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
