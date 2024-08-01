/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import './App.css'
import MovieCard from './components/media/movieCard'


function App() {

  const [count, setCount] = useState(0)
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/news')
  .then(res => res.json())
  .then(data => setMovies(data.results))
  }, [])

  const movieList = movies.map(movie => {
    return (
      <MovieCard 
        key={movie.id} // Add a unique key prop
        title={movie.title}
        releaseDate={movie.release_date.slice(0, 4)}
        description={movie.overview}
        posterPath={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`}
        rating={movie.vote_average}
      />
    )
  })


  return (
    <>
      {movieList}
      {/* {movies.map(movie => {
        return (
          <MovieCard 
            key={movie.id} // Add a unique key prop
            title={movie.title}
            releaseDate={movie.release_date}
            description={movie.overview}
            posterPath={`https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`}
            rating={movie.vote_average}
          />
        )
      })} */}
    </>
  )
}

export default App
