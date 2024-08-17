import { useParams } from 'react-router-dom'
import fetchData from '../../utils/FetchData'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
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
    fetchData(media, 'yesterday', funcPointers)
  }, [media])

  const movieList =
    media === 'movie' && movies.map(movie => normalize.movie(movie))
  const tvList = media === 'tv' && tv.map(normalize.tv)
  const musicList = media === 'music' && music.map(normalize.music)
  const bookList = media === 'book' && books?.map(book => normalize.book(book))
  const gameList =
    media === 'game' && games && games?.map(game => normalize.game(game))

  return (
    <>
      <div className="mediaCardContainer">
        {media === 'movie' &&
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
        {media === 'book' &&
          bookList.map(movie => {
            return <MovieCard key={movie.id} movie={movie} type={media} />
          })}
        {media === 'game' &&
          gameList.map(movie => {
            return <MovieCard key={movie.id} movie={movie} type={media} />
          })}
      </div>
      <h2>Vault Viewer {media ? media : 'movies'}</h2>
    </>
  )
}
