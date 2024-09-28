export const baseURL = 'https://mediavault.onrender.com/'

export default async function fetchSearchResults(
  mSearchType,
  mSearchText,
  mFunc
) {
  if (mSearchText.length > 2) {
    try {
      const url = `${baseURL}search/${mSearchType}/${mSearchText}`
      const response = await fetch(url)
      const data = await response.json()

      const [model, dataNormalizer] = getModelByMediaType(mSearchType)
      const normalizedData = dataNormalizer(data)
      mFunc[model.setter](normalizedData)
    } catch (error) {
      console.error(`Error fetching ${mSearchType}s: `, error)
    }
  }
}

export async function updateMediaItemStatus(email, mediaType, itemId, status) {
  const url = `${baseURL}users/${email}/${mediaType}/${itemId}`
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  }
  const response = await fetch(url, requestOptions)
  const data = await response.json()
  return data
}

const Movies = { name: 'movies', setter: 'setMovies' }
const TV = { name: 'tv', setter: 'setTV' }
const Music = { name: 'music', setter: 'setMusic' }
const Games = { name: 'games', setter: 'setGames' }
const Books = { name: 'books', setter: 'setBooks' }

export const Models = {
  Movies,
  TV,
  Music,
  Games,
  Books,
}

export const getModelByMediaType = mediaType => {
  switch (mediaType) {
    case 'movies':
      return [Movies, data => data.results]
    case 'tv':
      return [TV, data => data.results]
    case 'games':
      return [Games, data => data]
    case 'music':
      return [Music, data => data.tracks.items]
    case 'books':
      return [
        Books,
        data => {
          return data.items.map(item => {
            return { id: item.id, ...item.volumeInfo }
          })
        },
      ]
    default:
      return ''
  }
}
