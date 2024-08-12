import SearchDropDown from '../components/Search/SearchDropDown'

export const normalizeMovie = movie => {
  return {
    // TODO: Abstract away the movieCard component
    id: movie.id, // Add a unique key prop
    title: movie.title,
    releaseDate: movie.release_date,
    description: movie.overview,
    poster: `https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`,
    rating: movie.vote_average,
  }
}

export const normalizeTvShow = tvShow => {
  return {
    // TODO: Abstract away the movieCard component
    id: tvShow.id, // Add a unique key prop
    title: tvShow.name,
    releaseDate: tvShow.first_air_date,
    description: tvShow.overview,
    poster: `https://image.tmdb.org/t/p/w185_and_h278_bestv2${tvShow.poster_path}`,
    rating: tvShow.vote_average,
  }
}

export const normalizeTrack = track => ({
  id: track.id,
  title: track.name,
  album: track.album.name,
  poster: track.album.images[0].url,
  rating: track.popularity,
  releaseDate: track.album.release_date,
  artists: track.artists.map(artist => artist.name).join(', '),
})

export const normalizeBook = book => ({
  id: book.id,
  title: book.volumeInfo.title,
  description: book.volumeInfo.description,
  poster: book.volumeInfo.imageLinks?.thumbnail,
  rating: book.volumeInfo.averageRating,
  releaseDate: book.volumeInfo.publishedDate,
  authors: book.volumeInfo.authors?.join(', '),
})

export const normalizeGame = game => ({
  id: game.id,
  title: game.name,
  description: game.summary,
  poster: game.cover?.url,
  rating: game?.rating,
  releaseDate: game?.first_release_date,
  platforms: game?.platforms?.map(platform => platform).join(', '),
})

// export function MapMovies(movies, searchType, searchText, setSearchText) {
//   const data = normalizeMovies(movies)
//   return (
//     <SearchDropDown
//       optionList={data}
//       searchType={searchType}
//       setSearchText={setSearchText}
//       searchText={searchText}
//     />
//   )
// }
