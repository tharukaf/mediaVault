import { useState, useEffect } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import SearchDropDown from './SearchDropDown'
import fetchData from '../../utils/FetchData'

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
    // fetchData()
  }, [searchText])

  // Map over the data and create a list of movie cards
  const movieList = movies.map(movie => {
    return {
      id: movie.id, // Add a unique id prop
      title: movie.title,
      releaseDate: movie.release_date,
      description: movie.overview,
      poster: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
      rating: movie.vote_average,
    }
  })
  const tvList = tv.map(tvShow => {
    return {
      // TODO: Abstract away the movieCard component
      id: tvShow.id, // Add a unique key prop
      title: tvShow.name,
      releaseDate: tvShow.first_air_date,
      description: tvShow.overview,
      poster: `https://image.tmdb.org/t/p/w185_and_h278_bestv2${tvShow.poster_path}`,
      rating: tvShow.vote_average,
    }
  })

  // Map over the data and create a list of game cards
  const gameList = games && games?.map(game => ({
    id: game.id,
    title: game.name,
    description: game.summary,
    poster: game.cover?.url,
    rating: game?.rating,
    releaseDate: game?.first_release_date,
    platforms: game?.platforms?.map(platform => platform).join(', '),
  }))

  // Map over the data and create a list of music cards
  const musicList = music?.map(track => ({
    id: track.id,
    title: track.name,
    album: track.album.name,
    poster: track.album.images[0].url,
    rating: track.popularity,
    releaseDate: track.album.release_date,
    artists: track.artists.map(artist => artist.name).join(', '),
  }))

  // Map over the data and create a list of book cards
  const bookList = books?.map(book => ({
    id: book.id,
    title: book.volumeInfo.title,
    description: book.volumeInfo.description,
    poster: book.volumeInfo.imageLinks?.thumbnail,
    rating: book.volumeInfo.averageRating,
    releaseDate: book.volumeInfo.publishedDate,
    authors: book.volumeInfo.authors?.join(', '),
  }))

  return (
    <>
      <div className="searchUIContainer">
        <ToggleButtonGroup
          style={{ padding: '20px' }}
          id="searchTypeButtonGroup"
          color="primary"
          value={searchType}
          exclusive
          onChange={handleChange}
          aria-label="Platform">
          <ToggleButton className="searchTypeSelectItem" value="movie">
            Movie
          </ToggleButton>
          <ToggleButton className="searchTypeSelectItem" value="tv">
            TV
          </ToggleButton>
          <ToggleButton className="searchTypeSelectItem" value="music">
            Music
          </ToggleButton>
          <ToggleButton className="searchTypeSelectItem" value="game">
            Game
          </ToggleButton>
          <ToggleButton className="searchTypeSelectItem" value="book">
            Book
          </ToggleButton>
        </ToggleButtonGroup>

        {searchType == 'movie' && (
          <SearchDropDown
            style={{ width: '90%' }}
            optionList={movieList}
            searchType={searchType}
            setSearchText={setSearchText}
            searchText={searchText}
          />
        )}
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
