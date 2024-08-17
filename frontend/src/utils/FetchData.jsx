export default async function fetchData(mSearchType, mSearchText, mFunc) {
  if (mSearchText.length > 2) {
    try {
      const url = `http://localhost:8000/${mSearchType}/${mSearchText}`
      const response = await fetch(url)
      const data = await response.json()

      if (mSearchType === 'movie') {
        mFunc.setMovies(data.results)
      } else if (mSearchType === 'tv') {
        mFunc.setTV(data.results)
      } else if (mSearchType === 'music') {
        mFunc.setMusic(data.tracks.items)
      } else if (mSearchType === 'game') {
        mFunc.setGames(data)
      } else if (mSearchType === 'book') {
        mFunc.setBooks(data.items)
      }
    } catch (error) {
      console.error(`Error fetching ${mSearchType}s: `, error)
    }
  }
}
