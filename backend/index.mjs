import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongo from './db/config.mjs'
import {
  fetchDataToClient,
  fetchDataToServer,
} from './server/utility/fetchData.mjs'
import Routes from './server/routes/index.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'
import OptObj from './server/utility/fetchOptionObj.mjs'
import { fetchArgs } from './server/utility/apiAuth.mjs'
import {
  createMovie,
  createTV,
  createMusic,
  createGame,
  createBook,
} from './db/models/dbModels.mjs'

connectToMongo()

const PORT = 8000
const app = express()
app.use(cors())

// Authenticate IGDB
app.use(['/games/search/:query', '/games/:id'], igdbAuth)

// Spotify authentication
app.use(['/music/search/:query', '/music/:id'], spotifyAuth)

// Routes middleware
app.use('/', Routes)

// Get a movie by id
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.id, ...fetchArgs.movie)
  url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
  fetchDataToClient(url, options, res)
})
// Add a movie by an id to the database
app.post('/movies/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.id, ...fetchArgs.movie)
  url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
  saveToDatabaseByID(req, res, url, options, createMovie)
})

app.get('/tv/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.id, ...fetchArgs.tv)
  url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`
  fetchDataToClient(url, options, res)
})
app.post('/tv/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.id, ...fetchArgs.tv)
  url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`
  saveToDatabaseByID(req, res, url, options, createTV)
})

app.get('/games/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.game(req.params.id, ...fetchArgs.game)
  options.body = `fields name,summary,cover.url,first_release_date,age_ratings,aggregated_rating,platforms; where id = ${id};`
  fetchDataToClient(url, options, res)
})
app.post('/games/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.game(req.params.id, ...fetchArgs.game)
  options.body = `fields name,summary,cover.url,genres,first_release_date,age_ratings,aggregated_rating,platforms; where id = ${id};`
  console.log(options)
  saveToDatabaseByID(req, res, url, options, createGame)
})

app.get('/music/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.music(req.params.id, ...fetchArgs.music)
  url = `https://api.spotify.com/v1/tracks/${id}`
  fetchDataToClient(url, options, res)
})
app.post('/music/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.music(req.params.id, ...fetchArgs.music)
  url = `https://api.spotify.com/v1/tracks/${id}`
  saveToDatabaseByID(req, res, url, options, createMusic)
})

app.get('/books/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.book(req.params.id, ...fetchArgs.book)
  url = `https://www.googleapis.com/books/v1/volumes/${id}`
  fetchDataToClient(url, options, res)
})
app.post('/books/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.book(req.params.id, ...fetchArgs.book)
  url = `https://www.googleapis.com/books/v1/volumes/${id}`
  saveToDatabaseByID(req, res, url, options, createBook)
})

async function saveToDatabaseByID(req, res, url, options, createMedia) {
  const data = await fetchDataToServer(url, options)
  createMedia(data)
  res.sendStatus(200)
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
