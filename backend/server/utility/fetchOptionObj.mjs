const gameOptObj = (name, ACCESS_TOKEN, CLIENT_ID) => {
  return {
    url: {
      search: `https://api.igdb.com/v4/games`,
      curator: 'https://api.igdb.com/v4/popularity_primitives',
    },
    options: {
      search: {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': `${CLIENT_ID}`,
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
        body: `fields name,summary,cover.url,first_release_date,age_ratings,aggregated_rating,platforms; search "${name}"; limit 10;`,
      },
      curator: {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Client-ID': `${CLIENT_ID}`,
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
        body: 'fields game_id,value,popularity_type; sort value desc; limit 10; where popularity_type = 3;',
      },
    },
  }
}

const bookOptObj = (name, API_KEY) => {
  return {
    url: {
      search: `https://www.googleapis.com/books/v1/volumes?key=${API_KEY}&q=${name}`,
      curator: '',
    },
    options: {
      search: {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      },
    },
  }
}

const musicOptObj = (name, ACCESS_TOKEN) => {
  return {
    url: {
      search: `https://api.spotify.com/v1/search?q=${name}&type=track`,
      curator: 'https://api.spotify.com/v1/browse/new-releases',
    },
    options: {
      search: {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN()}`,
        },
      },
    },
  }
}

const movieOptObj = (name, type, API_KEY) => {
  return {
    url: {
      search: `https://api.themoviedb.org/3/search/${type}?query=${name}&include_adult=false&language=en-US&page=1`,
      curator:
        'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
      similar: movie_id =>
        `https://api.themoviedb.org/3/movie/${movie_id}/similar`,
    },
    options: {
      search: {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: API_KEY,
        },
      },
    },
  }
}

const tvOptObj = (name, type, API_KEY) => {
  return {
    url: {
      search: `https://api.themoviedb.org/3/search/${type}?query=${name}&include_adult=false&language=en-US&page=1`,
      curator: 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1',
      similar: movie_id =>
        `https://api.themoviedb.org/3/movie/${movie_id}/similar`,
    },
    options: {
      search: {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: API_KEY,
        },
      },
    },
  }
}

const OptObj = {
  game: gameOptObj,
  book: bookOptObj,
  music: musicOptObj,
  movie: movieOptObj,
  tv: tvOptObj,
}

export default OptObj
