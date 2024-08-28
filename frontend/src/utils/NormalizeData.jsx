// import SearchDropDown from '../components/Search/SearchDropDown'

const movie = movie => ({
  id: movie.id, // Add a unique key prop
  title: movie.title,
  releaseDate: movie.release_date,
  description: movie.overview,
  poster: `https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}`,
  rating: movie.vote_average,
})

const show = show => ({
  id: show.id, // Add a unique key prop
  title: show.name,
  releaseDate: show.first_air_date,
  description: show.overview,
  poster: `https://image.tmdb.org/t/p/w185_and_h278_bestv2${show.poster_path}`,
  rating: show.vote_average,
})

const track = track => ({
  id: track.id,
  title: track.name,
  album: track.album.name,
  poster: track.album.images[0].url,
  rating: track.popularity,
  releaseDate: track.album.release_date,
  artists: track.artists.map(artist => artist.name).join(', '),
})

const book = book => ({
  id: book.id,
  title: book.title,
  description: book?.description,
  poster: book.imageLinks?.thumbnail,
  rating: book.averageRating,
  releaseDate: book.publishedDate,
  authors: book.authors?.join(', '),
})

const game = game => ({
  id: game.id,
  title: game.name,
  description: game.summary,
  poster: game.cover?.url,
  rating: game?.rating,
  releaseDate: game?.first_release_date,
  platforms: game?.platforms?.map(platform => platform).join(', '),
})

export const normalize = {
  movies: movie,
  tv: show,
  music: track,
  books: book,
  games: game,
}

// export function MapData(mediaArray, searchType, setSearchText, searchText) {
//   const data = mediaArray.map(normalize[searchType])
//   return (
//     <SearchDropDown
//       optionList={data}
//       searchType={searchType}
//       setSearchText={setSearchText}
//       searchText={searchText}
//     />
//   )
// }
