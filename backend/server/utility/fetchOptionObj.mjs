const gameOptObj = (name, ACCESS_TOKEN, CLIENT_ID) => {
  return {
    url: `https://api.igdb.com/v4/games`,
    options: {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': `${CLIENT_ID}`,
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
      body: `fields name,summary,cover.url,first_release_date,age_ratings,aggregated_rating,platforms; search "${name}"; limit 10;`,
    },
  }
}

const bookOptObj = (name, API_KEY) => {
  return {
    url: `https://www.googleapis.com/books/v1/volumes?key=${API_KEY}&q=${name}`,
    options: {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
  }
}

const musicOptObj = (name, ACCESS_TOKEN) => {
  return {
    url: `https://api.spotify.com/v1/search?q=${name}&type=track`,
    options: {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN()}`,
      },
    },
  }
}

const movieTVOptObj = (name, type, API_KEY) => {
  return {
    url: `https://api.themoviedb.org/3/search/${type}?query=${name}&include_adult=false&language=en-US&page=1`,
    options: {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: API_KEY,
      },
    },
  }
}

const OptObj = {
  game: gameOptObj,
  book: bookOptObj,
  music: musicOptObj,
  movie: movieTVOptObj,
}

export default OptObj
