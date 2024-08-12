import { useParams } from 'react-router-dom'
import fetchData from '../../utils/FetchData'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import MovieCard from '../mediaCards/movieCard'
import MusicCard from '../mediaCards/musicCard'

export default function VaultViewer() {
  const { media } = useParams()
  const [movies, setMovies] = useState([])
  const [tv, setTV] = useState([])
  const [music, setMusic] = useState([])
  const [games, setGames] = useState([])
  const [books, setBooks] = useState([])
  // const media = useParams().media

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

  const movieList = movies.map(movie => {
    return {
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      description: movie.overview,
      poster: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
      rating: movie.vote_average,
    }
  })
  const tvList = tv.map(movie => {
    return {
      id: movie.id,
      title: movie.name,
      releaseDate: movie.first_air_date,
      description: movie.overview,
      poster: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
      rating: movie.vote_average,
    }
  })

  const musicList = music?.map(track => ({
    id: track.id,
    title: track.name,
    album: track.album.name,
    poster: track.album.images[0].url,
    rating: track.popularity,
    releaseDate: track.album.release_date,
    artists: track.artists.map(artist => artist.name).join(', '),
  }))

  const bookList = books?.map(book => ({
    id: book.id,
    title: book.volumeInfo.title,
    description: book.volumeInfo.description,
    poster: book.volumeInfo.imageLinks?.thumbnail,
    rating: book.volumeInfo.averageRating,
    releaseDate: book.volumeInfo.publishedDate,
    authors: book.volumeInfo.authors?.join(', '),
  }))

  const gameList =
    games &&
    games?.map(game => ({
      id: game.id,
      title: game.name,
      description: game.summary,
      poster: game.cover?.url,
      rating: game?.rating,
      releaseDate: game?.first_release_date,
      platforms: game?.platforms?.map(platform => platform).join(', '),
    }))

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
