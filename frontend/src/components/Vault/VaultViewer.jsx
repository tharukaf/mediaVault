import { useParams } from 'react-router-dom'
import { baseURL } from '../../utils/FetchData'
import { useEffect, useState } from 'react'
import MovieCard from '../mediaCards/movieCard'
import MusicCard from '../mediaCards/musicCard'
import { normalize } from '../../utils/NormalizeData'
import { useAuth } from '../../utils/UserContext'
import { useLocation } from 'react-router-dom'

export default function VaultViewer() {
  const auth = useAuth()
  const { media } = useParams()
  const [movies, setMovies] = useState([])
  const [tv, setTV] = useState([])
  const [music, setMusic] = useState([])
  const [games, setGames] = useState([])
  const [books, setBooks] = useState([])
  const location = useLocation()

  useEffect(() => {
    async function fetchDataFromDB() {
      const email = auth.currentUser.email
      const url =
        location.pathname === '/myvault'
          ? `${baseURL}users/${email}/movies`
          : `${baseURL}users/${email}/${media}`
      const response = await fetch(url)
      const data = await response.json()
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
      if (location.pathname === '/myvault') {
        console.log(data)
        setMovies(data)
      }
    }
    fetchDataFromDB()
  }, [media])

  console.log(movies)
  const initMovieList =
    location.pathname === '/myvault' &&
    movies.map(movie => normalize.movies(movie))
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
        {location.pathname === '/myvault' &&
          initMovieList.map(movie => {
            return (
              <MovieCard
                key={self.crypto.randomUUID()}
                movie={movie}
                type={media}
              />
            )
          })}
        {media === 'movies' &&
          movieList.map(movie => {
            return (
              <MovieCard
                key={self.crypto.randomUUID()}
                movie={movie}
                type={media}
              />
            )
          })}
        {media === 'tv' &&
          tvList.map(movie => {
            return (
              <MovieCard
                key={self.crypto.randomUUID()}
                movie={movie}
                type={media}
              />
            )
          })}
        {media === 'music' &&
          musicList.map(track => {
            return <MusicCard key={self.crypto.randomUUID()} track={track} />
          })}
        {media === 'books' &&
          bookList.map(movie => {
            return (
              <MovieCard
                key={self.crypto.randomUUID()}
                movie={movie}
                type={media}
              />
            )
          })}
        {media === 'games' &&
          gameList.map(movie => {
            return (
              <MovieCard
                key={self.crypto.randomUUID()}
                movie={movie}
                type={media}
              />
            )
          })}
      </div>
      <h2>Vault Viewer {media ? media : 'movies'}</h2>
    </>
  )
}
