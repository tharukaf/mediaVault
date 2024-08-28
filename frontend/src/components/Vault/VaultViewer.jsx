import { useParams } from 'react-router-dom'
import fetchSearchResults from '../../utils/FetchData'
import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import MovieCard from '../mediaCards/movieCard'
import MusicCard from '../mediaCards/musicCard'
import { normalize } from '../../utils/NormalizeData'

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
    // fetchSearchResults(media, 'yesterday', funcPointers)
    async function fetchDataFromDB() {
      const email = 'me@example.com'
      const url = `http://localhost:8000/users/${email}/${media}`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
      if (media === 'movies') {
        setMovies(data)
      } else if (media === 'tv') {
        setTV(data)
      } else if (media === 'music') {
        setMusic(data)
      } else if (media === 'games') {
        setGames(data)
      } else if (media === 'books') {
        setBooks(data)
      }
    }
    fetchDataFromDB()
  }, [media])

  const movieList =
    media === 'movies' && movies.map(movie => normalize.movies(movie))
  const tvList = media === 'tv' && tv.map(normalize.tv)
  const musicList = media === 'music' && music.map(normalize.music)
  const bookList =
    media === 'books' && books?.map(book => normalize.books(book))
  const gameList =
    media === 'games' && games?.map(game => normalize.games(game))

  return (
    <>
      <div className="mediaCardContainer">
        {media === 'movies' &&
          movieList.map(movie => {
            return <MovieCard key={movie.id} movie={movie} type={media} />
          })}
        {media === 'tv' &&
          tvList.map(movie => {
            return <MovieCard key={movie.id} movie={movie} type={media} />
          })}
        {media === 'music' &&
          musicList.map(track => {
            return <MusicCard key={track.id} track={track} />
          })}
        {media === 'books' &&
          bookList.map(movie => {
            return <MovieCard key={movie.id} movie={movie} type={media} />
          })}
        {media === 'games' &&
          gameList.map(movie => {
            return <MovieCard key={movie.id} movie={movie} type={media} />
          })}
      </div>
      <h2>Vault Viewer {media ? media : 'movies'}</h2>
    </>
  )
}
