/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import "./App.css"
import MovieCard from "./components/media/movieCard"

export default function App() {
  const [searchText, setSearchText] = useState("")
  const [searchType, setSearchType] = useState("movie")
  const [movies, setMovies] = useState([])
  const [music, setMusic] = useState([])
  const [games, setGames] = useState([])
  const [books, setBooks] = useState([])

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      if (searchText.length > 2) {
        try {
          const url = `http://localhost:8000/${searchType}/${searchText}`
          const response = await fetch(url)
          const data = await response.json()
          if (searchType === "movie" || searchType === "tv") {
            setMovies(data.results)
          } else if (searchType === "music") {
            setMusic(data.results)
          } else if (searchType === "game") {
            setGames(data)
            console.log(games)
          } else if (searchType === "book") {
            setBooks(data.results)
          }
        } catch (error) {
          console.error(`Error fetching ${searchType}s: `, error)
        }
      }
    }

    fetchData()
  }, [searchText])

  // Map over the data and create a list of movie cards
  const movieList = movies?.map((movie) => {
    return (
      // TODO: Abstract away the movieCard component
      <MovieCard
        key={movie.id} // Add a unique key prop
        title={movie.title || movie.name}
        releaseDate={movie.release_date || movie.first_air_date}
        description={movie.overview}
        posterPath={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`}
        rating={movie.vote_average}
      />
    )
  })

  // Map over the data and create a list of game cards
  const gameList = games.map((game) => {
    return (
      <div key={game.id}>
        <h2>{game.name}</h2>
        <p>{game.summary}</p>
        <img
          src={game.cover?.url}
          alt="game poster"
        />
        <p>Rating: {game?.rating}</p>
        <p>Release Date: {game?.first_release_date}</p>
        <p>
          Platforms: {game?.platforms?.map((platform) => platform).join(", ")}
        </p>
      </div>
    )
  })

  function selectMediaType(mediaType) {
    setSearchText("")
    setSearchType(mediaType)
  }

  // Searchtype button handler
  const handleTypeSelect = (e) => {
    if (e.target.id === "movie") {
      selectMediaType("movie")
    }
    if (e.target.id === "tv") {
      selectMediaType("tv")
    }
    if (e.target.id === "music") {
      selectMediaType("music")
    }
    if (e.target.id === "game") {
      selectMediaType("game")
    }
    if (e.target.id === "book") {
      selectMediaType("book")
    }
  }

  return (
    <>
      <button
        id="movie"
        style={
          searchType === "movie" ? { color: "yellow" } : { color: "white" }
        }
        onClick={handleTypeSelect}>
        Movies
      </button>
      <button
        id="tv"
        style={searchType === "tv" ? { color: "yellow" } : { color: "white" }}
        onClick={handleTypeSelect}>
        TV
      </button>
      <button
        id="music"
        style={
          searchType === "music" ? { color: "yellow" } : { color: "white" }
        }
        onClick={handleTypeSelect}>
        Music
      </button>
      <button
        id="game"
        style={searchType === "game" ? { color: "yellow" } : { color: "white" }}
        onClick={handleTypeSelect}>
        Games
      </button>
      <button
        id="book"
        style={searchType === "book" ? { color: "yellow" } : { color: "white" }}
        onClick={handleTypeSelect}>
        Books
      </button>
      <br />
      <input
        type="text"
        placeholder={`Enter ${searchType} name`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {(searchType === "movie" || searchType === "tv") && movieList}
      {/* {searchType === "music" && musicList} */}
      {searchType === "game" && gameList}
      {/* {searchType === "book" && bookList} */}
    </>
  )
}
