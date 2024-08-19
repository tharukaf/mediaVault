const baseURL = 'http://localhost:8000/'

export default async function fetchSearchResults(
  mSearchType,
  mSearchText,
  mFunc
) {
  if (mSearchText.length > 2) {
    try {
      const url = `${baseURL}${mSearchType}/search/${mSearchText}`
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
        mFunc.setBooks(data.items)
      }
    } catch (error) {
      console.error(`Error fetching ${mSearchType}s: `, error)
    }
  }
}
