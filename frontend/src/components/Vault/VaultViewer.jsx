import { useParams } from 'react-router-dom'
import { baseURL } from '../../utils/FetchData'
import { useEffect, useState } from 'react'
import MovieCard from '../mediaCards/movieCard'
import MusicCard from '../mediaCards/musicCard'
import { normalize } from '../../utils/NormalizeData'
import { useAuth } from '../../utils/UserContext'
import { useLocation } from 'react-router-dom'

export default function VaultViewer() {
  const { currentUser } = useAuth()
  const { media } = useParams()
  const [movies, setMovies] = useState([])
  const [tv, setTV] = useState([])
  const [music, setMusic] = useState([])
  const [games, setGames] = useState([])
  const [books, setBooks] = useState([])
  const [isListEmpty, setIsListEmpty] = useState(false)
  const location = useLocation()

  useEffect(() => {
    async function fetchDataFromDB() {
      let data
      const email = currentUser.email
      const mediaType = location.pathname === '/myvault' ? 'movies' : media
      if (currentUser.name === 'Guest') {
        const storageItems = JSON.parse(localStorage.getItem(mediaType))
        const keys = Object.keys(storageItems)
        const res = await fetch(`${baseURL}guest/${media}/list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keys }),
        })
        data = await res.json()
      } else {
        const url = `${baseURL}users/${email}/${mediaType}`
        const response = await fetch(url)
        data = await response.json()
      }
      data.length === 0 ? setIsListEmpty(true) : setIsListEmpty(false)
      if (media === 'movies' || location.pathname === '/myvault') {
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
      <div className="vault-items-view">
        <div className="mediaCardContainer">
          {location.pathname === '/myvault' &&
            initMovieList.map(movie => {
              return (
                <MovieCard
                  isNavigate={true}
                  mediaType="movies"
                  key={self.crypto.randomUUID()}
                  movie={movie}
                />
              )
            })}
          {media === 'movies' &&
            movieList.map(movie => {
              return (
                <MovieCard
                  isNavigate={true}
                  mediaType="movies"
                  key={self.crypto.randomUUID()}
                  movie={movie}
                />
              )
            })}
          {media === 'tv' &&
            tvList.map(movie => {
              return (
                <MovieCard
                  isNavigate={true}
                  key={self.crypto.randomUUID()}
                  movie={movie}
                  mediaType={media}
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
                  isNavigate={true}
                  key={self.crypto.randomUUID()}
                  movie={movie}
                  mediaType={media}
                />
              )
            })}
          {media === 'games' &&
            gameList.map(movie => {
              return (
                <MovieCard
                  isNavigate={true}
                  key={self.crypto.randomUUID()}
                  movie={movie}
                  mediaType={media}
                />
              )
            })}
        </div>
        {isListEmpty && (
          <div className="empty-list">
            <h1>Your list is empty</h1>
          </div>
        )}
      </div>
    </>
  )
}
