import { Movie, TvShow, Game, Music, Book } from '../../db/models/dbModels.mjs'

export const getModelByMediaType = mediaType => {
  if (mediaType === undefined) {
  }
  switch (mediaType) {
    case 'movies':
      return [Movie, 'movie']
    case 'tv':
      return [TvShow, 'tv']
    case 'games':
      return [Game, 'game']
    case 'music':
      return [Music, 'music']
    case 'books':
      return [Book, 'book']
    default:
      return [Movie, 'movie']
  }
}
