export const baseURL = 'http://localhost:8000/'

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

      if (mSearchType === 'movies') {
        mFunc.setMovies(data.results)
      } else if (mSearchType === 'tv') {
        mFunc.setTV(data.results)
      } else if (mSearchType === 'music') {
        mFunc.setMusic(data.tracks.items)
      } else if (mSearchType === 'games') {
        mFunc.setGames(data)
      } else if (mSearchType === 'books') {
        let normalized = data.items.map(item => {
          return { id: item.id, ...item.volumeInfo }
        })
        mFunc.setBooks(normalized)
      }
    } catch (error) {
      console.error(`Error fetching ${mSearchType}s: `, error)
    }
  }
}
