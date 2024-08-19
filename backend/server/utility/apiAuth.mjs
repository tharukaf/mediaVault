import 'dotenv/config'

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET
let IGDB_ACCESS_TOKEN
let igdbExpireTime

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
let SPOTIFY_ACCESS_TOKEN
let spotify_token_expire_time

// const TMDB_API_KEY =
export const fetchArgs = {
  movie: ['movie', process.env.TMDB_API_KEY],
  tv: ['tv', process.env.TMDB_API_KEY],
  music: [() => SPOTIFY_ACCESS_TOKEN],
  game: [() => IGDB_ACCESS_TOKEN, IGDB_CLIENT_ID],
  book: [process.env.GOOGLE_BOOKS_API_KEY],
}

export const igdbAuth = async (req, res, next) => {
  if (!IGDB_ACCESS_TOKEN || Date.now() >= igdbExpireTime) {
    // if (!IGDB_ACCESS_TOKEN) {
    const clientId = IGDB_CLIENT_ID
    const clientSecret = IGDB_CLIENT_SECRET
    const authUrl = 'https://id.twitch.tv/oauth2/token'
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    }

    try {
      const response = await fetch(authUrl, authOptions)
      const json = await response.json()
      if (json.access_token) {
        IGDB_ACCESS_TOKEN = json.access_token
        igdbExpireTime = json.expires_in * 1000 + Date.now()
      } else {
        throw new Error('Failed to authenticate with IGDB')
      }
    } catch (err) {
      console.error('error:' + err)
      res.status(500).send('Failed to authenticate with IGDB')
    }
  }
  next()
}

export const spotifyAuth = async (req, res, next) => {
  const name = req.params.name
  if (!SPOTIFY_ACCESS_TOKEN || Date.now() >= spotify_token_expire_time) {
    const authUrl = 'https://accounts.spotify.com/api/token'
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    }

    fetch(authUrl, authOptions)
      .then(res => res.json())
      .then(json => {
        if (json.access_token) {
          SPOTIFY_ACCESS_TOKEN = json.access_token
          console.log(`Spotify access token: ${name}`, SPOTIFY_ACCESS_TOKEN)
          spotify_token_expire_time = json.expires_in * 1000 + Date.now()
        } else {
          throw new Error('Failed to authenticate with Spotify')
        }
      })
      .catch(err => {
        console.error('error:' + err)
        // res.status(500).send('Failed to authenticate with Spotify')
      })
  }
  next()
}
