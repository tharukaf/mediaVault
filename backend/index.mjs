import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import fetch from 'node-fetch'
import mongoose from 'mongoose'

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING

async function connectToMongo() {
  let a = await mongoose.connect(mongoConnectionString)
  console.log('Connected to MongoDB', a)
}

connectToMongo()

const movieSchema = new mongoose.Schema({
  name: String,
  year: Number,
  poster: String,
  rating: Number,
})

const Movie = mongoose.model('Movie', movieSchema)

async function createMovie() {
  const mov = new Movie({
    name: 'Silence of the lambs',
    year: 1991,
    poster: 'https://www.imdb.com/title/tt0102926/mediaviewer/rm4263666176/',
    rating: 8.6,
  })
  await mov.save()
}

// get all movies
async function getMovies() {
  const movies = await Movie.find()
  console.log(movies)
}
getMovies()
// createMovie()

import {
  movieTVFetchOptionObj,
  musicFetchOptionObj,
  gameFetchOptionObj,
  bookFetchOptionObj,
} from './server/utility/fetchOptionObj.mjs'
import { fetchData } from './server/utility/fetchData.mjs'

const PORT = 8000
const app = express()
app.use(cors())

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET
let IGDB_ACCESS_TOKEN
let igdbExpireTime

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
let SPOTIFY_ACCESS_TOKEN
let spotify_token_expire_time

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY

const TMDB_API_KEY = process.env.TMDB_API_KEY

const fetchArgs = {
  movie: ['movie', TMDB_API_KEY],
  tv: ['tv', TMDB_API_KEY],
  music: [() => SPOTIFY_ACCESS_TOKEN],
  game: [() => IGDB_ACCESS_TOKEN, IGDB_CLIENT_ID],
  book: [GOOGLE_BOOKS_API_KEY],
}

// Authenticate IGDB
app.use('/game/:name', async (req, res, next) => {
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
})

// Spotify authentication
app.use('/music/:name', (req, res, next) => {
  const name = req.params.name
  if (!SPOTIFY_ACCESS_TOKEN || Date.now() >= spotify_token_expire_time) {
    const authUrl = 'https://accounts.spotify.com/api/token'
    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
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
})

// Game route
app.get('/game/:name', async (req, res) => {
  const name = req.params.name
  const { url, options } = gameFetchOptionObj(name, ...fetchArgs.game)
  fetchData(url, options, res)
})

// Book route
app.get('/book/:name', (req, res) => {
  const name = req.params.name
  const { url, options } = bookFetchOptionObj(name, ...fetchArgs.book)
  fetchData(url, options, res)
})

// Music route
app.get('/music/:name', (req, res) => {
  const name = req.params.name
  const { url, options } = musicFetchOptionObj(name, ...fetchArgs.music)
  fetchData(url, options, res)
})

// Movie route
app.get('/movie/:name', (req, res) => {
  const { url, options } = movieTVFetchOptionObj(
    req.params.name,
    ...fetchArgs.movie
  )
  fetchData(url, options, res)
})

// TV route
app.get('/tv/:name', (req, res) => {
  const { url, options } = movieTVFetchOptionObj(
    req.params.name,
    ...fetchArgs.tv
  )
  fetchData(url, options, res)
})

// Root route
app.get('/', (req, res) => {
  res.send('Hello user! Welcome to the search engine API')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
