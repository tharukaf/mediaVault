import { useState, useEffect } from 'react'
import MovieCard from './mediaCards/movieCard'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

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

  async function fetchData() {
    if (searchText.length > 2) {
      try {
        const url = `http://localhost:8000/${searchType}/${searchText}`
        const response = await fetch(url)
        const data = await response.json()
        if (searchType === 'movie') {
          setMovies(data.results)
        } else if (searchType === 'tv') {
          setTV(data.results)
        } else if (searchType === 'music') {
          setMusic(data.tracks.items)
          console.log(data.tracks.items)
        } else if (searchType === 'game') {
          setGames(data)
        } else if (searchType === 'book') {
          setBooks(data.items)
        }
      } catch (error) {
        console.error(`Error fetching ${searchType}s: `, error)
      }
    }
  }
  // Fetch data from the server
  useEffect(() => {
    fetchData()
  }, [searchText])

  // Map over the data and create a list of movie cards
  const movieList = movies.map(movie => {
    return (
      // TODO: Abstract away the movieCard component
      <MovieCard
        key={movie.id} // Add a unique key prop
        title={movie.title}
        releaseDate={movie.first_air_date}
        description={movie.overview}
        posterPath={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`}
        rating={movie.vote_average}
      />
    )
  })
  const tvList = tv.map(tvShow => {
    return (
      // TODO: Abstract away the movieCard component
      <MovieCard
        key={tvShow.id} // Add a unique key prop
        title={tvShow.name}
        releaseDate={tvShow.release_date || tvShow.first_air_date}
        description={tvShow.overview}
        posterPath={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${tvShow.poster_path}`}
        rating={tvShow.vote_average}
      />
    )
  })

  // Map over the data and create a list of game cards
  const gameList =
    games.length > 0 &&
    games.map(game => {
      return (
        <div key={game.id}>
          <h2>{game.name}</h2>
          <p>{game.summary}</p>
          <img src={game.cover?.url} alt="game poster" />
          <p>Rating: {game?.rating}</p>
          <p>Release Date: {game?.first_release_date}</p>
          <p>
            Platforms: {game?.platforms?.map(platform => platform).join(', ')}
          </p>
        </div>
      )
    })

  // Map over the data and create a list of music cards
  const musicList = music?.map(track => {
    return (
      <div key={track.id}>
        <h2>{track.name}</h2>
        <p>{track.album.name}</p>
        <img src={track.album.images[0].url} alt="album cover" />
        <p>Rating: {track.popularity}</p>
        <p>Release Date: {track.album.release_date}</p>
        <p>Artists: {track.artists.map(artist => artist.name).join(', ')}</p>
      </div>
    )
  })

  function selectMediaType(mediaType) {
    setSearchText('')
    setSearchType(mediaType)
  }

  // Map over the data and create a list of book cards
  console.log(books)
  const bookList =
    // books &&
    books?.map(book => {
      return (
        <div key={book.id}>
          <h2>{book.volumeInfo.title}</h2>
          <p>{book.volumeInfo.description}</p>
          <img src={book.volumeInfo.imageLinks?.thumbnail} alt="book cover" />
          <p>Rating: {book.volumeInfo.averageRating}</p>
          <p>Published Date: {book.volumeInfo.publishedDate}</p>
          <p>Authors: {book.volumeInfo.authors?.join(', ')}</p>
        </div>
      )
    })

  // Searchtype button handler
  const handleTypeSelect = e => {
    if (e.target.id === 'movie') {
      selectMediaType('movie')
    }
    if (e.target.id === 'tv') {
      selectMediaType('tv')
    }
    if (e.target.id === 'music') {
      selectMediaType('music')
    }
    if (e.target.id === 'game') {
      selectMediaType('game')
    }
    if (e.target.id === 'book') {
      selectMediaType('book')
    }
  }

  return (
    <>
      <ToggleButtonGroup
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
      <br />
      <Box
        component="form"
        sx={{
          width: 500,
          maxWidth: '100%',
        }}
        noValidate
        autoComplete="off">
        <TextField
          id="outlined-basic"
          label={`Enter ${searchType} name`}
          variant="outlined"
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
        />
      </Box>
      {searchType === 'movie' && movieList}
      {searchType === 'tv' && tvList}
      {searchType === 'music' && musicList}
      {searchType === 'game' && gameList}
      {searchType === 'book' && bookList}
    </>
  )
}
