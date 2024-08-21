import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectToMongo from './db/config.mjs'
import {
  fetchDataToClient,
  fetchDataToServer,
} from './server/utility/fetchData.mjs'
import { movieSchema } from './db/schema.mjs'
import Routes from './server/routes/index.mjs'
import { igdbAuth, spotifyAuth } from './server/utility/apiAuth.mjs'
import OptObj from './server/utility/fetchOptionObj.mjs'
import { fetchArgs } from './server/utility/apiAuth.mjs'
import { createMovie } from './db/models/movietvmodel.mjs'

connectToMongo()

const PORT = 8000
const app = express()
app.use(cors())

// Authenticate IGDB
app.use('/games/:name', igdbAuth)

// Spotify authentication
app.use('/music/:name', spotifyAuth)

// Routes middleware
app.use('/', Routes)

// Get a movie by id
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.query, ...fetchArgs.movie)
  url = `https://api.themoviedb.org/3/movie/${id}`
  fetchDataToClient(url, options, res)
})

// Add a movie by an id to the database
app.post('/movies/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.query, ...fetchArgs.movie)
  url = `https://api.themoviedb.org/3/movie/${id}`
  const data = await fetchDataToServer(url, options)
  createMovie(data)
  res.sendStatus(200)
})

app.get('/tv/:id', async (req, res) => {
  const { id } = req.params
  let { url, options } = OptObj.movie(req.params.query, ...fetchArgs.movie)
  url = `https://api.themoviedb.org/3/movie/${id}`
  fetchDataToClient(url, options, res)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
