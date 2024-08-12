import { useParams } from 'react-router-dom'
import fetchData from '../../utils/FetchData'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@mui/material'
import MovieCard from '../mediaCards/movieCard'

export default function VaultViewer() {
  const { media } = useParams()
  const [movies, setMovies] = useState([])
  const [tv, setTV] = useState([])
  const [music, setMusic] = useState([])
  const [games, setGames] = useState([])
  const [books, setBooks] = useState([])

  const funcPointers = {
    setMovies,
    setTV,
    setMusic,
    setGames,
    setBooks,
  }

  useEffect(() => {
    fetchData(media, 'godzilla', funcPointers)
  }, [media])

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

  return (
    <>
      <div className="mediaCardContainer">
        {movieList.map(movie => {
          return <MovieCard key={movie.id} movie={movie} />
        })}
      </div>
      <h2>Vault Viewer {media ? media : 'movies'}</h2>
    </>
  )
}
