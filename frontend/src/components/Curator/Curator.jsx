import { useState, useEffect } from 'react'
import { baseURL } from '../../utils/FetchData'
import MovieCard from '../mediaCards/movieCard'
import MusicCard from '../mediaCards/musicCard'
import { normalize } from '../../utils/NormalizeData'

export default function Curator() {
  const [mediaItems, setMediaItems] = useState({
    movies: [],
    tv: [],
    music: [],
    games: [],
  })

  useEffect(() => {
    async function fetchCuratedMediaList() {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await fetch(`${baseURL}curator`, options)
      const data = await response.json()
      setMediaItems(data)
    }
    fetchCuratedMediaList()
  }, [])

  const normalizedMovies = mediaItems.movies.map(movie =>
    normalize.movies(movie)
  )
  const normalizedTV = mediaItems.tv.map(tvShow => normalize.tv(tvShow))
  // const normalizedMusic = mediaItems.music.map(track => normalize.music(track))
  // const normalizedGames = mediaItems.tv.map(movie => normalize.tv(movie))

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {normalizedMovies.map(movie => {
        return <MovieCard type="movies" key={movie.id} movie={movie} />
      })}
      {normalizedTV.map(movie => {
        return <MovieCard type="tv" key={movie.id} movie={movie} />
      })}
      {/* {mediaItems.music.map(movie => {
        return <MusicCard key={movie.id} movie={movie} />
      })} */}
      {/* {mediaItems.movies.map(movie => {
        return <MovieCard key={movie.id} movie={movie} />
      })} */}
    </div>
  )
}
